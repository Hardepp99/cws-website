<?php

declare(strict_types=1);

final class AdminUsers
{
    public static function listAll(): array
    {
        $stmt = cws_db()->query(
            'SELECT id, username, display_name, role, created_at FROM users ORDER BY role DESC, username ASC'
        );
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = self::mapRow($row);
        }
        return ['items' => $items];
    }

    public static function getById(int $id): ?array
    {
        $stmt = cws_db()->prepare(
            'SELECT id, username, display_name, role, created_at FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? self::mapRow($row) : null;
    }

  /** @param array{id:int,role:string} $actor */
    public static function create(array $actor, array $body): array
    {
        $username = trim((string) ($body['username'] ?? ''));
        $password = (string) ($body['password'] ?? '');
        $displayName = trim((string) ($body['displayName'] ?? $body['display_name'] ?? ''));
        $role = (string) ($body['role'] ?? 'user');

        if ($username === '' || strlen($username) < 3) {
            Http::json(['error' => 'Username must be at least 3 characters'], 400);
        }
        if ($password === '' || strlen($password) < 8) {
            Http::json(['error' => 'Password must be at least 8 characters'], 400);
        }
        if ($displayName === '') {
            $displayName = $username;
        }
        if (!in_array($role, ['admin', 'user'], true)) {
            Http::json(['error' => 'Invalid role'], 400);
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        try {
            $stmt = cws_db()->prepare(
                'INSERT INTO users (username, password_hash, display_name, role) VALUES (:u, :p, :d, :r)'
            );
            $stmt->execute([
                ':u' => $username,
                ':p' => $hash,
                ':d' => $displayName,
                ':r' => $role,
            ]);
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'Duplicate')) {
                Http::json(['error' => 'Username already exists'], 409);
            }
            throw $e;
        }

        $id = (int) cws_db()->lastInsertId();
        $user = self::getById($id);
        AdminActivityLog::record(
            $actor,
            'user.create',
            'POST',
            '/users',
            "Created user {$username} ({$role})",
            [
                'userId' => $id,
                'role'   => $role,
                'task'   => 'users',
                'hint'   => "New CMS account @{$username} with role “{$role}”.",
            ],
        );
        return $user ?? [];
    }

  /** @param array{id:int,role:string} $actor */
    public static function update(array $actor, int $id, array $body): array
    {
        $existing = self::getById($id);
        if (!$existing) {
            Http::json(['error' => 'User not found'], 404);
        }

        $displayName = array_key_exists('displayName', $body)
            ? trim((string) $body['displayName'])
            : (array_key_exists('display_name', $body) ? trim((string) $body['display_name']) : null);
        $role = array_key_exists('role', $body) ? (string) $body['role'] : null;
        $password = array_key_exists('password', $body) ? (string) $body['password'] : null;

        if ($role !== null && !in_array($role, ['admin', 'user'], true)) {
            Http::json(['error' => 'Invalid role'], 400);
        }

        if ($id === (int) $actor['id'] && $role !== null && $role !== 'admin') {
            Http::json(['error' => 'You cannot remove your own admin role'], 400);
        }

        if ($role === null && $displayName === null && ($password === null || $password === '')) {
            Http::json(['error' => 'Nothing to update'], 400);
        }

        if ($password !== null && $password !== '' && strlen($password) < 8) {
            Http::json(['error' => 'Password must be at least 8 characters'], 400);
        }

        if ($role !== null && $role !== 'admin' && (string) $existing['role'] === 'admin') {
            if (self::countAdmins() <= 1) {
                Http::json(['error' => 'Cannot demote the only admin account'], 400);
            }
        }

        $sets = [];
        $params = [':id' => $id];
        if ($displayName !== null && $displayName !== '') {
            $sets[] = 'display_name = :d';
            $params[':d'] = $displayName;
        }
        if ($role !== null) {
            $sets[] = 'role = :r';
            $params[':r'] = $role;
        }
        if ($password !== null && $password !== '') {
            $sets[] = 'password_hash = :p';
            $params[':p'] = password_hash($password, PASSWORD_DEFAULT);
        }

        if ($sets !== []) {
            $sql = 'UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = :id';
            cws_db()->prepare($sql)->execute($params);
        }

        AdminActivityLog::record(
            $actor,
            'user.update',
            'PUT',
            '/users/' . $id,
            "Updated user {$existing['username']}",
            [
                'userId' => $id,
                'task'   => 'users',
                'hint'   => "Changed profile, role, or password for @{$existing['username']}.",
            ],
        );

        return self::getById($id) ?? [];
    }

  /** @param array{id:int,role:string} $actor */
    public static function delete(array $actor, int $id): void
    {
        if ($id === (int) $actor['id']) {
            Http::json(['error' => 'You cannot delete your own account'], 400);
        }
        $existing = self::getById($id);
        if (!$existing) {
            Http::json(['error' => 'User not found'], 404);
        }
        if ((string) $existing['role'] === 'admin' && self::countAdmins() <= 1) {
            Http::json(['error' => 'Cannot delete the only admin account'], 400);
        }

        $stmt = cws_db()->prepare('DELETE FROM users WHERE id = :id');
        $stmt->execute([':id' => $id]);

        AdminActivityLog::record(
            $actor,
            'user.delete',
            'DELETE',
            '/users/' . $id,
            "Deleted user {$existing['username']}",
            [
                'userId' => $id,
                'task'   => 'users',
                'hint'   => "Removed CMS account @{$existing['username']}.",
            ],
        );
    }

    private static function countAdmins(): int
    {
        return (int) cws_db()->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
    }

    private static function mapRow(array $row): array
    {
        return [
            'id'           => (int) $row['id'],
            'username'     => (string) $row['username'],
            'displayName'  => (string) $row['display_name'],
            'role'         => (string) $row['role'],
            'createdAt'    => (string) $row['created_at'],
        ];
    }
}
