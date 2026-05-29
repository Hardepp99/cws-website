<?php

declare(strict_types=1);

/**
 * Seed published Desimentor (Elementor-style) layouts for pages, landings, services, and blog posts.
 * Invoked from migrate-seed.php after core content import.
 */
function cws_seed_desimentor_content(PDO $db, ContentRepository $repo, string $seedDir): void
{
    if (!function_exists('cws_desimentor') || !cws_desimentor()->tableExists()) {
        echo "Desimentor: skipped (tables missing — run migrate-007.php)\n";
        return;
    }

    require_once __DIR__ . '/desimentor-seed-builder.php';

    $dsmt = cws_desimentor();
    $pagesContent = [];
    $pagesFile = $seedDir . '/pages-content.json';
    if (is_file($pagesFile)) {
        $decoded = json_decode((string) file_get_contents($pagesFile), true);
        if (is_array($decoded)) {
            $pagesContent = $decoded;
        }
    }

    $pageRows = $db->query(
        "SELECT id, slug, title, content_html, is_homepage FROM pages WHERE status = 'published'"
    )->fetchAll(PDO::FETCH_ASSOC);

    /** Dedicated Next.js layout — not Elementor */
    $skipPageSlugs = ['contact'];

    $pageCount = 0;
    foreach ($pageRows as $row) {
        if (!empty($row['is_homepage'])) {
            continue;
        }
        $slug = (string) $row['slug'];
        if (in_array($slug, $skipPageSlugs, true)) {
            $repo->setDisplayModeForEntity('page', (int) $row['id'], 'classic');
            continue;
        }
        $title = (string) $row['title'];
        $html = (string) ($row['content_html'] ?: ($pagesContent[$slug]['content'] ?? ''));
        if (trim($html) === '') {
            continue;
        }
        $lead = cws_dsmt_lead_for_slug($slug);
        $doc = cws_dsmt_page_document(
            $slug,
            $title,
            $lead,
            $html,
            cws_dsmt_image_for_slug($slug),
            cws_dsmt_gallery_for_slug($slug)
        );
        $dsmt->saveDocument('page', (int) $row['id'], $doc, 'published');
        $repo->setDisplayModeForEntity('page', (int) $row['id'], 'elementor');
        $pageCount++;
    }
    echo "Desimentor pages: $pageCount\n";

    $landingRows = $db->query(
        'SELECT id, slug, page_title, intro, benefits, deliverables, faq, seo_body_html FROM service_landings WHERE status = \'published\''
    )->fetchAll(PDO::FETCH_ASSOC);

    $landingCount = 0;
    foreach ($landingRows as $row) {
        $benefits = json_decode((string) ($row['benefits'] ?? '[]'), true);
        if (!is_array($benefits)) {
            $benefits = [];
        }
        $deliverables = json_decode((string) ($row['deliverables'] ?? '[]'), true);
        if (!is_array($deliverables)) {
            $deliverables = [];
        }
        $faq = json_decode((string) ($row['faq'] ?? '[]'), true);
        if (!is_array($faq)) {
            $faq = [];
        }
        $html = (string) ($row['seo_body_html'] ?? '');
        $title = (string) ($row['page_title'] ?? $row['slug']);
        $lead = (string) ($row['intro'] ?? '');
        $doc = cws_dsmt_landing_document(
            $title,
            $lead,
            $html,
            cws_dsmt_image_for_slug((string) $row['slug']),
            $benefits,
            $deliverables,
            $faq
        );
        $dsmt->saveDocument('service_landing', (int) $row['id'], $doc, 'published');
        $repo->setDisplayModeForEntity('service_landing', (int) $row['id'], 'elementor');
        $landingCount++;
    }
    echo "Desimentor service landings: $landingCount\n";

    $serviceRows = $db->query(
        'SELECT id, slug, title, hero_title, hero_subtitle, content_html, features FROM services WHERE status = \'published\''
    )->fetchAll(PDO::FETCH_ASSOC);

    $serviceCount = 0;
    foreach ($serviceRows as $row) {
        $features = json_decode((string) ($row['features'] ?? '[]'), true);
        if (!is_array($features)) {
            $features = [];
        }
        $doc = cws_dsmt_service_document(
            (string) ($row['hero_title'] ?: $row['title']),
            (string) ($row['hero_subtitle'] ?? ''),
            (string) ($row['content_html'] ?? ''),
            cws_dsmt_image_for_slug((string) $row['slug']),
            $features
        );
        $dsmt->saveDocument('service', (int) $row['id'], $doc, 'published');
        $repo->setDisplayModeForEntity('service', (int) $row['id'], 'elementor');
        $serviceCount++;
    }
    echo "Desimentor services: $serviceCount\n";

    $blogRows = $db->query(
        'SELECT id, slug, title, excerpt, content_html, featured_image FROM blog_posts WHERE status = \'published\''
    )->fetchAll(PDO::FETCH_ASSOC);

    $blogCount = 0;
    foreach ($blogRows as $row) {
        $img = (string) ($row['featured_image'] ?? '');
        if ($img === '') {
            $img = cws_dsmt_image_for_slug((string) $row['slug']);
        }
        $doc = cws_dsmt_blog_document(
            (string) $row['title'],
            (string) ($row['excerpt'] ?? ''),
            (string) ($row['content_html'] ?? ''),
            $img
        );
        $dsmt->saveDocument('blog_post', (int) $row['id'], $doc, 'published');
        $repo->setDisplayModeForEntity('blog_post', (int) $row['id'], 'elementor');
        $blogCount++;
    }
    echo "Desimentor blog posts: $blogCount\n";
}
