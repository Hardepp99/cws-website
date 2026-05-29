<?php

declare(strict_types=1);

final class AdminAuth
{
    public static function login(string $username, string $password): ?array
    {
        $stmt = cws_db()->prepare(
            'SELECT id, username, password_hash, display_name, role FROM users WHERE username = :u LIMIT 1'
        );
        $stmt->execute([':u' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            return null;
        }
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + 7 * 86400);
        $ins = cws_db()->prepare(
            'INSERT INTO admin_sessions (token, user_id, expires_at) VALUES (:t, :u, :e)'
        );
        $ins->execute([':t' => $token, ':u' => $user['id'], ':e' => $expires]);

        $profile = self::mapUser($user);
        AdminActivityLog::record(
            $profile,
            'auth.login',
            'POST',
            '/login',
            'Signed in to the admin panel',
            ['hint' => 'Opened a new admin session.', 'task' => 'auth'],
        );

        return [
            'token'       => $token,
            'displayName' => $profile['display_name'],
            'userId'      => (int) $profile['id'],
            'username'    => $profile['username'],
            'role'        => $profile['role'],
        ];
    }

    public static function validateBearer(?string $header): ?int
    {
        if (!$header || !preg_match('/^Bearer\s+(\S+)$/i', $header, $m)) {
            return null;
        }
        return self::userIdFromToken($m[1]);
    }

    public static function userIdFromToken(string $token): ?int
    {
        $stmt = cws_db()->prepare(
            'SELECT user_id FROM admin_sessions WHERE token = :t AND expires_at > NOW() LIMIT 1'
        );
        $stmt->execute([':t' => $token]);
        $row = $stmt->fetch();
        return $row ? (int) $row['user_id'] : null;
    }

    public static function revoke(string $token): void
    {
        $userId = self::userIdFromToken($token);
        if ($userId) {
            $user = self::getUserById($userId);
            if ($user) {
                AdminActivityLog::record(
                    $user,
                    'auth.logout',
                    'POST',
                    '/logout',
                    'Signed out of the admin panel',
                    ['hint' => 'Ended the admin session.', 'task' => 'auth'],
                );
            }
        }
        cws_db()->prepare('DELETE FROM admin_sessions WHERE token = :t')->execute([':t' => $token]);
    }

    public static function authorizationHeader(): string
    {
        if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
            return (string) $_SERVER['HTTP_AUTHORIZATION'];
        }
        if (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            return (string) $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            foreach ($headers as $key => $value) {
                if (strtolower((string) $key) === 'authorization') {
                    return (string) $value;
                }
            }
        }
        if (!empty($_SERVER['HTTP_X_CWS_ADMIN_TOKEN'])) {
            return 'Bearer ' . trim((string) $_SERVER['HTTP_X_CWS_ADMIN_TOKEN']);
        }
        return '';
    }

    /** @return array{id:int,username:string,display_name:string,role:string} */
    public static function requireUser(): array
    {
        $userId = self::validateBearer(self::authorizationHeader());
        if (!$userId) {
            Http::json(['error' => 'Unauthorized'], 401);
        }
        $user = self::getUserById($userId);
        if (!$user) {
            Http::json(['error' => 'Unauthorized'], 401);
        }
        return $user;
    }

    /** @param array{id:int,username:string,display_name:string,role:string} $user */
    public static function requireAdmin(array $user): void
    {
        if (($user['role'] ?? '') !== 'admin') {
            Http::json(['error' => 'Forbidden — admin role required'], 403);
        }
    }

    /** @return array{id:int,username:string,display_name:string,role:string}|null */
    public static function getUserById(int $id): ?array
    {
        $stmt = cws_db()->prepare(
            'SELECT id, username, display_name, role FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? self::mapUser($row) : null;
    }

    /** @return array{userId:int,username:string,displayName:string,role:string} */
    public static function publicProfile(array $user): array
    {
        return [
            'userId'      => (int) $user['id'],
            'username'    => (string) $user['username'],
            'displayName' => (string) $user['display_name'],
            'role'        => (string) $user['role'],
        ];
    }

    /** @param array<string, mixed> $row */
    private static function mapUser(array $row): array
    {
        $role = (string) ($row['role'] ?? 'user');
        if ($role !== 'admin') {
            $role = 'user';
        }
        return [
            'id'            => (int) $row['id'],
            'username'      => (string) $row['username'],
            'display_name'  => (string) $row['display_name'],
            'role'          => $role,
        ];
    }
}
