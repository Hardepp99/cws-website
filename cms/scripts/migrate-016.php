<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

$sql = file_get_contents(dirname(__DIR__) . '/database/migrations/016_media_member_id.sql');
foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
    if ($statement === '' || stripos($statement, 'USE ') === 0) {
        continue;
    }
    try {
        cws_db()->exec($statement);
    } catch (PDOException $e) {
        if (!str_contains($e->getMessage(), 'Duplicate column')) {
            throw $e;
        }
    }
}

echo "Migration 016 applied (media.member_id).\n";
