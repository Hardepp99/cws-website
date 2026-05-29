<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

$pdo = cws_db();
$sql = file_get_contents(dirname(__DIR__) . '/database/migrations/012_crm_inbox.sql');
foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    if ($stmt !== '') {
        try {
            $pdo->exec($stmt);
        } catch (PDOException $e) {
            echo 'Migration 012 warn: ' . $e->getMessage() . "\n";
        }
    }
}

$crm = cws_crm();
$crm->backfillSubmissionMeta();

echo "Migration 012 applied (CRM inbox columns).\n";
