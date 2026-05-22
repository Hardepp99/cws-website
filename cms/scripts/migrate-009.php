<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

$pdo = cws_db();
$sql = file_get_contents(dirname(__DIR__) . '/database/migrations/009_blog_display_mode.sql');
foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    if ($stmt !== '') {
        try {
            $pdo->exec($stmt);
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'Duplicate column')) {
                echo "Skip (already applied): " . substr($stmt, 0, 60) . "…\n";
                continue;
            }
            throw $e;
        }
    }
}
echo "Migration 009 applied.\n";
