<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

$sqlFile = dirname(__DIR__) . '/database/migrations/003_homepage_section_status.sql';
$sql = file_get_contents($sqlFile);
$db = cws_db();

foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    if ($stmt === '' || str_starts_with($stmt, 'USE ')) {
        continue;
    }
    try {
        $db->exec($stmt);
        echo "OK: " . substr(str_replace("\n", ' ', $stmt), 0, 70) . "…\n";
    } catch (PDOException $e) {
        if (str_contains($e->getMessage(), 'Duplicate column')) {
            echo "SKIP: column exists\n";
            continue;
        }
        fwrite(STDERR, $e->getMessage() . "\n");
    }
}

echo "Migration 003 finished.\n";
