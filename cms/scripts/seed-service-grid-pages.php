<?php

declare(strict_types=1);

/**
 * Create/update CMS pages for homepage services grid (Elementor-editable site pages).
 * Run: php cms/scripts/seed-service-grid-pages.php
 */
require dirname(__DIR__) . '/bootstrap.php';
require __DIR__ . '/service-grid-page-content.php';

$root = dirname(__DIR__, 2);
$pdo = cws_db();
$landings = json_decode(
    (string) file_get_contents($root . '/frontend/src/data/service-landings.json'),
    true,
    512,
    JSON_THROW_ON_ERROR
);
$seoBodies = json_decode(
    (string) file_get_contents($root . '/wordpress/seed-data/landing-seo-bodies.json'),
    true,
    512,
    JSON_THROW_ON_ERROR
);

$select = $pdo->prepare('SELECT id FROM pages WHERE slug = :slug LIMIT 1');
$insert = $pdo->prepare(
    'INSERT INTO pages (slug, title, content_html, template, seo_title, seo_description, seo_keywords, status, is_homepage)
     VALUES (:slug, :title, :content, :tpl, :st, :sd, :sk, :status, 0)'
);
$update = $pdo->prepare(
    'UPDATE pages SET title = :title, content_html = :content, template = :tpl,
     seo_title = :st, seo_description = :sd, seo_keywords = :sk, status = :status WHERE slug = :slug'
);

$count = 0;
foreach (cws_service_grid_slugs() as $slug) {
    if (!isset($landings[$slug]) || !is_array($landings[$slug])) {
        echo "Skip missing landing data: $slug\n";
        continue;
    }
    $row = cws_service_grid_page_row($slug, $landings[$slug], $seoBodies[$slug] ?? []);
    $params = [
        ':slug'    => $row['slug'],
        ':title'   => $row['title'],
        ':content' => $row['content_html'],
        ':tpl'     => $row['template'],
        ':st'      => $row['seo_title'],
        ':sd'      => $row['seo_description'],
        ':sk'      => $row['seo_keywords'],
        ':status'  => $row['status'],
    ];
    $select->execute([':slug' => $slug]);
    $existing = $select->fetch();
    if ($existing) {
        $update->execute($params);
        echo "Updated page: $slug (id {$existing['id']})\n";
    } else {
        $insert->execute($params);
        echo "Created page: $slug (id {$pdo->lastInsertId()})\n";
    }
    $count++;
}

echo "Done. $count service grid pages ready. Edit in Admin → Site Pages → Edit with Elementor.\n";
