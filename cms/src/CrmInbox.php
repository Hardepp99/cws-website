<?php

declare(strict_types=1);

final class CrmInbox
{
    private const SMTP_KEYS = [
        'smtpHost',
        'smtpPort',
        'smtpEncryption',
        'smtpUsername',
        'smtpPassword',
        'smtpFromEmail',
        'smtpFromName',
    ];

    private const LEAD_TYPES = ['ask_price', 'lead', 'ask-price', 'callback', 'quote'];

    public function __construct(
        private readonly PDO $db,
        private readonly ContentRepository $repo,
    ) {}

    public function saveInbound(string $type, array $payload): int
    {
        $meta = $this->extractMeta($type, $payload);
        $stmt = $this->db->prepare(
            'INSERT INTO form_submissions
             (form_type, payload, from_name, from_email, subject, snippet, folder, direction, is_read, last_activity_at)
             VALUES (:t, :p, :fn, :fe, :sub, :sn, :folder, :dir, 0, NOW())'
        );
        $stmt->execute([
            ':t'      => $type,
            ':p'      => json_encode($payload, JSON_UNESCAPED_UNICODE),
            ':fn'     => $meta['from_name'],
            ':fe'     => $meta['from_email'],
            ':sub'    => $meta['subject'],
            ':sn'     => $meta['snippet'],
            ':folder' => 'inbox',
            ':dir'    => 'inbound',
        ]);
        $id = (int) $this->db->lastInsertId();
        $this->db->prepare('UPDATE form_submissions SET thread_id = :id WHERE id = :id')->execute([':id' => $id]);
        return $id;
    }

    public function backfillSubmissionMeta(): void
    {
        $rows = $this->db->query(
            'SELECT id, form_type, payload FROM form_submissions
             WHERE (from_email IS NULL OR from_email = "") AND direction = "inbound"'
        )->fetchAll();
        foreach ($rows as $row) {
            $payload = json_decode((string) $row['payload'], true);
            if (!is_array($payload)) {
                $payload = [];
            }
            $meta = $this->extractMeta((string) $row['form_type'], $payload);
            $this->db->prepare(
                'UPDATE form_submissions SET
                 from_name = :fn, from_email = :fe, subject = :sub, snippet = :sn,
                 thread_id = COALESCE(thread_id, id),
                 last_activity_at = COALESCE(last_activity_at, created_at)
                 WHERE id = :id'
            )->execute([
                ':fn'  => $meta['from_name'],
                ':fe'  => $meta['from_email'],
                ':sub' => $meta['subject'],
                ':sn'  => $meta['snippet'],
                ':id'  => (int) $row['id'],
            ]);
        }
        $this->db->exec(
            'UPDATE form_submissions SET last_activity_at = created_at WHERE last_activity_at IS NULL'
        );
    }

    public function listInbox(
        int $page,
        int $perPage,
        string $folder = 'inbox',
        string $category = 'all',
        string $search = '',
        bool $unreadOnly = false
    ): array {
        if ($folder === 'trash') {
            $where = 'WHERE folder = "trash"';
            $params = [];
        } else {
            $where = 'WHERE direction = "inbound"';
            $params = [];
            if ($folder !== 'all') {
                $where .= ' AND folder = :folder';
                $params[':folder'] = $folder;
            }
        }

        if ($unreadOnly) {
            $where .= ' AND is_read = 0';
        }

        if ($category === 'unread') {
            $where .= ' AND is_read = 0';
        } elseif ($category === 'starred') {
            $where .= ' AND is_starred = 1';
        } elseif ($category === 'leads') {
            $placeholders = [];
            foreach (self::LEAD_TYPES as $i => $t) {
                $key = ':lt' . $i;
                $placeholders[] = $key;
                $params[$key] = $t;
            }
            $where .= ' AND form_type IN (' . implode(',', $placeholders) . ')';
        } elseif ($category !== 'all' && $category !== '') {
            $where .= ' AND form_type = :cat';
            $params[':cat'] = $category;
        }

        if ($search !== '') {
            $where .= ' AND (subject LIKE :q OR snippet LIKE :q2 OR from_name LIKE :q3
                OR from_email LIKE :q4 OR payload LIKE :q5 OR form_type LIKE :q6)';
            $like = '%' . $search . '%';
            $params[':q'] = $like;
            $params[':q2'] = $like;
            $params[':q3'] = $like;
            $params[':q4'] = $like;
            $params[':q5'] = $like;
            $params[':q6'] = $like;
        }

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM form_submissions {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);
        $offset = max(0, ($page - 1) * $perPage);

        $stmt = $this->db->prepare(
            "SELECT id, form_type, from_name, from_email, subject, snippet, is_read, is_starred,
                    folder, direction, thread_id, created_at, last_activity_at
             FROM form_submissions {$where}
             ORDER BY COALESCE(last_activity_at, created_at) DESC
             LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $items = array_map(fn (array $r) => $this->mapListRow($r), $stmt->fetchAll());

        return ['items' => $items, 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function listSent(int $page, int $perPage, string $search = ''): array
    {
        $where = 'WHERE direction = "outbound"';
        $params = [];
        if ($search !== '') {
            $where .= ' AND (subject LIKE :q OR snippet LIKE :q2 OR from_email LIKE :q3 OR payload LIKE :q4)';
            $like = '%' . $search . '%';
            $params[':q'] = $like;
            $params[':q2'] = $like;
            $params[':q3'] = $like;
            $params[':q4'] = $like;
        }
        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM form_submissions {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);
        $offset = max(0, ($page - 1) * $perPage);
        $stmt = $this->db->prepare(
            "SELECT id, form_type, from_name, from_email, subject, snippet, is_read, is_starred,
                    folder, direction, thread_id, parent_id, created_at, last_activity_at
             FROM form_submissions {$where}
             ORDER BY created_at DESC LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return [
            'items'   => array_map(fn (array $r) => $this->mapListRow($r), $stmt->fetchAll()),
            'total'   => $total,
            'page'    => $page,
            'perPage' => $perPage,
        ];
    }

    public function getStats(): array
    {
        $inbox = (int) $this->db->query(
            'SELECT COUNT(*) AS c FROM form_submissions WHERE direction = "inbound" AND folder = "inbox"'
        )->fetch()['c'];
        $unread = (int) $this->db->query(
            'SELECT COUNT(*) AS c FROM form_submissions WHERE direction = "inbound" AND folder = "inbox" AND is_read = 0'
        )->fetch()['c'];
        $starred = (int) $this->db->query(
            'SELECT COUNT(*) AS c FROM form_submissions WHERE is_starred = 1 AND folder != "trash"'
        )->fetch()['c'];

        $byType = [];
        foreach ($this->db->query(
            'SELECT form_type, COUNT(*) AS c FROM form_submissions
             WHERE direction = "inbound" AND folder = "inbox" AND is_read = 0
             GROUP BY form_type'
        ) as $row) {
            $type = (string) $row['form_type'];
            $key = in_array($type, self::LEAD_TYPES, true) ? 'leads' : $type;
            $byType[$key] = ($byType[$key] ?? 0) + (int) $row['c'];
        }

        $trash = (int) $this->db->query(
            'SELECT COUNT(*) AS c FROM form_submissions WHERE folder = "trash"'
        )->fetch()['c'];

        return [
            'inbox'   => $inbox,
            'unread'  => $unread,
            'starred' => $starred,
            'trash'   => $trash,
            'byCategory' => $byType,
        ];
    }

    public function getMessage(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM form_submissions WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $threadId = (int) ($row['thread_id'] ?: $row['id']);
        $threadStmt = $this->db->prepare(
            'SELECT * FROM form_submissions WHERE thread_id = :tid OR id = :tid2 ORDER BY created_at ASC'
        );
        $threadStmt->execute([':tid' => $threadId, ':tid2' => $threadId]);
        $thread = [];
        foreach ($threadStmt->fetchAll() as $t) {
            $thread[] = $this->mapDetailRow($t);
        }
        return [
            'message' => $this->mapDetailRow($row),
            'thread'  => $thread,
        ];
    }

    /**
     * @param array{id:int,username:string}|null $actor
     */
    public function patchMessage(int $id, array $body, ?array $actor = null): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM form_submissions WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        if ($actor !== null) {
            AdminActivityLog::recordInboxPatch($actor, $id, $body, $row);
        }

        if (array_key_exists('folder', $body)) {
            $folder = (string) $body['folder'];
            if (in_array($folder, ['inbox', 'archive', 'trash'], true)) {
                $threadId = (int) ($row['thread_id'] ?: $row['id']);
                $this->db->prepare(
                    'UPDATE form_submissions SET folder = :f WHERE thread_id = :tid OR id = :tid'
                )->execute([':f' => $folder, ':tid' => $threadId]);
            }
        }

        $sets = [];
        $params = [':id' => $id];
        foreach (['is_read', 'is_starred'] as $key) {
            if (!array_key_exists($key, $body)) {
                continue;
            }
            $val = $body[$key] ? 1 : 0;
            $sets[] = "{$key} = :{$key}";
            $params[":{$key}"] = $val;
        }
        if ($sets !== []) {
            $sql = 'UPDATE form_submissions SET ' . implode(', ', $sets) . ' WHERE id = :id';
            $this->db->prepare($sql)->execute($params);
        }

        return $this->getMessage($id);
    }

    /**
     * Permanently delete all messages in trash (admin only).
     *
     * @param array{id:int,username:string} $actor
     */
    public function emptyTrash(array $actor): array
    {
        $count = (int) $this->db->query(
            'SELECT COUNT(*) FROM form_submissions WHERE folder = "trash"'
        )->fetchColumn();
        $this->db->exec('DELETE FROM form_submissions WHERE folder = "trash"');
        AdminActivityLog::recordTrashEmpty($actor, $count);

        return ['success' => true, 'deleted' => $count];
    }

    public function listContacts(string $search = ''): array
    {
        $where = "WHERE direction = 'inbound' AND from_email IS NOT NULL AND TRIM(from_email) != ''";
        $params = [];
        if ($search !== '') {
            $where .= ' AND (from_email LIKE :q OR from_name LIKE :q2 OR form_type LIKE :q3)';
            $like = '%' . $search . '%';
            $params[':q'] = $like;
            $params[':q2'] = $like;
            $params[':q3'] = $like;
        }

        $sql = "SELECT
                    MAX(id) AS latest_id,
                    from_email,
                    MAX(from_name) AS from_name,
                    MAX(form_type) AS form_type,
                    MAX(created_at) AS last_seen
                FROM form_submissions
                {$where}
                GROUP BY LOWER(TRIM(from_email))
                ORDER BY last_seen DESC
                LIMIT 500";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $items = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $email = trim((string) $row['from_email']);
            if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                continue;
            }
            $items[] = [
                'submissionId' => (int) $row['latest_id'],
                'email'        => $email,
                'name'         => $row['from_name'] ? (string) $row['from_name'] : null,
                'formType'     => (string) $row['form_type'],
                'lastSeen'     => (string) $row['last_seen'],
            ];
        }

        return ['items' => $items, 'total' => count($items)];
    }

    public function compose(array $body, int $sentByUserId): array
    {
        $subject = trim((string) ($body['subject'] ?? ''));
        [$html, $text, $snippet] = $this->resolveBodyContent($body);
        if ($subject === '' || ($html === '' && $text === '')) {
            throw new InvalidArgumentException('Subject and message are required.');
        }

        $recipients = $this->normalizeRecipients($body);
        if ($recipients === []) {
            throw new InvalidArgumentException('At least one valid recipient is required.');
        }

        $sent = 0;
        $failed = [];
        $ids = [];
        foreach ($recipients as $recipient) {
            $to = $recipient['email'];
            try {
                $this->sendMail($to, $subject, $html, $text, null);
                $ids[] = $this->recordOutboundCompose($to, $subject, $html, $text, $snippet, $sentByUserId, $recipient);
                $sent++;
            } catch (Throwable $e) {
                $failed[] = ['email' => $to, 'error' => $e->getMessage()];
            }
        }

        if ($sent === 0) {
            throw new RuntimeException($failed[0]['error'] ?? 'Failed to send email.');
        }

        return [
            'success' => true,
            'sent'    => $sent,
            'failed'  => $failed,
            'total'   => count($recipients),
            'id'      => $ids[0] ?? null,
            'ids'     => $ids,
        ];
    }

    public function reply(int $parentId, array $body, int $sentByUserId): array
    {
        $parent = $this->getMessage($parentId);
        if (!$parent) {
            throw new RuntimeException('Message not found');
        }
        $root = $parent['message'];
        $to = trim((string) ($body['to'] ?? $root['from_email'] ?? ''));
        $subject = trim((string) ($body['subject'] ?? ''));
        if ($subject === '') {
            $base = (string) ($root['subject'] ?? 'Your inquiry');
            $subject = str_starts_with(strtolower($base), 're:') ? $base : 'Re: ' . $base;
        }
        [$html, $text, $snippet] = $this->resolveBodyContent($body);
        if ($to === '' || ($html === '' && $text === '')) {
            throw new InvalidArgumentException('Recipient and message are required.');
        }

        $settings = $this->repo->getSiteSettings();
        $fromEmail = (string) ($settings['smtpFromEmail'] ?? $settings['email'] ?? '');
        $this->sendMail($to, $subject, $html, $text, $fromEmail ?: null);

        $threadId = (int) ($root['thread_id'] ?: $root['id']);
        $payload = [
            'to'           => $to,
            'subject'      => $subject,
            'message'      => $text,
            'html'         => $html,
            'parentId'     => $parentId,
            'sentByUserId' => $sentByUserId,
        ];
        $stmt = $this->db->prepare(
            'INSERT INTO form_submissions
             (form_type, payload, from_email, subject, snippet, thread_id, parent_id, folder, direction, is_read, last_activity_at)
             VALUES (:ft, :p, :fe, :sub, :sn, :tid, :pid, "sent", "outbound", 1, NOW())'
        );
        $stmt->execute([
            ':ft'  => $root['form_type'] ?? 'crm_reply',
            ':p'   => json_encode($payload, JSON_UNESCAPED_UNICODE),
            ':fe'  => $to,
            ':sub' => $subject,
            ':sn'  => $snippet,
            ':tid' => $threadId,
            ':pid' => $parentId,
        ]);
        $newId = (int) $this->db->lastInsertId();
        $this->db->prepare(
            'UPDATE form_submissions SET last_activity_at = NOW() WHERE thread_id = :tid OR id = :tid'
        )->execute([':tid' => $threadId]);

        return ['success' => true, 'id' => $newId, 'thread' => $this->getMessage($parentId)];
    }

    public function getSmtpSettings(): array
    {
        $all = $this->repo->getSiteSettings();
        $out = [
            'smtpHost'        => (string) ($all['smtpHost'] ?? 'smtp.hostinger.com'),
            'smtpPort'        => (string) ($all['smtpPort'] ?? '587'),
            'smtpEncryption'  => (string) ($all['smtpEncryption'] ?? 'tls'),
            'smtpUsername'    => (string) ($all['smtpUsername'] ?? ''),
            'smtpFromEmail'   => (string) ($all['smtpFromEmail'] ?? ($all['email'] ?? '')),
            'smtpFromName'    => (string) ($all['smtpFromName'] ?? 'CWS India'),
            'hasPassword'     => !empty($all['smtpPassword']),
        ];
        return $out;
    }

    public function saveSmtpSettings(array $body): void
    {
        $current = $this->repo->getSiteSettings();
        foreach (self::SMTP_KEYS as $key) {
            if ($key === 'smtpPassword') {
                $pw = (string) ($body['smtpPassword'] ?? '');
                if ($pw !== '' && $pw !== '********') {
                    $current['smtpPassword'] = $pw;
                }
                continue;
            }
            if (array_key_exists($key, $body)) {
                $current[$key] = (string) $body[$key];
            }
        }
        $this->repo->saveSiteSettings($current);
    }

    public function testSmtp(?string $testTo = null): void
    {
        $to = $testTo ?: $this->getSmtpSettings()['smtpFromEmail'];
        if ($to === '') {
            throw new RuntimeException('Set a From email before testing SMTP.');
        }
        $this->sendMail(
            $to,
            'CWS CRM — SMTP test',
            '<p>This is a test message from your CWS admin CRM.</p>',
            'This is a test message from your CWS admin CRM.',
            null
        );
    }

    private function sendMail(
        string $to,
        string $subject,
        string $html,
        string $text,
        ?string $replyTo
    ): void {
        $s = $this->repo->getSiteSettings();
        $host = trim((string) ($s['smtpHost'] ?? ''));
        $user = trim((string) ($s['smtpUsername'] ?? ''));
        $pass = (string) ($s['smtpPassword'] ?? '');
        $from = trim((string) ($s['smtpFromEmail'] ?? $s['email'] ?? ''));
        $fromName = trim((string) ($s['smtpFromName'] ?? 'CWS India'));
        $port = (int) ($s['smtpPort'] ?? 587);
        $enc = strtolower((string) ($s['smtpEncryption'] ?? 'tls'));

        if ($host === '' || $user === '' || $pass === '' || $from === '') {
            throw new RuntimeException(
                'SMTP is not configured. An admin must set host, username, password, and from email under Settings → Email.'
            );
        }

        $mailer = new SmtpMailer($host, $port, $enc, $user, $pass, $from, $fromName);
        $mailer->send($to, $subject, $html, $text, $replyTo);
    }

    private function extractMeta(string $type, array $payload): array
    {
        $email = '';
        foreach (['email', 'Email', 'studentEmail'] as $k) {
            if (!empty($payload[$k]) && is_string($payload[$k])) {
                $email = trim($payload[$k]);
                break;
            }
        }
        $name = '';
        foreach (['name', 'fullName', 'studentName', 'contactName'] as $k) {
            if (!empty($payload[$k]) && is_string($payload[$k])) {
                $name = trim($payload[$k]);
                break;
            }
        }
        $message = '';
        foreach (['message', 'comments', 'notes', 'course'] as $k) {
            if (!empty($payload[$k]) && is_string($payload[$k])) {
                $message = trim($payload[$k]);
                break;
            }
        }
        $subject = match ($type) {
            'contact'    => 'Contact form' . ($name !== '' ? ': ' . $name : ''),
            'enrollment' => 'Course enrollment' . ($name !== '' ? ' — ' . $name : ''),
            default      => ucfirst(str_replace(['_', '-'], ' ', $type)) . ($name !== '' ? ': ' . $name : ''),
        };
        if ($message === '') {
            $message = json_encode($payload, JSON_UNESCAPED_UNICODE) ?: '';
        }
        $snippet = mb_substr(preg_replace('/\s+/', ' ', strip_tags($message)) ?: '', 0, 200);

        return [
            'from_name'  => $name !== '' ? $name : null,
            'from_email' => $email !== '' ? $email : null,
            'subject'    => $subject,
            'snippet'    => $snippet,
        ];
    }

    private function mapListRow(array $r): array
    {
        return [
            'id'               => (int) $r['id'],
            'formType'         => (string) $r['form_type'],
            'fromName'         => $r['from_name'] ?? null,
            'fromEmail'        => $r['from_email'] ?? null,
            'subject'          => $r['subject'] ?? null,
            'snippet'          => $r['snippet'] ?? null,
            'isRead'           => (bool) ($r['is_read'] ?? 0),
            'isStarred'        => (bool) ($r['is_starred'] ?? 0),
            'folder'           => (string) ($r['folder'] ?? 'inbox'),
            'direction'        => (string) ($r['direction'] ?? 'inbound'),
            'threadId'         => isset($r['thread_id']) ? (int) $r['thread_id'] : null,
            'createdAt'        => (string) $r['created_at'],
            'lastActivityAt'   => (string) ($r['last_activity_at'] ?? $r['created_at']),
        ];
    }

    private function mapDetailRow(array $r): array
    {
        $payload = json_decode((string) ($r['payload'] ?? '{}'), true);
        if (!is_array($payload)) {
            $payload = [];
        }
        $list = $this->mapListRow($r);
        return array_merge($list, [
            'parentId' => isset($r['parent_id']) ? (int) $r['parent_id'] : null,
            'payload'  => $payload,
            'bodyHtml' => $this->formatPayloadBody($r, $payload),
        ]);
    }

    private function formatPayloadBody(array $row, array $payload): string
    {
        if (($row['direction'] ?? '') === 'outbound') {
            $html = trim((string) ($payload['html'] ?? ''));
            if ($html !== '') {
                return $html;
            }
            $msg = (string) ($payload['message'] ?? '');
            return $msg !== '' ? nl2br(htmlspecialchars($msg, ENT_QUOTES, 'UTF-8')) : '';
        }
        $lines = [];
        foreach ($payload as $key => $val) {
            if (is_scalar($val) && (string) $val !== '') {
                $label = ucfirst(preg_replace('/([A-Z])/', ' $1', (string) $key) ?? (string) $key);
                $lines[] = '<p><strong>' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . ':</strong> '
                    . nl2br(htmlspecialchars((string) $val, ENT_QUOTES, 'UTF-8')) . '</p>';
            }
        }
        return implode("\n", $lines);
    }

    private function textToHtml(string $text): string
    {
        return '<div style="font-family:sans-serif;font-size:15px;line-height:1.5">'
            . nl2br(htmlspecialchars($text, ENT_QUOTES, 'UTF-8'))
            . '</div>';
    }

    /** @return array{0:string,1:string,2:string} HTML, plain text, snippet */
    private function resolveBodyContent(array $body): array
    {
        $html = trim((string) ($body['html'] ?? ''));
        $plain = trim((string) ($body['body'] ?? $body['message'] ?? ''));
        if ($html === '' && $plain !== '' && str_contains($plain, '<')) {
            $html = $plain;
            $plain = '';
        }
        if ($html === '' && $plain !== '') {
            $html = $this->textToHtml($plain);
        }
        if ($plain === '' && $html !== '') {
            $plain = trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }
        $snippet = mb_substr(preg_replace('/\s+/', ' ', $plain) ?: '', 0, 200);

        return [$html, $plain, $snippet];
    }

    /** @return list<array{email:string,name:?string,submissionId:?int}> */
    private function normalizeRecipients(array $body): array
    {
        $map = [];

        $to = trim((string) ($body['to'] ?? ''));
        if ($to !== '') {
            foreach (preg_split('/[\s,;]+/', $to) ?: [] as $part) {
                $email = strtolower(trim($part));
                if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $map[$email] = ['email' => $email, 'name' => null, 'submissionId' => null];
                }
            }
        }

        $recipients = $body['recipients'] ?? [];
        if (is_array($recipients)) {
            foreach ($recipients as $r) {
                if (is_string($r)) {
                    $email = strtolower(trim($r));
                    if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $map[$email] = ['email' => $email, 'name' => null, 'submissionId' => null];
                    }
                    continue;
                }
                if (!is_array($r)) {
                    continue;
                }
                $email = strtolower(trim((string) ($r['email'] ?? '')));
                if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    continue;
                }
                $map[$email] = [
                    'email'        => $email,
                    'name'         => isset($r['name']) ? trim((string) $r['name']) : null,
                    'submissionId' => isset($r['submissionId']) ? (int) $r['submissionId'] : null,
                ];
            }
        }

        $submissionIds = $body['submissionIds'] ?? [];
        if (is_array($submissionIds) && $submissionIds !== []) {
            $ids = array_values(array_filter(array_map('intval', $submissionIds)));
            if ($ids !== []) {
                $placeholders = implode(',', array_fill(0, count($ids), '?'));
                $stmt = $this->db->prepare(
                    "SELECT id, from_email, from_name FROM form_submissions WHERE id IN ({$placeholders})"
                );
                $stmt->execute($ids);
                foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                    $email = strtolower(trim((string) ($row['from_email'] ?? '')));
                    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        continue;
                    }
                    $map[$email] = [
                        'email'        => $email,
                        'name'         => $row['from_name'] ? (string) $row['from_name'] : null,
                        'submissionId' => (int) $row['id'],
                    ];
                }
            }
        }

        return array_values($map);
    }

    /** @param array{email:string,name:?string,submissionId:?int} $recipient */
    private function recordOutboundCompose(
        string $to,
        string $subject,
        string $html,
        string $text,
        string $snippet,
        int $sentByUserId,
        array $recipient,
    ): int {
        $payload = [
            'to'           => $to,
            'toName'       => $recipient['name'],
            'subject'      => $subject,
            'message'      => $text,
            'html'         => $html,
            'sentByUserId' => $sentByUserId,
        ];
        $stmt = $this->db->prepare(
            'INSERT INTO form_submissions
             (form_type, payload, from_email, from_name, subject, snippet, folder, direction, is_read, last_activity_at)
             VALUES ("crm_compose", :p, :fe, :fn, :sub, :sn, "sent", "outbound", 1, NOW())'
        );
        $stmt->execute([
            ':p'   => json_encode($payload, JSON_UNESCAPED_UNICODE),
            ':fe'  => $to,
            ':fn'  => $recipient['name'],
            ':sub' => $subject,
            ':sn'  => $snippet,
        ]);
        $id = (int) $this->db->lastInsertId();
        $this->db->prepare('UPDATE form_submissions SET thread_id = :id WHERE id = :id')->execute([':id' => $id]);

        return $id;
    }
}

function cws_crm(): CrmInbox
{
    static $crm = null;
    if (!$crm) {
        $crm = new CrmInbox(cws_db(), cws_repo());
    }
    return $crm;
}
