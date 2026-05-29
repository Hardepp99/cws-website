<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

$pdo = cws_db();
$sql = file_get_contents(dirname(__DIR__) . '/database/migrations/015_community.sql');
foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    $stmt = trim(preg_replace('/--[^\n]*\n?/', '', $stmt) ?? $stmt);
    if ($stmt === '') {
        continue;
    }
    try {
        $pdo->exec($stmt);
    } catch (PDOException $e) {
        if (!str_contains($e->getMessage(), 'Duplicate') && !str_contains($e->getMessage(), 'already exists')) {
            throw $e;
        }
    }
}

echo "Migration 015 applied (members, comments, forums, member blogs).\n";
