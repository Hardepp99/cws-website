<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

$sqlFile = dirname(__DIR__) . '/database/migrations/007_desimentor.sql';
$sql = file_get_contents($sqlFile);
if ($sql === false) {
    fwrite(STDERR, "Cannot read migration file.\n");
    exit(1);
}

$db = cws_db();
foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    if ($stmt === '' || str_starts_with($stmt, 'USE ')) {
        continue;
    }
    try {
        $db->exec($stmt);
        echo 'OK: ' . substr(str_replace(["\r", "\n"], ' ', $stmt), 0, 72) . "…\n";
    } catch (PDOException $e) {
        if (str_contains($e->getMessage(), 'Duplicate') || str_contains($e->getMessage(), 'already exists')) {
            echo 'SKIP (exists): ' . substr($stmt, 0, 40) . "…\n";
            continue;
        }
        throw $e;
    }
}

echo "Migration 007 finished.\n";
