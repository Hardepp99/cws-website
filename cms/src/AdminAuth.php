<?php

declare(strict_types=1);

final class AdminAuth
{
    public static function login(string $username, string $password): ?array
    {
        $stmt = cws_db()->prepare('SELECT id, password_hash, display_name FROM users WHERE username = :u LIMIT 1');
        $stmt->execute([':u' => $username]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            return null;
        }
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + 7 * 86400);
        $ins = cws_db()->prepare(
            'INSERT INTO admin_sessions (token, user_id, expires_at) VALUES (:t, :u, :e)'
        );
        $ins->execute([':t' => $token, ':u' => $user['id'], ':e' => $expires]);
        return [
            'token'        => $token,
            'displayName'  => $user['display_name'],
            'userId'       => (int) $user['id'],
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

    public static function requireUser(): int
    {
        $userId = self::validateBearer(self::authorizationHeader());
        if (!$userId) {
            Http::json(['error' => 'Unauthorized'], 401);
        }
        return $userId;
    }
}
