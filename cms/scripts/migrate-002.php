<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

$sqlFile = dirname(__DIR__) . '/database/migrations/002_seo_analytics.sql';
if (!is_file($sqlFile)) {
    fwrite(STDERR, "Migration file not found.\n");
    exit(1);
}

$db = cws_db();
$sql = file_get_contents($sqlFile);
$statements = array_filter(array_map('trim', explode(';', $sql)));

foreach ($statements as $stmt) {
    if ($stmt === '' || str_starts_with($stmt, 'USE ')) {
        continue;
    }
    try {
        $db->exec($stmt);
        echo "OK: " . substr(str_replace("\n", ' ', $stmt), 0, 80) . "…\n";
    } catch (PDOException $e) {
        if (str_contains($e->getMessage(), 'Duplicate column') || str_contains($e->getMessage(), 'already exists')) {
            echo "SKIP (exists): " . substr($stmt, 0, 60) . "…\n";
            continue;
        }
        fwrite(STDERR, "FAIL: {$e->getMessage()}\n  {$stmt}\n");
    }
}

echo "Migration 002 finished.\n";
