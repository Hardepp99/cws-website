<?php

declare(strict_types=1);

/**
 * Seed local client portfolio items.
 * Run: php cms/scripts/migrate-010.php && php cms/scripts/seed-portfolio.php
 */
require dirname(__DIR__) . '/bootstrap.php';

$root = dirname(__DIR__, 2);
$jsonPath = $root . '/wordpress/seed-data/portfolio-items.json';
if (!is_file($jsonPath)) {
    fwrite(STDERR, "Missing $jsonPath\n");
    exit(1);
}

$items = json_decode((string) file_get_contents($jsonPath), true, 512, JSON_THROW_ON_ERROR);
$repo = cws_repo();

if (!$repo->portfolioTableExists()) {
    fwrite(STDERR, "Run php cms/scripts/migrate-010.php first.\n");
    exit(1);
}

$pdo = cws_db();
$pdo->exec('DELETE FROM portfolio_items');

$n = 0;
foreach ($items as $row) {
    if (!is_array($row)) {
        continue;
    }
    $repo->createPortfolioItem($row);
    $n++;
}

echo "Seeded $n portfolio items.\n";
