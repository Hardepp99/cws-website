<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

$pdo = cws_db();
$sql = file_get_contents(dirname(__DIR__) . '/database/migrations/014_page_faqs.sql');
foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    if ($stmt !== '') {
        try {
            $pdo->exec($stmt);
        } catch (PDOException $e) {
            if (!str_contains($e->getMessage(), 'Duplicate column')) {
                throw $e;
            }
        }
    }
}

echo "Migration 014 applied (faqs JSON on pages, services, portfolio_items, blog_posts).\n";
