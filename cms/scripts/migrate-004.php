<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

$sqlFile = dirname(__DIR__) . '/database/migrations/004_media_library.sql';
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

$uploadDir = (string) cws_config('upload_dir', dirname(__DIR__) . '/uploads');
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}
$htaccess = $uploadDir . '/.htaccess';
if (!is_file($htaccess)) {
    file_put_contents($htaccess, <<<'HT'
<FilesMatch "\.(php|phtml|php3|php4|php5|php7|php8|phar|pl|py|cgi|asp|aspx|jsp|sh|exe|bat|cmd)$">
  Require all denied
</FilesMatch>
Options -Indexes -ExecCGI
RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8
RemoveType .php .phtml .php3 .php4 .php5 .php7 .php8
HT);
    echo "OK: uploads/.htaccess\n";
}

echo "Migration 004 finished.\n";
