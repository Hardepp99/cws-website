<?php

declare(strict_types=1);

final class CommunityRepository
{
    public function __construct(private readonly PDO $db) {}

    // —— Members (admin) ——

    public function listMembers(int $page, int $perPage, string $search = '', string $status = 'all'): array
    {
        $where = '1=1';
        $params = [];
        if ($status !== 'all' && in_array($status, ['active', 'suspended'], true)) {
            $where .= ' AND status = :st';
            $params[':st'] = $status;
        }
        if ($search !== '') {
            $where .= ' AND (email LIKE :q OR display_name LIKE :q)';
            $params[':q'] = '%' . $search . '%';
        }
        $count = $this->db->prepare("SELECT COUNT(*) FROM members WHERE {$where}");
        $count->execute($params);
        $total = (int) $count->fetchColumn();
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT id, email, display_name, avatar_url, status, created_at, updated_at
             FROM members WHERE {$where} ORDER BY id DESC LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = $this->mapMemberAdmin($row);
        }

        return ['items' => $items, 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function getMemberAdmin(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM members WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? $this->mapMemberAdmin($row, true) : null;
    }

    /** @param array<string, mixed> $body */
    public function updateMemberAdmin(int $id, array $body): array
    {
        $existing = $this->getMemberAdmin($id);
        if (!$existing) {
            Http::json(['error' => 'Member not found'], 404);
        }
        $sets = [];
        $params = [':id' => $id];
        if (array_key_exists('displayName', $body) || array_key_exists('display_name', $body)) {
            $name = trim((string) ($body['displayName'] ?? $body['display_name'] ?? ''));
            if ($name === '') {
                Http::json(['error' => 'Display name required'], 400);
            }
            $sets[] = 'display_name = :n';
            $params[':n'] = $name;
        }
        if (isset($body['status']) && in_array($body['status'], ['active', 'suspended'], true)) {
            $sets[] = 'status = :s';
            $params[':s'] = $body['status'];
        }
        if (!empty($body['password'])) {
            $pw = (string) $body['password'];
            if (strlen($pw) < 8) {
                Http::json(['error' => 'Password must be at least 8 characters'], 400);
            }
            $sets[] = 'password_hash = :p';
            $params[':p'] = password_hash($pw, PASSWORD_DEFAULT);
        }
        if ($sets === []) {
            Http::json(['error' => 'Nothing to update'], 400);
        }
        $this->db->prepare('UPDATE members SET ' . implode(', ', $sets) . ' WHERE id = :id')->execute($params);

        return $this->getMemberAdmin($id) ?? [];
    }

    public function deleteMemberAdmin(int $id): void
    {
        $this->db->prepare("UPDATE members SET status = 'suspended' WHERE id = :id")->execute([':id' => $id]);
    }

    public function memberStats(int $memberId): array
    {
        $comments = (int) $this->scalar('SELECT COUNT(*) FROM blog_comments WHERE member_id = :m', [':m' => $memberId]);
        $blogs = (int) $this->scalar(
            "SELECT COUNT(*) FROM blog_posts WHERE author_member_id = :m AND author_type = 'member'",
            [':m' => $memberId]
        );
        $topics = (int) $this->scalar('SELECT COUNT(*) FROM forum_topics WHERE member_id = :m', [':m' => $memberId]);
        $replies = (int) $this->scalar('SELECT COUNT(*) FROM forum_replies WHERE member_id = :m', [':m' => $memberId]);

        return ['comments' => $comments, 'blogPosts' => $blogs, 'forumTopics' => $topics, 'forumReplies' => $replies];
    }

    public function getMemberContributions(int $memberId): array
    {
        $member = MemberAuth::getMemberById($memberId);
        if (!$member) {
            Http::json(['error' => 'Not found'], 404);
        }

        $blogs = $this->db->prepare(
            "SELECT id, slug, title, status, published_date, updated_at
             FROM blog_posts WHERE author_member_id = :m AND author_type = 'member'
             ORDER BY updated_at DESC LIMIT 50"
        );
        $blogs->execute([':m' => $memberId]);
        $blogItems = [];
        while ($row = $blogs->fetch(PDO::FETCH_ASSOC)) {
            $blogItems[] = [
                'id'        => (int) $row['id'],
                'slug'      => (string) $row['slug'],
                'title'     => (string) $row['title'],
                'status'    => (string) $row['status'],
                'date'      => (string) ($row['published_date'] ?? ''),
                'updatedAt' => (string) ($row['updated_at'] ?? ''),
            ];
        }

        $topics = $this->db->prepare(
            'SELECT t.id, t.slug, t.title, t.status, t.reply_count, t.last_activity_at, f.slug AS forum_slug, f.title AS forum_title
             FROM forum_topics t
             JOIN forums f ON f.id = t.forum_id
             WHERE t.member_id = :m ORDER BY t.last_activity_at DESC LIMIT 50'
        );
        $topics->execute([':m' => $memberId]);
        $topicItems = [];
        while ($row = $topics->fetch(PDO::FETCH_ASSOC)) {
            $topicItems[] = [
                'id'           => (int) $row['id'],
                'slug'         => (string) $row['slug'],
                'title'        => (string) $row['title'],
                'status'       => (string) $row['status'],
                'replyCount'   => (int) $row['reply_count'],
                'forumSlug'    => (string) $row['forum_slug'],
                'forumTitle'   => (string) $row['forum_title'],
                'lastActivity' => (string) $row['last_activity_at'],
            ];
        }

        $commentsStmt = $this->db->prepare(
            'SELECT c.id, c.body, c.status, c.created_at, p.title AS post_title, p.slug AS post_slug
             FROM blog_comments c
             LEFT JOIN blog_posts p ON p.id = c.blog_post_id
             WHERE c.member_id = :m
             ORDER BY c.created_at DESC LIMIT 50'
        );
        $commentsStmt->execute([':m' => $memberId]);
        $commentItems = [];
        while ($row = $commentsStmt->fetch(PDO::FETCH_ASSOC)) {
            $commentItems[] = [
                'id'        => (int) $row['id'],
                'body'      => (string) $row['body'],
                'status'    => (string) $row['status'],
                'createdAt' => (string) $row['created_at'],
                'postTitle' => (string) ($row['post_title'] ?? 'Post removed'),
                'postSlug'  => (string) ($row['post_slug'] ?? ''),
            ];
        }

        $repliesStmt = $this->db->prepare(
            'SELECT r.id, r.body, r.status, r.created_at,
                    t.id AS topic_id, t.slug AS topic_slug, t.title AS topic_title,
                    f.slug AS forum_slug, f.title AS forum_title
             FROM forum_replies r
             JOIN forum_topics t ON t.id = r.topic_id
             JOIN forums f ON f.id = t.forum_id
             WHERE r.member_id = :m
             ORDER BY r.created_at DESC LIMIT 50'
        );
        $repliesStmt->execute([':m' => $memberId]);
        $replyItems = [];
        while ($row = $repliesStmt->fetch(PDO::FETCH_ASSOC)) {
            $replyItems[] = [
                'id'         => (int) $row['id'],
                'body'       => (string) $row['body'],
                'status'     => (string) $row['status'],
                'createdAt'  => (string) $row['created_at'],
                'topicId'    => (int) $row['topic_id'],
                'topicSlug'  => (string) $row['topic_slug'],
                'topicTitle' => (string) $row['topic_title'],
                'forumSlug'  => (string) $row['forum_slug'],
                'forumTitle' => (string) $row['forum_title'],
            ];
        }

        $forumsStmt = $this->db->prepare(
            "SELECT f.id, f.slug, f.title, f.description, f.icon, f.status,
                    (f.created_by_member_id = :m) AS created_by_me,
                    (SELECT COUNT(*) FROM forum_topics t WHERE t.forum_id = f.id AND t.member_id = :m) AS my_topics,
                    (SELECT COUNT(*) FROM forum_replies r
                     JOIN forum_topics t ON t.id = r.topic_id
                     WHERE t.forum_id = f.id AND r.member_id = :m) AS my_replies
             FROM forums f
             WHERE f.created_by_member_id = :m
                OR EXISTS (SELECT 1 FROM forum_topics t WHERE t.forum_id = f.id AND t.member_id = :m)
                OR EXISTS (
                    SELECT 1 FROM forum_replies r
                    JOIN forum_topics t ON t.id = r.topic_id
                    WHERE t.forum_id = f.id AND r.member_id = :m
                )
             ORDER BY f.title ASC
             LIMIT 50"
        );
        $forumsStmt->execute([':m' => $memberId]);
        $forumItems = [];
        while ($row = $forumsStmt->fetch(PDO::FETCH_ASSOC)) {
            $forumItems[] = [
                'id'          => (int) $row['id'],
                'slug'        => (string) $row['slug'],
                'title'       => (string) $row['title'],
                'description' => (string) ($row['description'] ?? ''),
                'icon'        => (string) ($row['icon'] ?? 'fa-comments'),
                'status'      => (string) $row['status'],
                'createdByMe' => (bool) $row['created_by_me'],
                'myTopics'    => (int) $row['my_topics'],
                'myReplies'   => (int) $row['my_replies'],
            ];
        }

        return [
            'member'       => $member,
            'stats'        => $this->memberStats($memberId),
            'blogPosts'    => $blogItems,
            'forumTopics'  => $topicItems,
            'comments'     => $commentItems,
            'forumReplies' => $replyItems,
            'forums'       => $forumItems,
        ];
    }

    // —— Blog comments ——

    public function getBlogPostIdBySlug(string $slug): ?int
    {
        $stmt = $this->db->prepare("SELECT id FROM blog_posts WHERE slug = :s AND status = 'published' LIMIT 1");
        $stmt->execute([':s' => $slug]);
        $id = $stmt->fetchColumn();

        return $id ? (int) $id : null;
    }

    public function listApprovedComments(int $postId, ?int $viewerMemberId = null): array
    {
        if ($viewerMemberId !== null) {
            $stmt = $this->db->prepare(
                "SELECT c.id, c.member_id, c.body, c.status, c.created_at, m.display_name, m.avatar_url
                 FROM blog_comments c
                 JOIN members m ON m.id = c.member_id
                 WHERE c.blog_post_id = :p
                   AND (c.status = 'approved' OR c.member_id = :viewer)
                 ORDER BY c.created_at ASC"
            );
            $stmt->execute([':p' => $postId, ':viewer' => $viewerMemberId]);
        } else {
            $stmt = $this->db->prepare(
                "SELECT c.id, c.member_id, c.body, c.status, c.created_at, m.display_name, m.avatar_url
                 FROM blog_comments c
                 JOIN members m ON m.id = c.member_id
                 WHERE c.blog_post_id = :p AND c.status = 'approved'
                 ORDER BY c.created_at ASC"
            );
            $stmt->execute([':p' => $postId]);
        }
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $memberIdRow = (int) ($row['member_id'] ?? 0);
            $items[] = [
                'id'          => (int) $row['id'],
                'body'        => (string) $row['body'],
                'status'      => (string) ($row['status'] ?? 'approved'),
                'createdAt'   => (string) $row['created_at'],
                'displayName' => (string) $row['display_name'],
                'avatarUrl'   => (string) ($row['avatar_url'] ?? ''),
                'isOwn'       => $viewerMemberId !== null && $memberIdRow === $viewerMemberId,
            ];
        }

        return ['items' => $items];
    }

    public function createBlogComment(int $postId, int $memberId, string $body): array
    {
        $body = trim($body);
        if ($body === '') {
            Http::json(['error' => 'Comment cannot be empty'], 400);
        }
        $stmt = $this->db->prepare(
            'INSERT INTO blog_comments (blog_post_id, member_id, body, status) VALUES (:p, :m, :b, :s)'
        );
        $stmt->execute([':p' => $postId, ':m' => $memberId, ':b' => $body, ':s' => 'pending']);
        $id = (int) $this->db->lastInsertId();

        return ['success' => true, 'id' => $id, 'status' => 'pending', 'message' => 'Comment submitted for moderation.'];
    }

    public function listBlogCommentsAdmin(int $page, int $perPage, string $status = 'all', string $search = ''): array
    {
        $where = '1=1';
        $params = [];
        if ($status !== 'all' && in_array($status, ['pending', 'approved', 'rejected', 'spam'], true)) {
            $where .= ' AND c.status = :st';
            $params[':st'] = $status;
        }
        if ($search !== '') {
            $where .= ' AND (c.body LIKE :q OR m.display_name LIKE :q OR m.email LIKE :q OR p.title LIKE :q)';
            $params[':q'] = '%' . $search . '%';
        }
        $count = $this->db->prepare("SELECT COUNT(*) FROM blog_comments c WHERE {$where}");
        $count->execute($params);
        $total = (int) $count->fetchColumn();
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT c.*, m.display_name, m.email, p.title AS post_title, p.slug AS post_slug
             FROM blog_comments c
             LEFT JOIN members m ON m.id = c.member_id
             LEFT JOIN blog_posts p ON p.id = c.blog_post_id
             WHERE {$where}
             ORDER BY c.created_at DESC LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = $this->mapCommentAdmin($row);
        }

        return [
            'items'   => $items,
            'total'   => $total,
            'page'    => $page,
            'perPage' => $perPage,
            'counts'  => $this->blogCommentStatusCounts(),
        ];
    }

    public function deleteBlogCommentAdmin(int $id): void
    {
        $this->db->prepare('DELETE FROM blog_comments WHERE id = :id')->execute([':id' => $id]);
    }

    public function getBlogCommentAdmin(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT c.*, m.display_name, m.email, p.title AS post_title, p.slug AS post_slug
             FROM blog_comments c
             LEFT JOIN members m ON m.id = c.member_id
             LEFT JOIN blog_posts p ON p.id = c.blog_post_id
             WHERE c.id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? $this->mapCommentAdmin($row) : null;
    }

    public function moderateBlogComment(int $id, string $status): void
    {
        if (!in_array($status, ['approved', 'rejected', 'spam', 'pending'], true)) {
            Http::json(['error' => 'Invalid status'], 400);
        }
        $this->db->prepare('UPDATE blog_comments SET status = :s WHERE id = :id')->execute([':s' => $status, ':id' => $id]);
    }

    // —— Forums ——

    public function listForumsPublic(): array
    {
        $stmt = $this->db->query(
            "SELECT f.id, f.slug, f.title, f.description, f.icon,
                    (SELECT COUNT(*) FROM forum_topics t WHERE t.forum_id = f.id AND t.status = 'published') AS topic_count
             FROM forums f WHERE f.status = 'published' ORDER BY f.sort_order ASC, f.title ASC"
        );
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = [
                'id'          => (int) $row['id'],
                'slug'        => (string) $row['slug'],
                'title'       => (string) $row['title'],
                'description' => (string) ($row['description'] ?? ''),
                'icon'        => (string) ($row['icon'] ?? 'fa-comments'),
                'topicCount'  => (int) $row['topic_count'],
            ];
        }

        return ['items' => $items];
    }

    public function getForumBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT id, slug, title, description, icon FROM forums WHERE slug = :s AND status = 'published' LIMIT 1"
        );
        $stmt->execute([':s' => $slug]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return [
            'id'          => (int) $row['id'],
            'slug'        => (string) $row['slug'],
            'title'       => (string) $row['title'],
            'description' => (string) ($row['description'] ?? ''),
            'icon'        => (string) ($row['icon'] ?? 'fa-comments'),
        ];
    }

    public function listForumTopicsPublic(int $forumId, int $page, int $perPage): array
    {
        $count = $this->db->prepare(
            "SELECT COUNT(*) FROM forum_topics WHERE forum_id = :f AND status = 'published'"
        );
        $count->execute([':f' => $forumId]);
        $total = (int) $count->fetchColumn();
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT t.id, t.slug, t.title, t.reply_count, t.is_pinned, t.last_activity_at, t.created_at,
                    m.display_name
             FROM forum_topics t
             JOIN members m ON m.id = t.member_id
             WHERE t.forum_id = :f AND t.status = 'published'
             ORDER BY t.is_pinned DESC, t.last_activity_at DESC
             LIMIT :lim OFFSET :off"
        );
        $stmt->bindValue(':f', $forumId, PDO::PARAM_INT);
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = [
                'id'           => (int) $row['id'],
                'slug'         => (string) $row['slug'],
                'title'        => (string) $row['title'],
                'replyCount'   => (int) $row['reply_count'],
                'isPinned'     => (bool) $row['is_pinned'],
                'authorName'   => (string) $row['display_name'],
                'lastActivity' => (string) $row['last_activity_at'],
                'createdAt'    => (string) $row['created_at'],
            ];
        }

        return ['items' => $items, 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function getTopicPublic(int $forumId, string $topicSlug): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT t.*, m.display_name, m.avatar_url
             FROM forum_topics t
             JOIN members m ON m.id = t.member_id
             WHERE t.forum_id = :f AND t.slug = :s AND t.status = 'published' LIMIT 1"
        );
        $stmt->execute([':f' => $forumId, ':s' => $topicSlug]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }
        $topicId = (int) $row['id'];
        $replies = $this->listApprovedReplies($topicId);

        return [
            'id'           => $topicId,
            'slug'         => (string) $row['slug'],
            'title'        => (string) $row['title'],
            'body'         => (string) $row['body'],
            'authorName'   => (string) $row['display_name'],
            'avatarUrl'    => (string) ($row['avatar_url'] ?? ''),
            'createdAt'    => (string) $row['created_at'],
            'replyCount'   => (int) $row['reply_count'],
            'replies'      => $replies,
        ];
    }

    public function createForum(int $memberId, array $body): array
    {
        $title = trim((string) ($body['title'] ?? ''));
        $desc = trim((string) ($body['description'] ?? ''));
        if ($title === '') {
            Http::json(['error' => 'Title required'], 400);
        }
        $slug = $this->uniqueSlug('forums', $this->sanitizeSlug((string) ($body['slug'] ?? $title)));
        $this->db->prepare(
            'INSERT INTO forums (slug, title, description, created_by_member_id, status) VALUES (:s, :t, :d, :m, :st)'
        )->execute([
            ':s'  => $slug,
            ':t'  => $title,
            ':d'  => $desc,
            ':m'  => $memberId,
            ':st' => 'published',
        ]);

        return ['success' => true, 'slug' => $slug];
    }

    public function createTopic(int $forumId, int $memberId, array $body): array
    {
        $title = trim((string) ($body['title'] ?? ''));
        $content = trim((string) ($body['body'] ?? $body['content'] ?? ''));
        if ($title === '' || $content === '') {
            Http::json(['error' => 'Title and body required'], 400);
        }
        $slug = $this->uniqueTopicSlug($forumId, $this->sanitizeSlug((string) ($body['slug'] ?? $title)));
        $status = 'pending';
        $this->db->prepare(
            'INSERT INTO forum_topics (forum_id, slug, title, body, member_id, status) VALUES (:f, :s, :t, :b, :m, :st)'
        )->execute([':f' => $forumId, ':s' => $slug, ':t' => $title, ':b' => $content, ':m' => $memberId, ':st' => $status]);

        return [
            'success' => true,
            'slug'    => $slug,
            'status'  => $status,
            'message' => 'Topic submitted for moderation.',
        ];
    }

    public function createReply(int $topicId, int $memberId, string $body, ?int $parentId = null): array
    {
        $body = trim($body);
        if ($body === '') {
            Http::json(['error' => 'Reply cannot be empty'], 400);
        }
        $topic = $this->db->prepare('SELECT status FROM forum_topics WHERE id = :id LIMIT 1');
        $topic->execute([':id' => $topicId]);
        $trow = $topic->fetch(PDO::FETCH_ASSOC);
        if (!$trow || ($trow['status'] ?? '') !== 'published') {
            Http::json(['error' => 'Topic not found or locked'], 404);
        }
        $this->db->prepare(
            'INSERT INTO forum_replies (topic_id, member_id, parent_reply_id, body, status) VALUES (:t, :m, :p, :b, :s)'
        )->execute([':t' => $topicId, ':m' => $memberId, ':p' => $parentId, ':b' => $body, ':s' => 'pending']);

        return ['success' => true, 'status' => 'pending', 'message' => 'Reply submitted for moderation.'];
    }

  /** @return list<array<string, mixed>> */
    private function listApprovedReplies(int $topicId): array
    {
        $stmt = $this->db->prepare(
            "SELECT r.id, r.body, r.created_at, r.parent_reply_id, m.display_name, m.avatar_url
             FROM forum_replies r
             JOIN members m ON m.id = r.member_id
             WHERE r.topic_id = :t AND r.status = 'approved'
             ORDER BY r.created_at ASC"
        );
        $stmt->execute([':t' => $topicId]);
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = [
                'id'          => (int) $row['id'],
                'body'        => (string) $row['body'],
                'parentId'    => $row['parent_reply_id'] ? (int) $row['parent_reply_id'] : null,
                'createdAt'   => (string) $row['created_at'],
                'displayName' => (string) $row['display_name'],
                'avatarUrl'   => (string) ($row['avatar_url'] ?? ''),
            ];
        }

        return $items;
    }

    public function listForumsAdmin(int $page, int $perPage, string $search = '', string $status = 'all'): array
    {
        $where = '1=1';
        $params = [];
        if ($status !== 'all' && in_array($status, ['published', 'draft'], true)) {
            $where .= ' AND status = :st';
            $params[':st'] = $status;
        }
        if ($search !== '') {
            $where .= ' AND (title LIKE :q OR slug LIKE :q OR description LIKE :q)';
            $params[':q'] = '%' . $search . '%';
        }
        $count = $this->db->prepare("SELECT COUNT(*) FROM forums WHERE {$where}");
        $count->execute($params);
        $total = (int) $count->fetchColumn();
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT f.*, (SELECT COUNT(*) FROM forum_topics t WHERE t.forum_id = f.id) AS topic_count
             FROM forums f WHERE {$where} ORDER BY f.sort_order ASC, f.title ASC LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $item = $this->mapForumAdmin($row);
            $item['topicCount'] = (int) ($row['topic_count'] ?? 0);
            $items[] = $item;
        }

        return ['items' => $items, 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function getForumAdmin(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM forums WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? $this->mapForumAdmin($row) : null;
    }

    /** @param array<string, mixed> $body */
    public function createForumAdmin(array $body): array
    {
        $title = trim((string) ($body['title'] ?? ''));
        if ($title === '') {
            Http::json(['error' => 'Title required'], 400);
        }
        $slug = $this->uniqueSlug('forums', $this->sanitizeSlug((string) ($body['slug'] ?? $title)));
        $status = in_array($body['status'] ?? '', ['published', 'draft'], true) ? $body['status'] : 'published';
        $this->db->prepare(
            'INSERT INTO forums (slug, title, description, icon, sort_order, status) VALUES (:s, :t, :d, :i, :o, :st)'
        )->execute([
            ':s'  => $slug,
            ':t'  => $title,
            ':d'  => trim((string) ($body['description'] ?? '')),
            ':i'  => (string) ($body['icon'] ?? 'fa-comments'),
            ':o'  => (int) ($body['sortOrder'] ?? $body['sort_order'] ?? 0),
            ':st' => $status,
        ]);
        $id = (int) $this->db->lastInsertId();

        return $this->getForumAdmin($id) ?? [];
    }

    /** @param array<string, mixed> $body */
    public function updateForumAdmin(int $id, array $body): array
    {
        if (!$this->getForumAdmin($id)) {
            Http::json(['error' => 'Forum not found'], 404);
        }
        $sets = [];
        $params = [':id' => $id];
        if (array_key_exists('title', $body)) {
            $sets[] = 'title = :t';
            $params[':t'] = trim((string) $body['title']);
        }
        if (array_key_exists('slug', $body)) {
            $sets[] = 'slug = :slug';
            $params[':slug'] = $this->sanitizeSlug((string) $body['slug']);
        }
        if (array_key_exists('description', $body)) {
            $sets[] = 'description = :d';
            $params[':d'] = trim((string) $body['description']);
        }
        if (array_key_exists('icon', $body)) {
            $sets[] = 'icon = :i';
            $params[':i'] = (string) $body['icon'];
        }
        if (array_key_exists('sortOrder', $body) || array_key_exists('sort_order', $body)) {
            $sets[] = 'sort_order = :o';
            $params[':o'] = (int) ($body['sortOrder'] ?? $body['sort_order'] ?? 0);
        }
        if (isset($body['status']) && in_array($body['status'], ['published', 'draft'], true)) {
            $sets[] = 'status = :st';
            $params[':st'] = $body['status'];
        }
        if ($sets === []) {
            Http::json(['error' => 'Nothing to update'], 400);
        }
        $this->db->prepare('UPDATE forums SET ' . implode(', ', $sets) . ' WHERE id = :id')->execute($params);

        return $this->getForumAdmin($id) ?? [];
    }

    public function deleteForumAdmin(int $id): void
    {
        $this->db->prepare('DELETE FROM forums WHERE id = :id')->execute([':id' => $id]);
    }

    public function listForumTopicsAdmin(int $page, int $perPage, string $status = 'all', string $search = ''): array
    {
        $where = '1=1';
        $params = [];
        if ($status !== 'all') {
            $where .= ' AND t.status = :st';
            $params[':st'] = $status;
        }
        if ($search !== '') {
            $where .= ' AND (t.title LIKE :q OR t.body LIKE :q OR m.display_name LIKE :q OR f.title LIKE :q)';
            $params[':q'] = '%' . $search . '%';
        }
        $count = $this->db->prepare("SELECT COUNT(*) FROM forum_topics t WHERE {$where}");
        $count->execute($params);
        $total = (int) $count->fetchColumn();
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT t.*, m.display_name, f.title AS forum_title, f.slug AS forum_slug
             FROM forum_topics t
             JOIN members m ON m.id = t.member_id
             JOIN forums f ON f.id = t.forum_id
             WHERE {$where}
             ORDER BY t.created_at DESC LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = [
                'id'          => (int) $row['id'],
                'title'       => (string) $row['title'],
                'slug'        => (string) $row['slug'],
                'status'      => (string) $row['status'],
                'authorName'  => (string) $row['display_name'],
                'forumTitle'  => (string) $row['forum_title'],
                'forumSlug'   => (string) $row['forum_slug'],
                'createdAt'   => (string) $row['created_at'],
            ];
        }

        return ['items' => $items, 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function getForumTopicAdmin(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT t.*, m.display_name, m.email, f.title AS forum_title, f.slug AS forum_slug
             FROM forum_topics t
             JOIN members m ON m.id = t.member_id
             JOIN forums f ON f.id = t.forum_id
             WHERE t.id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return [
            'id'         => (int) $row['id'],
            'forumId'    => (int) $row['forum_id'],
            'title'      => (string) $row['title'],
            'slug'       => (string) $row['slug'],
            'body'       => (string) $row['body'],
            'status'     => (string) $row['status'],
            'authorName' => (string) $row['display_name'],
            'authorEmail'=> (string) $row['email'],
            'forumTitle' => (string) $row['forum_title'],
            'forumSlug'  => (string) $row['forum_slug'],
            'createdAt'  => (string) $row['created_at'],
        ];
    }

    public function getForumReplyAdmin(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT r.*, m.display_name, m.email, t.title AS topic_title, t.slug AS topic_slug, f.slug AS forum_slug
             FROM forum_replies r
             JOIN members m ON m.id = r.member_id
             JOIN forum_topics t ON t.id = r.topic_id
             JOIN forums f ON f.id = t.forum_id
             WHERE r.id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return [
            'id'          => (int) $row['id'],
            'body'        => (string) $row['body'],
            'status'      => (string) $row['status'],
            'authorName'  => (string) $row['display_name'],
            'authorEmail' => (string) $row['email'],
            'topicTitle'  => (string) $row['topic_title'],
            'forumSlug'   => (string) $row['forum_slug'],
            'topicSlug'   => (string) $row['topic_slug'],
            'createdAt'   => (string) $row['created_at'],
        ];
    }

    public function listForumRepliesAdmin(int $page, int $perPage, string $status = 'all', string $search = ''): array
    {
        $where = '1=1';
        $params = [];
        if ($status !== 'all') {
            $where .= ' AND r.status = :st';
            $params[':st'] = $status;
        }
        if ($search !== '') {
            $where .= ' AND (r.body LIKE :q OR m.display_name LIKE :q OR t.title LIKE :q)';
            $params[':q'] = '%' . $search . '%';
        }
        $count = $this->db->prepare("SELECT COUNT(*) FROM forum_replies r WHERE {$where}");
        $count->execute($params);
        $total = (int) $count->fetchColumn();
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT r.*, m.display_name, t.title AS topic_title, t.slug AS topic_slug, f.slug AS forum_slug
             FROM forum_replies r
             JOIN members m ON m.id = r.member_id
             JOIN forum_topics t ON t.id = r.topic_id
             JOIN forums f ON f.id = t.forum_id
             WHERE {$where}
             ORDER BY r.created_at DESC LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = [
                'id'         => (int) $row['id'],
                'body'       => mb_substr((string) $row['body'], 0, 200),
                'status'     => (string) $row['status'],
                'authorName' => (string) $row['display_name'],
                'topicTitle' => (string) $row['topic_title'],
                'forumSlug'  => (string) $row['forum_slug'],
                'topicSlug'  => (string) $row['topic_slug'],
                'createdAt'  => (string) $row['created_at'],
            ];
        }

        return ['items' => $items, 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function moderateForumTopic(int $id, string $status): void
    {
        if (!in_array($status, ['published', 'rejected', 'locked', 'pending', 'trash'], true)) {
            Http::json(['error' => 'Invalid status'], 400);
        }
        $this->db->prepare('UPDATE forum_topics SET status = :s, last_activity_at = NOW() WHERE id = :id')
            ->execute([':s' => $status, ':id' => $id]);
        if ($status === 'published') {
            $this->db->prepare(
                'UPDATE forum_topics SET reply_count = (
                    SELECT COUNT(*) FROM forum_replies WHERE topic_id = :id AND status = \'approved\'
                ) WHERE id = :id'
            )->execute([':id' => $id]);
        }
    }

    public function moderateForumReply(int $id, string $status): void
    {
        if (!in_array($status, ['approved', 'rejected', 'spam', 'pending'], true)) {
            Http::json(['error' => 'Invalid status'], 400);
        }
        $this->db->prepare('UPDATE forum_replies SET status = :s WHERE id = :id')->execute([':s' => $status, ':id' => $id]);
        if ($status === 'approved') {
            $stmt = $this->db->prepare('SELECT topic_id FROM forum_replies WHERE id = :id');
            $stmt->execute([':id' => $id]);
            $topicId = (int) $stmt->fetchColumn();
            if ($topicId) {
                $this->db->prepare(
                    'UPDATE forum_topics SET reply_count = (
                        SELECT COUNT(*) FROM forum_replies WHERE topic_id = :t AND status = \'approved\'
                    ), last_activity_at = NOW() WHERE id = :t'
                )->execute([':t' => $topicId]);
            }
        }
    }

    // —— Member blog posts ——

    public function createMemberBlogPost(int $memberId, array $data): int
    {
        $slug = $this->uniqueSlug('blog_posts', $this->sanitizeSlug((string) ($data['slug'] ?? $data['title'] ?? 'post')));
        $stmt = $this->db->prepare(
            'INSERT INTO blog_posts (slug, title, excerpt, content_html, featured_image, published_date, seo, status, author_member_id, author_type)
             VALUES (:slug, :t, :ex, :c, :img, :pd, :seo, :st, :mid, :at)'
        );
        $stmt->execute([
            ':slug' => $slug,
            ':t'    => $data['title'] ?? 'Untitled',
            ':ex'   => $data['excerpt'] ?? '',
            ':c'    => $data['content_html'] ?? $data['content'] ?? '',
            ':img'  => $data['featured_image'] ?? $data['image'] ?? '',
            ':pd'   => $data['published_date'] ?? date('Y-m-d'),
            ':seo'  => json_encode($data['seo'] ?? [], JSON_UNESCAPED_UNICODE),
            ':st'   => 'pending_review',
            ':mid'  => $memberId,
            ':at'   => 'member',
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateMemberBlogPost(int $memberId, int $id, array $data): void
    {
        $stmt = $this->db->prepare(
            "SELECT id, status FROM blog_posts WHERE id = :id AND author_member_id = :m AND author_type = 'member' LIMIT 1"
        );
        $stmt->execute([':id' => $id, ':m' => $memberId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            Http::json(['error' => 'Post not found'], 404);
        }
        if (($row['status'] ?? '') === 'published') {
            Http::json(['error' => 'Published posts cannot be edited. Contact support.'], 400);
        }
        $this->db->prepare(
            'UPDATE blog_posts SET title = :t, excerpt = :ex, content_html = :c,
             featured_image = :img, slug = :slug, status = :st WHERE id = :id'
        )->execute([
            ':t'    => $data['title'] ?? 'Untitled',
            ':ex'   => $data['excerpt'] ?? '',
            ':c'    => $data['content_html'] ?? $data['content'] ?? '',
            ':img'  => $data['featured_image'] ?? $data['image'] ?? '',
            ':slug' => $data['slug'] ?? '',
            ':st'   => 'pending_review',
            ':id'   => $id,
        ]);
    }

    public function getMemberBlogPost(int $memberId, int $id): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM blog_posts WHERE id = :id AND author_member_id = :m AND author_type = 'member' LIMIT 1"
        );
        $stmt->execute([':id' => $id, ':m' => $memberId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? $this->mapMemberBlog($row) : null;
    }

    public function moderateMemberBlog(int $id, string $status): void
    {
        if (!in_array($status, ['published', 'rejected', 'pending_review', 'draft'], true)) {
            Http::json(['error' => 'Invalid status'], 400);
        }
        $this->db->prepare('UPDATE blog_posts SET status = :s WHERE id = :id AND author_type = :at')
            ->execute([':s' => $status, ':id' => $id, ':at' => 'member']);
    }

    public function countPendingModeration(): array
    {
        return [
            'blogComments'  => (int) $this->scalar("SELECT COUNT(*) FROM blog_comments WHERE status = 'pending'"),
            'forumTopics'   => (int) $this->scalar("SELECT COUNT(*) FROM forum_topics WHERE status = 'pending'"),
            'forumReplies'  => (int) $this->scalar("SELECT COUNT(*) FROM forum_replies WHERE status = 'pending'"),
            'memberBlogs'   => (int) $this->scalar("SELECT COUNT(*) FROM blog_posts WHERE status = 'pending_review' AND author_type = 'member'"),
        ];
    }

    public function listMemberBlogsAdmin(int $page, int $perPage, string $status = 'all', string $search = ''): array
    {
        $where = "p.author_type = 'member'";
        $params = [];
        if ($status !== 'all' && in_array($status, ['pending_review', 'published', 'rejected', 'draft'], true)) {
            $where .= ' AND p.status = :st';
            $params[':st'] = $status;
        }
        if ($search !== '') {
            $where .= ' AND (p.title LIKE :q OR p.slug LIKE :q OR m.display_name LIKE :q OR m.email LIKE :q)';
            $params[':q'] = '%' . $search . '%';
        }
        $count = $this->db->prepare("SELECT COUNT(*) FROM blog_posts p LEFT JOIN members m ON m.id = p.author_member_id WHERE {$where}");
        $count->execute($params);
        $total = (int) $count->fetchColumn();
        $offset = ($page - 1) * $perPage;
        $stmt = $this->db->prepare(
            "SELECT p.id, p.slug, p.title, p.status, p.updated_at, m.display_name, m.email
             FROM blog_posts p
             LEFT JOIN members m ON m.id = p.author_member_id
             WHERE {$where}
             ORDER BY p.updated_at DESC LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = [
                'id'          => (int) $row['id'],
                'title'       => (string) $row['title'],
                'slug'        => (string) $row['slug'],
                'status'      => (string) $row['status'],
                'authorName'  => (string) ($row['display_name'] ?? ''),
                'authorEmail' => (string) ($row['email'] ?? ''),
                'updatedAt'   => (string) $row['updated_at'],
            ];
        }

        return [
            'items'   => $items,
            'total'   => $total,
            'page'    => $page,
            'perPage' => $perPage,
            'counts'  => $this->memberBlogStatusCounts(),
        ];
    }

    private function scalar(string $sql, array $params = []): int|string
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchColumn();
    }

    private function uniqueSlug(string $table, string $base): string
    {
        $slug = $base;
        $n = 0;
        while (true) {
            $stmt = $this->db->prepare("SELECT id FROM {$table} WHERE slug = :s LIMIT 1");
            $stmt->execute([':s' => $slug]);
            if (!$stmt->fetch()) {
                return $slug;
            }
            $n++;
            $slug = $base . '-' . $n;
        }
    }

    private function uniqueTopicSlug(int $forumId, string $base): string
    {
        $slug = $base;
        $n = 0;
        while (true) {
            $stmt = $this->db->prepare('SELECT id FROM forum_topics WHERE forum_id = :f AND slug = :s LIMIT 1');
            $stmt->execute([':f' => $forumId, ':s' => $slug]);
            if (!$stmt->fetch()) {
                return $slug;
            }
            $n++;
            $slug = $base . '-' . $n;
        }
    }

    private function sanitizeSlug(string $s): string
    {
        $s = strtolower(trim($s));
        $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
        $s = trim($s, '-');

        return $s !== '' ? $s : 'item';
    }

    /** @param array<string, mixed> $row */
    private function mapMemberAdmin(array $row, bool $detail = false): array
    {
        $out = [
            'id'          => (int) $row['id'],
            'email'       => (string) $row['email'],
            'displayName' => (string) $row['display_name'],
            'avatarUrl'   => (string) ($row['avatar_url'] ?? ''),
            'status'      => (string) $row['status'],
            'createdAt'   => (string) ($row['created_at'] ?? ''),
            'updatedAt'   => (string) ($row['updated_at'] ?? ''),
        ];
        if ($detail) {
            $out['stats'] = $this->memberStats((int) $row['id']);
            $out['hasGoogle'] = !empty($row['google_sub']);
            $out['hasPassword'] = !empty($row['password_hash']);
        }

        return $out;
    }

    /** @return array{all: int, pending_review: int, published: int, rejected: int, draft: int} */
    private function memberBlogStatusCounts(): array
    {
        $counts = ['pending_review' => 0, 'published' => 0, 'rejected' => 0, 'draft' => 0];
        $stmt = $this->db->query(
            "SELECT status, COUNT(*) AS c FROM blog_posts WHERE author_type = 'member' GROUP BY status"
        );
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $st = (string) $row['status'];
            if (isset($counts[$st])) {
                $counts[$st] = (int) $row['c'];
            }
        }
        $counts['all'] = array_sum($counts);

        return $counts;
    }

    /** @return array{all: int, pending: int, approved: int, rejected: int, spam: int} */
    private function blogCommentStatusCounts(): array
    {
        $counts = ['pending' => 0, 'approved' => 0, 'rejected' => 0, 'spam' => 0];
        $stmt = $this->db->query("SELECT status, COUNT(*) AS c FROM blog_comments GROUP BY status");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $st = (string) $row['status'];
            if (isset($counts[$st])) {
                $counts[$st] = (int) $row['c'];
            }
        }
        $counts['all'] = array_sum($counts);

        return $counts;
    }

    private function mapCommentAdmin(array $row): array
    {
        return [
            'id'          => (int) $row['id'],
            'body'        => (string) $row['body'],
            'status'      => (string) $row['status'],
            'displayName' => (string) ($row['display_name'] ?? 'Unknown'),
            'email'       => (string) ($row['email'] ?? ''),
            'postTitle'   => (string) ($row['post_title'] ?? 'Deleted post'),
            'postSlug'    => (string) ($row['post_slug'] ?? ''),
            'createdAt'   => (string) $row['created_at'],
        ];
    }

    /** @param array<string, mixed> $row */
    private function mapForumAdmin(array $row): array
    {
        return [
            'id'          => (int) $row['id'],
            'slug'        => (string) $row['slug'],
            'title'       => (string) $row['title'],
            'description' => (string) ($row['description'] ?? ''),
            'icon'        => (string) ($row['icon'] ?? 'fa-comments'),
            'status'      => (string) $row['status'],
            'sortOrder'   => (int) $row['sort_order'],
        ];
    }

    /** @param array<string, mixed> $row */
    private function mapMemberBlog(array $row): array
    {
        return [
            'id'      => (int) $row['id'],
            'slug'    => (string) $row['slug'],
            'title'   => (string) $row['title'],
            'excerpt' => (string) ($row['excerpt'] ?? ''),
            'content' => (string) ($row['content_html'] ?? ''),
            'image'   => (string) ($row['featured_image'] ?? ''),
            'status'  => (string) $row['status'],
            'date'    => (string) ($row['published_date'] ?? ''),
        ];
    }
}

function cws_community(): CommunityRepository
{
    static $repo = null;
    if (!$repo) {
        $repo = new CommunityRepository(cws_db());
    }

    return $repo;
}
