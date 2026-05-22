<?php
/**
 * One-off: generate a WordPress-compatible password hash for direct DB update.
 * Usage: php wordpress/scripts/generate-wp-password.php
 */

$wpRoot = getenv('WP_ROOT') ?: 'C:/wamp64/www/cws-cms';
$wpPassFile = $wpRoot . '/wp-includes/class-phpass.php';

if (!is_file($wpPassFile)) {
    fwrite(STDERR, "WordPress not found at: {$wpRoot}\n");
    exit(1);
}

require_once $wpPassFile;

$plain = 'Cws@' . bin2hex(random_bytes(6)) . random_int(10, 99);
$hasher = new PasswordHash(8, true);
$hash = $hasher->HashPassword($plain);

echo "Username (typical): admin\n";
echo "Plain password (save this — shown once):\n";
echo $plain . "\n\n";
echo "Paste this into wp_users.user_pass (Function: leave as raw value):\n";
echo $hash . "\n";
