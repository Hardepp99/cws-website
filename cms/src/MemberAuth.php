<?php

declare(strict_types=1);

final class MemberAuth
{
    public static function register(string $email, string $password, string $displayName): array
    {
        $email = strtolower(trim($email));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email address.');
        }
        if (strlen($password) < 8) {
            throw new InvalidArgumentException('Password must be at least 8 characters.');
        }
        $name = trim($displayName);
        if ($name === '') {
            throw new InvalidArgumentException('Display name is required.');
        }
        if (self::emailExists($email)) {
            throw new InvalidArgumentException('An account with this email already exists.');
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = cws_db()->prepare(
            'INSERT INTO members (email, password_hash, display_name, email_verified_at, status)
             VALUES (:e, :p, :n, NOW(), :s)'
        );
        $stmt->execute([':e' => $email, ':p' => $hash, ':n' => $name, ':s' => 'active']);
        $id = (int) cws_db()->lastInsertId();

        return self::issueSession($id);
    }

    public static function login(string $email, string $password): ?array
    {
        $email = strtolower(trim($email));
        $stmt = cws_db()->prepare(
            'SELECT id, email, password_hash, display_name, status FROM members WHERE email = :e LIMIT 1'
        );
        $stmt->execute([':e' => $email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || ($row['status'] ?? '') !== 'active') {
            return null;
        }
        if (empty($row['password_hash']) || !password_verify($password, (string) $row['password_hash'])) {
            return null;
        }

        return self::issueSession((int) $row['id']);
    }

    /** @return array<string, mixed>|null */
    public static function loginWithGoogle(string $idToken): ?array
    {
        $payload = self::verifyGoogleIdToken($idToken);
        if (!$payload) {
            return null;
        }
        $sub = (string) ($payload['sub'] ?? '');
        $email = strtolower((string) ($payload['email'] ?? ''));
        $name = trim((string) ($payload['name'] ?? $payload['given_name'] ?? 'Member'));
        if ($sub === '' || $email === '') {
            return null;
        }

        $stmt = cws_db()->prepare('SELECT id, status FROM members WHERE google_sub = :g OR email = :e LIMIT 1');
        $stmt->execute([':g' => $sub, ':e' => $email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            if (($row['status'] ?? '') !== 'active') {
                return null;
            }
            $upd = cws_db()->prepare(
                'UPDATE members SET google_sub = :g, display_name = COALESCE(NULLIF(display_name, ""), :n), email_verified_at = COALESCE(email_verified_at, NOW()) WHERE id = :id'
            );
            $upd->execute([':g' => $sub, ':n' => $name, ':id' => (int) $row['id']]);

            return self::issueSession((int) $row['id']);
        }

        $ins = cws_db()->prepare(
            'INSERT INTO members (email, google_sub, display_name, email_verified_at, status, password_hash)
             VALUES (:e, :g, :n, NOW(), :s, NULL)'
        );
        $ins->execute([':e' => $email, ':g' => $sub, ':n' => $name, ':s' => 'active']);

        return self::issueSession((int) cws_db()->lastInsertId());
    }

    public static function validateBearer(?string $header): ?int
    {
        if (!$header || !preg_match('/^Bearer\s+(\S+)$/i', $header, $m)) {
            return null;
        }

        return self::memberIdFromToken($m[1]);
    }

    public static function memberIdFromToken(string $token): ?int
    {
        $stmt = cws_db()->prepare(
            'SELECT member_id FROM member_sessions WHERE token = :t AND expires_at > NOW() LIMIT 1'
        );
        $stmt->execute([':t' => $token]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? (int) $row['member_id'] : null;
    }

    public static function revoke(string $token): void
    {
        cws_db()->prepare('DELETE FROM member_sessions WHERE token = :t')->execute([':t' => $token]);
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
            foreach (apache_request_headers() as $key => $value) {
                if (strtolower((string) $key) === 'authorization') {
                    return (string) $value;
                }
            }
        }
        if (!empty($_SERVER['HTTP_X_CWS_MEMBER_TOKEN'])) {
            return 'Bearer ' . trim((string) $_SERVER['HTTP_X_CWS_MEMBER_TOKEN']);
        }

        return '';
    }

    /** @return array<string, mixed>|null */
    public static function getMemberById(int $id): ?array
    {
        $stmt = cws_db()->prepare(
            'SELECT id, email, display_name, avatar_url, status, created_at FROM members WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? self::mapPublic($row) : null;
    }

    public static function requireMember(): array
    {
        $member = self::optionalMember();
        if (!$member) {
            Http::json(['success' => false, 'message' => 'Sign in required.'], 401);
        }

        return $member;
    }

    /** @return array<string, mixed>|null */
    public static function optionalMember(): ?array
    {
        $id = self::validateBearer(self::authorizationHeader());
        if (!$id) {
            return null;
        }

        return self::getMemberById($id);
    }

    /** @return array<string, mixed> */
    private static function issueSession(int $memberId): array
    {
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + 30 * 86400);
        cws_db()->prepare(
            'INSERT INTO member_sessions (member_id, token, expires_at) VALUES (:m, :t, :e)'
        )->execute([':m' => $memberId, ':t' => $token, ':e' => $expires]);

        $member = self::getMemberById($memberId);

        return [
            'success'     => true,
            'token'       => $token,
            'member'      => $member,
            'displayName' => $member['displayName'] ?? 'Member',
        ];
    }

    private static function emailExists(string $email): bool
    {
        $stmt = cws_db()->prepare('SELECT id FROM members WHERE email = :e LIMIT 1');
        $stmt->execute([':e' => $email]);

        return (bool) $stmt->fetch();
    }

    /** @return array<string, mixed>|null */
    private static function verifyGoogleIdToken(string $idToken): ?array
    {
        $clientId = (string) cws_config('google.oauth_client_id', getenv('GOOGLE_OAUTH_CLIENT_ID') ?: '');
        $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode($idToken);
        $ctx = stream_context_create(['http' => ['timeout' => 8]]);
        $raw = @file_get_contents($url, false, $ctx);
        if (!$raw) {
            return null;
        }
        $data = json_decode($raw, true);
        if (!is_array($data) || !empty($data['error_description'])) {
            return null;
        }
        if ($clientId !== '' && ($data['aud'] ?? '') !== $clientId) {
            return null;
        }

        return $data;
    }

    /** @param array<string, mixed> $row */
    private static function mapPublic(array $row): array
    {
        return [
            'id'          => (int) $row['id'],
            'email'       => (string) $row['email'],
            'displayName' => (string) $row['display_name'],
            'avatarUrl'   => (string) ($row['avatar_url'] ?? ''),
            'createdAt'   => (string) ($row['created_at'] ?? ''),
        ];
    }
}
