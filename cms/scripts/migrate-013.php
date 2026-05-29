<?php

declare(strict_types=1);

require dirname(__DIR__) . '/bootstrap.php';

$pdo = cws_db();
$sql = file_get_contents(dirname(__DIR__) . '/database/migrations/013_portfolio_detail.sql');
foreach (array_filter(array_map('trim', explode(';', $sql))) as $stmt) {
    if ($stmt !== '') {
        try {
            $pdo->exec($stmt);
        } catch (PDOException $e) {
            if (!str_contains($e->getMessage(), 'Duplicate')) {
                throw $e;
            }
        }
    }
}

$repo = cws_repo();
if (!$repo->portfolioTableExists()) {
    echo "Migration 013: portfolio_items table missing — run migrate-010 first.\n";
    exit(1);
}

$rows = $pdo->query('SELECT id, title, client_name, slug FROM portfolio_items')->fetchAll(PDO::FETCH_ASSOC);
$used = [];
foreach ($pdo->query('SELECT slug FROM portfolio_items WHERE slug != ""')->fetchAll(PDO::FETCH_COLUMN) as $s) {
    $used[$s] = true;
}

$upd = $pdo->prepare('UPDATE portfolio_items SET slug = :slug WHERE id = :id');
foreach ($rows as $row) {
    if (trim((string) ($row['slug'] ?? '')) !== '') {
        continue;
    }
    $base = preg_replace('/[^a-z0-9]+/', '-', strtolower(trim((string) ($row['client_name'] ?: $row['title'] ?: 'project')))) ?? 'project';
    $base = trim($base, '-') ?: 'project';
    $slug = $base;
    $n = 2;
    while (isset($used[$slug])) {
        $slug = $base . '-' . $n++;
    }
    $used[$slug] = true;
    $upd->execute([':slug' => $slug, ':id' => (int) $row['id']]);
}

try {
    $pdo->exec('ALTER TABLE portfolio_items ADD UNIQUE INDEX idx_portfolio_slug (slug)');
} catch (PDOException $e) {
    if (!str_contains($e->getMessage(), 'Duplicate key name')) {
        throw $e;
    }
}

echo "Migration 013 applied (portfolio slug + content columns, slugs backfilled).\n";
