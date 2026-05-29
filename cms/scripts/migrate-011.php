<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

$pdo = cws_db();
$sql = file_get_contents(dirname(__DIR__) . '/database/migrations/011_admin_users_activity.sql');
foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    if ($stmt !== '') {
        try {
            $pdo->exec($stmt);
        } catch (PDOException $e) {
            echo 'Migration 011 warn: ' . $e->getMessage() . "\n";
        }
    }
}
echo "Migration 011 applied (user roles + activity log).\n";
