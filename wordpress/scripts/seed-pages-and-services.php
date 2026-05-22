<?php
/**
 * Seed WordPress pages (about, services, contact) and service detail CPTs.
 * Run after seed-service-landings.php:
 *   php wordpress/scripts/seed-pages-and-services.php
 */

$candidates = [
    'C:/wamp64/www/cws-cms/wp-load.php',
    dirname(__DIR__, 2) . '/cws-cms/wp-load.php',
];
$wpLoad = null;
foreach ($candidates as $path) {
    if (file_exists($path)) {
        $wpLoad = $path;
        break;
    }
}
if (!$wpLoad) {
    fwrite(STDERR, "WordPress not found. Install at c:\\wamp64\\www\\cws-cms\\\n");
    exit(1);
}
require_once $wpLoad;

if (!function_exists('update_field')) {
    fwrite(STDERR, "ACF is required.\n");
    exit(1);
}

$pagesContentFile = dirname(__DIR__) . '/seed-data/pages-content.json';
$pagesContent = file_exists($pagesContentFile)
    ? json_decode(file_get_contents($pagesContentFile), true)
    : [];
$pageTitles = [
    'about'    => 'About Us',
    'services' => 'Our Services',
    'contact'  => 'Contact Us',
];

foreach ($pageTitles as $slug => $title) {
    $block = $pagesContent[$slug] ?? [];
    $seo = $block['seo'] ?? [];
    $existing = get_page_by_path($slug);
    $postData = [
        'post_type'    => 'page',
        'post_title'   => $title,
        'post_name'    => $slug,
        'post_status'  => 'publish',
        'post_content' => $block['content'] ?? '',
    ];
    if ($existing) {
        $postData['ID'] = $existing->ID;
        $id = wp_update_post($postData);
    } else {
        $id = wp_insert_post($postData);
    }
    if (is_wp_error($id) || !$id) {
        echo "Failed page: $slug\n";
        continue;
    }
    update_field('page_template', $block['template'] ?? 'default', $id);
    update_field('seo_title', $seo['title'] ?? $title, $id);
    update_field('seo_description', $seo['description'] ?? '', $id);
    update_field('seo_keywords', $seo['keywords'] ?? '', $id);
    echo "Page seeded: $slug (ID $id) — " . strlen($block['content'] ?? '') . " chars\n";
}

$servicesJson = dirname(__DIR__, 2) . '/frontend/src/data/service-details.seed.json';
if (!file_exists($servicesJson)) {
    echo "Skip services CPT — missing $servicesJson\n";
    exit(0);
}

$detailBodiesFile = dirname(__DIR__) . '/seed-data/service-detail-bodies.json';
$detailBodies = file_exists($detailBodiesFile)
    ? json_decode(file_get_contents($detailBodiesFile), true)
    : [];

$services = json_decode(file_get_contents($servicesJson), true);
if (!is_array($services)) {
    fwrite(STDERR, "Invalid service-details.seed.json\n");
    exit(1);
}

foreach ($services as $slug => $data) {
    $existing = get_page_by_path($slug, OBJECT, 'service');
    $postData = [
        'post_type'    => 'service',
        'post_title'   => $data['title'] ?? $slug,
        'post_name'    => $slug,
        'post_status'  => 'publish',
        'post_content' => $data['content'] ?? '',
    ];
    if ($existing) {
        $postData['ID'] = $existing->ID;
        $id = wp_update_post($postData);
    } else {
        $id = wp_insert_post($postData);
    }
    if (is_wp_error($id) || !$id) {
        echo "Failed service: $slug\n";
        continue;
    }

    update_field('hero_title', $data['heroTitle'] ?? '', $id);
    update_field('hero_subtitle', $data['heroSubtitle'] ?? '', $id);
    update_field('price_badge', $data['priceBadge'] ?? '', $id);
    update_field('cta_title', $data['ctaTitle'] ?? '', $id);
    update_field('cta_text', $data['ctaText'] ?? '', $id);
    $longContent = $detailBodies[$slug] ?? ($data['content'] ?? '');
    update_field('long_content', $longContent, $id);
    if (!empty($data['seo'])) {
        update_field('seo_title', $data['seo']['title'] ?? '', $id);
        update_field('seo_description', $data['seo']['description'] ?? '', $id);
        update_field('seo_keywords', $data['seo']['keywords'] ?? '', $id);
    }
    if (!empty($data['features'])) {
        $rows = [];
        foreach ($data['features'] as $f) {
            $rows[] = [
                'title'       => $f['title'] ?? '',
                'description' => $f['description'] ?? '',
                'icon'        => $f['icon'] ?? 'fas fa-check',
            ];
        }
        update_field('features', $rows, $id);
    }
    echo "Service seeded: $slug (ID $id)\n";
}

echo "Done.\n";
