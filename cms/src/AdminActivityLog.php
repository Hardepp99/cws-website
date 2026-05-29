<?php

declare(strict_types=1);

final class AdminActivityLog
{
    private const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

    /** @var array{id:int,username:string,display_name?:string,role?:string}|null */
    private static ?array $pendingUser = null;

    private static ?string $pendingMethod = null;

    private static ?string $pendingPath = null;

    private static bool $shutdownRegistered = false;

    /**
     * Queue CUD logging after the request completes successfully (2xx).
     *
     * @param array{id:int,username:string,display_name?:string,role?:string} $user
     */
    public static function registerMutationHook(array $user, string $method, string $path): void
    {
        if (!self::shouldLogMutation($method, $path)) {
            return;
        }

        self::$pendingUser = $user;
        self::$pendingMethod = $method;
        self::$pendingPath = $path;

        if (self::$shutdownRegistered) {
            return;
        }
        self::$shutdownRegistered = true;
        register_shutdown_function(static function (): void {
            if (self::$pendingUser === null || self::$pendingMethod === null || self::$pendingPath === null) {
                return;
            }
            $code = http_response_code();
            if ($code < 200 || $code >= 300) {
                return;
            }
            $desc = self::describeMutation(self::$pendingMethod, self::$pendingPath);
            self::record(
                self::$pendingUser,
                $desc['action'],
                self::$pendingMethod,
                self::$pendingPath,
                $desc['summary'],
                self::metaWithContext($desc),
            );
        });
    }

    public static function shouldLogMutation(string $method, string $path): bool
    {
        if (!in_array($method, self::MUTATION_METHODS, true)) {
            return false;
        }

        if ($path === '/login' || $path === '/logout') {
            return false;
        }

        if ($path === '/crm/smtp/test') {
            return false;
        }

        if (str_starts_with($path, '/users')) {
            return false;
        }

        if ($path === '/activity/list') {
            return false;
        }

        if ($method === 'PATCH' && preg_match('#^/crm/messages/\d+$#', $path)) {
            return false;
        }

        if ($method === 'POST' && $path === '/crm/trash/empty') {
            return false;
        }

        return true;
    }

    /**
     * Log inbox read/star/folder changes with a clear description (not generic "updated message").
     *
     * @param array{id:int,username:string} $user
     * @param array<string, mixed> $body PATCH body
     * @param array<string, mixed> $row  DB row before change
     */
    public static function recordInboxPatch(array $user, int $messageId, array $body, array $row): void
    {
        $desc = self::describeInboxPatch($messageId, $body, $row);
        if ($desc === null) {
            return;
        }
        self::record(
            $user,
            $desc['action'],
            'PATCH',
            '/crm/messages/' . $messageId,
            $desc['summary'],
            $desc['meta'] ?? null,
        );
    }

    /**
     * @param array<string, mixed> $body
     * @param array<string, mixed> $row
     * @return array{action:string,summary:string,meta:array<string,mixed>}|null
     */
    public static function describeInboxPatch(int $messageId, array $body, array $row): ?array
    {
        $label = self::inboxMessageLabel($row);
        $meta = [
            'messageId' => $messageId,
            'threadId'  => (int) ($row['thread_id'] ?? $messageId),
            'subject'   => $row['subject'] ?? null,
            'fromEmail' => $row['from_email'] ?? null,
            'task'      => 'inbox',
        ];

        if (array_key_exists('is_read', $body)) {
            $read = (bool) $body['is_read'];
            return [
                'action'  => $read ? 'inbox.read' : 'inbox.unread',
                'summary' => ($read ? 'Marked as read' : 'Marked as unread') . ': ' . $label,
                'meta'    => array_merge($meta, [
                    'hint' => $read
                        ? 'Opened or marked this form submission / email as read.'
                        : 'Marked this message unread in the inbox.',
                ]),
            ];
        }

        if (array_key_exists('is_starred', $body)) {
            $star = (bool) $body['is_starred'];
            return [
                'action'  => $star ? 'inbox.star' : 'inbox.unstar',
                'summary' => ($star ? 'Starred' : 'Removed star from') . ' ' . $label,
                'meta'    => array_merge($meta, [
                    'hint' => $star ? 'Flagged for follow-up.' : 'Removed the star flag.',
                ]),
            ];
        }

        if (array_key_exists('folder', $body)) {
            $folder = (string) $body['folder'];
            return match ($folder) {
                'trash' => [
                    'action'  => 'inbox.trash',
                    'summary' => 'Moved to trash: ' . $label,
                    'meta'    => array_merge($meta, [
                        'folder' => 'trash',
                        'hint'   => 'Message moved to trash (conversation thread). Only an admin can empty trash permanently.',
                    ]),
                ],
                'archive' => [
                    'action'  => 'inbox.archive',
                    'summary' => 'Archived: ' . $label,
                    'meta'    => array_merge($meta, [
                        'folder' => 'archive',
                        'hint'   => 'Moved out of the inbox into archive.',
                    ]),
                ],
                'inbox' => [
                    'action'  => 'inbox.restore',
                    'summary' => 'Restored to inbox: ' . $label,
                    'meta'    => array_merge($meta, [
                        'folder' => 'inbox',
                        'hint'   => 'Moved back to the active inbox.',
                    ]),
                ],
                default => null,
            };
        }

        return null;
    }

    /** @param array<string, mixed> $row */
    public static function inboxMessageLabel(array $row): string
    {
        $subject = trim((string) ($row['subject'] ?? ''));
        $name = trim((string) ($row['from_name'] ?? ''));
        $email = trim((string) ($row['from_email'] ?? ''));
        if ($subject !== '') {
            return $subject . ($email !== '' ? " ({$email})" : '');
        }
        if ($name !== '') {
            return $name . ($email !== '' ? " <{$email}>" : '');
        }
        if ($email !== '') {
            return $email;
        }
        return 'message #' . (int) ($row['id'] ?? 0);
    }

    /** @param array{id:int,username:string} $user */
    public static function recordTrashEmpty(array $user, int $count): void
    {
        self::record(
            $user,
            'inbox.trash_empty',
            'POST',
            '/crm/trash/empty',
            $count > 0
                ? "Emptied trash — permanently deleted {$count} message(s)"
                : 'Emptied trash (no messages to delete)',
            [
                'task'  => 'inbox',
                'count' => $count,
                'hint'  => 'Permanently removed all messages from the CRM trash. This action is admin-only.',
            ],
        );
    }

    /**
     * @return array{action:string,summary:string,meta?:array<string,mixed>}
     */
    public static function describeMutation(string $method, string $path): array
    {
        $permanent = isset($_GET['permanent']) && $_GET['permanent'] === '1';

        if ($method === 'POST' && $path === '/homepage/sections') {
            return ['action' => 'homepage.section.create', 'summary' => 'Added a homepage section'];
        }
        if ($method === 'PUT' && preg_match('#^/homepage/sections/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'homepage.section.update',
                'summary' => 'Updated homepage section #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'POST' && preg_match('#^/homepage/sections/(\d+)/restore$#', $path, $m)) {
            return [
                'action'  => 'homepage.section.restore',
                'summary' => 'Restored homepage section #' . $m[1] . ' from trash',
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'DELETE' && preg_match('#^/homepage/sections/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'homepage.section.delete',
                'summary' => $permanent
                    ? 'Permanently deleted homepage section #' . $m[1]
                    : 'Moved homepage section #' . $m[1] . ' to trash',
                'meta'    => ['id' => (int) $m[1], 'permanent' => $permanent],
            ];
        }
        if ($method === 'PUT' && $path === '/homepage/sections') {
            return ['action' => 'homepage.section.reorder', 'summary' => 'Reordered homepage sections'];
        }

        if ($method === 'POST' && $path === '/pages') {
            return ['action' => 'page.create', 'summary' => 'Created a new site page'];
        }
        if ($method === 'PUT' && preg_match('#^/pages/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'page.update',
                'summary' => 'Updated site page #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'PUT' && preg_match('#^/pages/(\d+)/display-mode$#', $path, $m)) {
            return [
                'action'  => 'page.editor_mode',
                'summary' => 'Changed editor mode for site page #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }

        if ($method === 'POST' && $path === '/landings') {
            return ['action' => 'landing.create', 'summary' => 'Created a service landing page'];
        }
        if ($method === 'PUT' && preg_match('#^/landings/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'landing.update',
                'summary' => 'Updated service landing #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'PUT' && preg_match('#^/landings/(\d+)/display-mode$#', $path, $m)) {
            return [
                'action'  => 'landing.editor_mode',
                'summary' => 'Changed editor mode for service landing #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }

        if ($method === 'POST' && $path === '/blog') {
            return ['action' => 'blog.create', 'summary' => 'Created a blog post'];
        }
        if ($method === 'PUT' && preg_match('#^/blog/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'blog.update',
                'summary' => 'Updated blog post #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'PUT' && preg_match('#^/blog/(\d+)/display-mode$#', $path, $m)) {
            return [
                'action'  => 'blog.editor_mode',
                'summary' => 'Changed editor mode for blog post #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }

        if ($method === 'POST' && $path === '/portfolio') {
            return ['action' => 'portfolio.create', 'summary' => 'Added a portfolio project'];
        }
        if ($method === 'PUT' && preg_match('#^/portfolio/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'portfolio.update',
                'summary' => 'Updated portfolio project #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'DELETE' && preg_match('#^/portfolio/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'portfolio.delete',
                'summary' => 'Deleted portfolio project #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }

        if ($method === 'POST' && $path === '/services') {
            return ['action' => 'service.create', 'summary' => 'Created a service'];
        }
        if ($method === 'PUT' && preg_match('#^/services/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'service.update',
                'summary' => 'Updated service #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'PUT' && preg_match('#^/services/(\d+)/display-mode$#', $path, $m)) {
            return [
                'action'  => 'service.editor_mode',
                'summary' => 'Changed editor mode for service #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }

        if ($method === 'PUT' && $path === '/settings') {
            return ['action' => 'settings.update', 'summary' => 'Updated site settings'];
        }
        if ($method === 'POST' && $path === '/gmb/sync') {
            return ['action' => 'gmb.sync', 'summary' => 'Synced Google reviews'];
        }
        if ($method === 'PUT' && preg_match('#^/menus/([a-zA-Z_]+)$#', $path, $m)) {
            return [
                'action'  => 'menu.update',
                'summary' => 'Updated navigation menu: ' . self::friendlyMenuKey($m[1]),
                'meta'    => ['menu' => $m[1]],
            ];
        }
        if ($method === 'PUT' && $path === '/menus') {
            return ['action' => 'menu.update', 'summary' => 'Updated navigation menus'];
        }
        if ($method === 'PUT' && $path === '/pricing') {
            return ['action' => 'pricing.update', 'summary' => 'Updated Ask Price form options'];
        }

        if ($method === 'POST' && $path === '/crm/compose') {
            return ['action' => 'inbox.compose', 'summary' => 'Sent email(s) from inbox'];
        }
        if ($method === 'POST' && preg_match('#^/crm/messages/(\d+)/reply$#', $path, $m)) {
            return [
                'action'  => 'inbox.reply',
                'summary' => 'Replied to inbox message #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'PUT' && $path === '/crm/smtp') {
            return ['action' => 'email.settings', 'summary' => 'Updated SMTP email settings'];
        }

        if ($method === 'POST' && $path === '/media/upload') {
            return ['action' => 'media.upload', 'summary' => 'Uploaded a media file'];
        }
        if ($method === 'PUT' && preg_match('#^/media/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'media.update',
                'summary' => 'Updated media file #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'POST' && preg_match('#^/media/(\d+)/crop$#', $path, $m)) {
            return [
                'action'  => 'media.crop',
                'summary' => 'Cropped media file #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'DELETE' && preg_match('#^/media/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'media.delete',
                'summary' => 'Deleted media file #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }

        if ($method === 'PUT' && preg_match('#^/desimentor/([a-z_]+)/(\d+)$#', $path, $m)) {
            $label = self::friendlyEntityType($m[1]);
            return [
                'action'  => 'desimentor.save',
                'summary' => 'Saved Desimentor layout for ' . $label . ' #' . $m[2],
                'meta'    => ['entityType' => $m[1], 'id' => (int) $m[2]],
            ];
        }
        if ($method === 'POST' && preg_match('#^/desimentor/([a-z_]+)/(\d+)/publish$#', $path, $m)) {
            $label = self::friendlyEntityType($m[1]);
            return [
                'action'  => 'desimentor.publish',
                'summary' => 'Published Desimentor layout for ' . $label . ' #' . $m[2],
                'meta'    => ['entityType' => $m[1], 'id' => (int) $m[2]],
            ];
        }
        if ($method === 'POST' && $path === '/desimentor/templates') {
            return ['action' => 'desimentor.template.create', 'summary' => 'Created a Desimentor template'];
        }
        if ($method === 'PUT' && preg_match('#^/desimentor/templates/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'desimentor.template.update',
                'summary' => 'Updated Desimentor template #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }
        if ($method === 'DELETE' && preg_match('#^/desimentor/templates/(\d+)$#', $path, $m)) {
            return [
                'action'  => 'desimentor.template.delete',
                'summary' => 'Deleted Desimentor template #' . $m[1],
                'meta'    => ['id' => (int) $m[1]],
            ];
        }

        $verb = match ($method) {
            'POST'   => 'Created',
            'PUT'    => 'Updated',
            'PATCH'  => 'Updated',
            'DELETE' => 'Deleted',
            default  => 'Changed',
        };

        return [
            'action'  => 'content.change',
            'summary' => $verb . ' content (' . trim($method . ' ' . $path) . ')',
        ];
    }

    /** @param array{id:int,username:string,display_name?:string,role?:string} $user */
    public static function record(
        array $user,
        string $action,
        string $method,
        string $path,
        string $summary = '',
        ?array $meta = null,
    ): void {
        try {
            $stmt = cws_db()->prepare(
                'INSERT INTO admin_activity_log (user_id, username, action, method, path, summary, meta_json, ip_address)
                 VALUES (:uid, :un, :act, :m, :p, :s, :meta, :ip)'
            );
            $stmt->execute([
                ':uid'   => (int) $user['id'],
                ':un'    => (string) ($user['username'] ?? ''),
                ':act'   => $action,
                ':m'     => $method,
                ':p'     => $path,
                ':s'     => $summary !== '' ? $summary : self::defaultSummary($action, $method, $path),
                ':meta'  => $meta !== null ? json_encode($meta, JSON_UNESCAPED_UNICODE) : null,
                ':ip'    => self::clientIp(),
            ]);
        } catch (Throwable $e) {
            // Never block admin API if logging fails
        }
    }

    /** @return list<array{id:string,label:string}> */
    public static function taskFilterOptions(): array
    {
        return [
            ['id' => '', 'label' => 'All tasks'],
            ['id' => 'auth', 'label' => 'Sign-in & sign-out'],
            ['id' => 'users', 'label' => 'User accounts'],
            ['id' => 'homepage', 'label' => 'Homepage'],
            ['id' => 'pages', 'label' => 'Pages'],
            ['id' => 'landings', 'label' => 'Service landings'],
            ['id' => 'blog', 'label' => 'Blog'],
            ['id' => 'portfolio', 'label' => 'Portfolio'],
            ['id' => 'services', 'label' => 'Services'],
            ['id' => 'media', 'label' => 'Media library'],
            ['id' => 'site', 'label' => 'Site settings & menus'],
            ['id' => 'inbox', 'label' => 'Inbox & email'],
            ['id' => 'desimentor', 'label' => 'Desimentor'],
        ];
    }

    public static function list(
        int $page,
        int $perPage,
        ?int $userId = null,
        string $search = '',
        string $task = '',
        bool $excludeNoise = true,
    ): array {
        $page = max(1, $page);
        $perPage = min(100, max(10, $perPage));
        $offset = ($page - 1) * $perPage;
        $db = cws_db();

        $whereParts = [];
        $params = [];
        if ($userId !== null && $userId > 0) {
            $whereParts[] = 'user_id = :uid';
            $params[':uid'] = $userId;
        }
        if ($excludeNoise) {
            $whereParts[] = "action NOT IN ('api.request')";
        }
        if ($search !== '') {
            $whereParts[] = '(summary LIKE :q OR username LIKE :q OR action LIKE :q OR path LIKE :q)';
            $params[':q'] = '%' . $search . '%';
        }
        $taskSql = self::taskFilterSql($task, $params);
        if ($taskSql !== '') {
            $whereParts[] = $taskSql;
        }
        $where = $whereParts !== [] ? ' WHERE ' . implode(' AND ', $whereParts) : '';

        $countStmt = $db->prepare("SELECT COUNT(*) FROM admin_activity_log{$where}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $sql = "SELECT id, user_id, username, action, method, path, summary, meta_json, ip_address, created_at
                FROM admin_activity_log{$where}
                ORDER BY created_at DESC, id DESC
                LIMIT {$perPage} OFFSET {$offset}";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = self::enrichItem([
                'id'         => (int) $row['id'],
                'userId'     => (int) $row['user_id'],
                'username'   => (string) $row['username'],
                'action'     => (string) $row['action'],
                'method'     => (string) $row['method'],
                'path'       => (string) $row['path'],
                'summary'    => (string) $row['summary'],
                'meta'       => $row['meta_json'] ? json_decode((string) $row['meta_json'], true) : null,
                'ipAddress'  => $row['ip_address'],
                'createdAt'  => (string) $row['created_at'],
            ]);
        }

        return [
            'items'       => $items,
            'total'       => $total,
            'page'        => $page,
            'perPage'     => $perPage,
            'taskFilters' => self::taskFilterOptions(),
        ];
    }

    /** @param array{action:string,summary:string,meta?:array<string,mixed>,hint?:string,task?:string} $desc */
    private static function metaWithContext(array $desc): ?array
    {
        $meta = $desc['meta'] ?? [];
        if (!is_array($meta)) {
            $meta = [];
        }
        $meta['task'] = $desc['task'] ?? self::taskKeyFromAction($desc['action']);
        $meta['hint'] = $desc['hint'] ?? self::hintForAction($desc['action'], $meta, $desc['summary']);
        return $meta;
    }

    /** @param array<string, mixed> $row */
    private static function enrichItem(array $row): array
    {
        $action = (string) $row['action'];
        $meta = is_array($row['meta'] ?? null) ? $row['meta'] : [];
        $summary = (string) $row['summary'];
        $taskKey = (string) ($meta['task'] ?? self::taskKeyFromAction($action));

        return array_merge($row, [
            'task'      => $taskKey,
            'taskLabel' => self::taskLabel($taskKey),
            'verb'      => self::verbLabel($action),
            'hint'      => (string) ($meta['hint'] ?? self::hintForAction($action, $meta, $summary)),
        ]);
    }

    private static function taskKeyFromAction(string $action): string
    {
        $root = explode('.', $action)[0] ?? $action;
        return match ($root) {
            'user'   => 'users',
            'menu', 'pricing', 'gmb', 'email', 'settings' => 'site',
            default  => $root,
        };
    }

    private static function taskLabel(string $taskKey): string
    {
        foreach (self::taskFilterOptions() as $opt) {
            if ($opt['id'] === $taskKey) {
                return $opt['label'];
            }
        }
        return ucfirst(str_replace('_', ' ', $taskKey));
    }

    private static function verbLabel(string $action): string
    {
        if ($action === 'auth.login') {
            return 'Signed in';
        }
        if ($action === 'auth.logout') {
            return 'Signed out';
        }
        $part = explode('.', $action)[1] ?? '';
        return match ($part) {
            'create'      => 'Created',
            'update'      => 'Updated',
            'delete'      => 'Deleted',
            'upload'      => 'Uploaded',
            'restore'     => 'Restored',
            'publish'     => 'Published',
            'compose'     => 'Sent',
            'reply'       => 'Replied',
            'sync'        => 'Synced',
            'crop'        => 'Edited',
            'read'        => 'Read',
            'unread'      => 'Unread',
            'star'        => 'Starred',
            'unstar'      => 'Unstarred',
            'trash'       => 'Trashed',
            'trash_empty' => 'Emptied trash',
            'archive'     => 'Archived',
            default       => 'Changed',
        };
    }

    /** @param array<string, mixed> $meta */
    private static function hintForAction(string $action, array $meta, string $summary): string
    {
        if (isset($meta['hint']) && is_string($meta['hint']) && $meta['hint'] !== '') {
            return $meta['hint'];
        }

        $id = isset($meta['id']) ? (int) $meta['id'] : null;

        return match (true) {
            $action === 'auth.login' => 'User opened an admin session.',
            $action === 'auth.logout' => 'User ended their admin session.',
            str_starts_with($action, 'user.create') => 'A new CMS login account was added.',
            str_starts_with($action, 'user.update') => 'An existing CMS user profile or password was changed.',
            str_starts_with($action, 'user.delete') => 'A CMS user account was removed.',
            str_starts_with($action, 'homepage.') => $id
                ? "Homepage builder section (row #{$id})."
                : 'Homepage sections or their order.',
            str_starts_with($action, 'page.') => $id
                ? "Site page #{$id} — content, SEO, or publish state."
                : 'Site pages in the CMS.',
            str_starts_with($action, 'landing.') => $id
                ? "Service landing page #{$id}."
                : 'Service landing pages.',
            str_starts_with($action, 'blog.') => $id
                ? "Blog post #{$id} — article content or visibility."
                : 'Blog posts.',
            str_starts_with($action, 'portfolio.') => $id
                ? "Portfolio entry #{$id}."
                : 'Portfolio projects.',
            str_starts_with($action, 'service.') => $id
                ? "Service listing #{$id}."
                : 'Services catalog.',
            str_starts_with($action, 'media.') => $id
                ? "Media library file #{$id}."
                : 'Files in the media library.',
            $action === 'settings.update' => 'Global site identity, colors, or contact details.',
            str_starts_with($action, 'menu.') => isset($meta['menu'])
                ? 'Navigation: ' . self::friendlyMenuKey((string) $meta['menu']) . '.'
                : 'Header or footer navigation links.',
            $action === 'pricing.update' => 'Ask Price / lead form field options.',
            $action === 'gmb.sync' => 'Google reviews pulled into the site.',
            $action === 'email.settings' => 'SMTP host and sender settings for outbound mail.',
            $action === 'inbox.read' => 'Marked a form submission or email as read in the inbox.',
            $action === 'inbox.unread' => 'Marked a message as unread in the inbox.',
            $action === 'inbox.trash' => 'Moved a message (and its thread) to trash.',
            $action === 'inbox.trash_empty' => 'Permanently deleted all messages in trash (admin only).',
            $action === 'inbox.archive' => 'Archived an inbox message.',
            $action === 'inbox.restore' => 'Restored a message from archive or trash to the inbox.',
            str_starts_with($action, 'inbox.') => $id
                ? "CRM inbox — message #{$id}."
                : 'CRM inbox — form leads and outbound email.',
            str_starts_with($action, 'desimentor.') => $id
                ? 'Desimentor visual layout' . (isset($meta['entityType'])
                    ? ' for ' . self::friendlyEntityType((string) $meta['entityType'])
                    : '') . " #{$id}."
                : 'Desimentor page builder.',
            default => $summary,
        };
    }

    /** @param array<string, mixed> $params */
    private static function taskFilterSql(string $task, array &$params): string
    {
        $task = trim($task);
        if ($task === '') {
            return '';
        }

        $prefixes = match ($task) {
            'auth'      => ['auth'],
            'users'     => ['user'],
            'homepage'  => ['homepage'],
            'pages'     => ['page'],
            'landings'  => ['landing'],
            'blog'      => ['blog'],
            'portfolio' => ['portfolio'],
            'services'  => ['service'],
            'media'     => ['media'],
            'site'      => ['settings', 'menu', 'pricing', 'gmb', 'email'],
            'inbox'     => ['inbox'],
            'desimentor' => ['desimentor'],
            default     => [$task],
        };

        $ors = [];
        foreach ($prefixes as $i => $prefix) {
            $key = ':task' . $i;
            $ors[] = "action LIKE {$key}";
            $params[$key] = $prefix . '.%';
        }

        return '(' . implode(' OR ', $ors) . ')';
    }

    private static function friendlyEntityType(string $type): string
    {
        return match ($type) {
            'page'             => 'page',
            'service_landing'  => 'service landing',
            'blog_post'        => 'blog post',
            'service'          => 'service',
            default            => str_replace('_', ' ', $type),
        };
    }

    private static function friendlyMenuKey(string $key): string
    {
        return match ($key) {
            'header_main'     => 'Header',
            'footer_company'  => 'Footer — Company',
            'footer_services' => 'Footer — Services',
            'footer_products' => 'Footer — Products',
            default           => str_replace('_', ' ', $key),
        };
    }

    private static function defaultSummary(string $action, string $method, string $path): string
    {
        if ($action === 'auth.login') {
            return 'Signed in';
        }
        if ($action === 'auth.logout') {
            return 'Signed out';
        }
        $desc = self::describeMutation($method, $path);
        return $desc['summary'];
    }

    private static function clientIp(): ?string
    {
        $keys = ['HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        foreach ($keys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = trim(explode(',', (string) $_SERVER[$key])[0]);
                return $ip !== '' ? substr($ip, 0, 45) : null;
            }
        }
        return null;
    }
}
