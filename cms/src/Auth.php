<?php

declare(strict_types=1);

final class Auth
{
    public static function startSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function check(): bool
    {
        self::startSession();
        return !empty($_SESSION['cws_admin_id']);
    }

    public static function requireLogin(): void
    {
        if (!self::check()) {
            header('Location: ?page=login');
            exit;
        }
    }

    public static function login(string $username, string $password): bool
    {
        $stmt = cws_db()->prepare('SELECT id, password_hash, display_name FROM users WHERE username = :u LIMIT 1');
        $stmt->execute([':u' => $username]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            return false;
        }
        self::startSession();
        $_SESSION['cws_admin_id'] = (int) $user['id'];
        $_SESSION['cws_admin_name'] = $user['display_name'];
        return true;
    }

    public static function logout(): void
    {
        self::startSession();
        $_SESSION = [];
        session_destroy();
    }

    public static function displayName(): string
    {
        self::startSession();
        return (string) ($_SESSION['cws_admin_name'] ?? 'Admin');
    }
}
