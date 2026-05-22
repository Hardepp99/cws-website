<?php
/**
 * Full WordPress seed — site settings, menus, homepage, pages, landings, services, blog.
 * Run: php wordpress/scripts/seed-all.php
 */

$frontendBase = getenv('CWS_FRONTEND_URL') ?: 'http://localhost:3000';

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
    fwrite(STDERR, "WordPress not found at cws-cms/wp-load.php\n");
    exit(1);
}
require_once $wpLoad;

if (!function_exists('update_field')) {
    fwrite(STDERR, "ACF plugin required.\n");
    exit(1);
}

$seedDir = dirname(__DIR__) . '/seed-data';
$projectRoot = dirname(__DIR__, 2);

function cws_seed_frontend_url(string $path, string $base): string
{
    if ($path === '#' || str_starts_with($path, 'http')) {
        return $path;
    }
    return rtrim($base, '/') . (str_starts_with($path, '/') ? $path : '/' . $path);
}

function cws_seed_upsert_page(string $slug, array $meta): int
{
    $existing = get_page_by_path($slug);
    $postData = [
        'post_type'    => 'page',
        'post_title'   => $meta['title'],
        'post_name'    => $slug,
        'post_status'  => 'publish',
        'post_content' => $meta['content'] ?? '',
    ];
    if ($existing) {
        $postData['ID'] = $existing->ID;
        $id = wp_update_post($postData);
    } else {
        $id = wp_insert_post($postData);
    }
    if (is_wp_error($id) || !$id) {
        return 0;
    }
    if (!empty($meta['template'])) {
        update_field('page_template', $meta['template'], $id);
    }
    if (!empty($meta['seo_title'])) {
        update_field('seo_title', $meta['seo_title'], $id);
    }
    if (!empty($meta['seo_description'])) {
        update_field('seo_description', $meta['seo_description'], $id);
    }
    if (!empty($meta['seo_keywords'])) {
        update_field('seo_keywords', $meta['seo_keywords'], $id);
    }
    return (int) $id;
}

function cws_seed_menu_items(int $menu_id, array $items, string $frontendBase, int $parent = 0): void
{
    $order = 1;
    foreach ($items as $item) {
        $url = cws_seed_frontend_url($item['href'] ?? '/', $frontendBase);
        $menu_item_id = wp_update_nav_menu_item($menu_id, 0, [
            'menu-item-title'     => $item['label'],
            'menu-item-url'       => $url,
            'menu-item-status'    => 'publish',
            'menu-item-type'      => 'custom',
            'menu-item-parent-id' => $parent,
            'menu-item-position'  => $order++,
        ]);
        if (!empty($item['icon']) && $menu_item_id && !is_wp_error($menu_item_id)) {
            update_post_meta($menu_item_id, '_menu_item_icon', $item['icon']);
        }
        if (!empty($item['children']) && is_array($item['children'])) {
            cws_seed_menu_items($menu_id, $item['children'], $frontendBase, (int) $menu_item_id);
        }
    }
}

function cws_seed_create_menu(string $name, string $location, array $items, string $frontendBase): void
{
    $menu = wp_get_nav_menu_object($name);
    $menu_id = $menu ? (int) $menu->term_id : (int) wp_create_nav_menu($name);
    if (!$menu_id || is_wp_error($menu_id)) {
        echo "Menu failed: $name\n";
        return;
    }
    $existing = wp_get_nav_menu_items($menu_id);
    if ($existing) {
        foreach ($existing as $ei) {
            wp_delete_post($ei->ID, true);
        }
    }
    cws_seed_menu_items($menu_id, $items, $frontendBase);
    $locations = get_theme_mod('nav_menu_locations', []);
    $locations[$location] = $menu_id;
    set_theme_mod('nav_menu_locations', $locations);
    echo "Menu: $name -> $location\n";
}

function cws_seed_layout_name(string $layout): string
{
    return $layout === 'seo_rich' ? 'seo_rich_content' : $layout;
}

function cws_seed_homepage_row(array $section): array
{
    $layout = cws_seed_layout_name($section['acfFcLayout'] ?? '');
    $row = ['acf_fc_layout' => $layout];

    $map = [
        'badge' => 'badge',
        'title' => 'title',
        'subtitle' => 'subtitle',
        'content' => 'content',
        'eyebrow' => 'eyebrow',
        'headline' => 'headline',
        'subheadline' => 'subheadline',
    ];
    foreach ($map as $jsonKey => $acfKey) {
        if (isset($section[$jsonKey])) {
            $row[$acfKey] = $section[$jsonKey];
        }
    }

    if (!empty($section['headlineParts'])) {
        $row['headline_parts'] = array_map(fn ($p) => [
            'text' => $p['text'] ?? '',
            'tone' => $p['tone'] ?? 'white',
        ], $section['headlineParts']);
    }
    if (!empty($section['ctaPrimary'])) {
        $row['cta_primary'] = $section['ctaPrimary'];
    }
    if (!empty($section['ctaSecondary'])) {
        $row['cta_secondary'] = $section['ctaSecondary'];
    }
    if (!empty($section['stats'])) {
        $row['stats'] = $section['stats'];
    }
    if (!empty($section['slides'])) {
        $row['slides'] = array_map(fn ($s) => ['image' => $s['image']['url'] ?? '/assets/images/hero1.png'], $section['slides']);
    }
    if (!empty($section['features'])) {
        $row['features'] = $section['features'];
    }
    if (!empty($section['image'])) {
        $row['image'] = $section['image'];
    }
    if (!empty($section['ctaLabel'])) {
        $row['cta_label'] = $section['ctaLabel'];
    }
    if (!empty($section['ctaHref'])) {
        $row['cta_href'] = $section['ctaHref'];
    }
    if (!empty($section['cards'])) {
        $row['cards'] = $section['cards'];
    }
    if (!empty($section['steps'])) {
        $row['steps'] = $section['steps'];
    }
    if (!empty($section['items'])) {
        $row['grid_items'] = array_map(fn ($i) => [
            'title'       => $i['title'] ?? '',
            'description' => $i['desc'] ?? $i['description'] ?? '',
            'href'        => $i['href'] ?? '',
            'icon'        => $i['icon'] ?? 'fas fa-check',
            'letter'      => $i['letter'] ?? '',
            'tone'        => $i['tone'] ?? '',
        ], $section['items']);
    }
    if (!empty($section['courses'])) {
        $row['course_items'] = array_map(fn ($c) => [
            'title'       => $c['title'] ?? '',
            'description' => $c['desc'] ?? $c['description'] ?? '',
            'href'        => $c['href'] ?? '/courses',
            'icon'        => $c['icon'] ?? 'fas fa-book',
        ], $section['courses']);
    }
    if (!empty($section['testimonials'])) {
        $row['testimonial_items'] = $section['testimonials'];
    }
    if (!empty($section['portfolioItems'])) {
        $row['portfolio_items'] = array_map(fn ($p) => [
            'title' => $p['title'] ?? '',
            'image' => $p['image'] ?? '/assets/images/hero1.png',
            'href'  => $p['href'] ?? '/portfolio',
        ], $section['portfolioItems']);
    }
    if (!empty($section['ctaLabel']) && $layout === 'layout_cta') {
        $row['cta_label'] = $section['ctaLabel'];
    }

    return $row;
}

echo "=== CWS full seed (frontend: $frontendBase) ===\n\n";

// Site settings
$settingsFile = $seedDir . '/site-settings.json';
$settings = json_decode(file_get_contents($settingsFile), true);
if (!is_array($settings)) {
    fwrite(STDERR, "Missing or invalid site-settings.json\n");
    exit(1);
}

foreach ([
    'phone' => 'phone',
    'email' => 'email',
    'address' => 'address',
    'primaryColor' => 'primary_color',
    'secondaryColor' => 'secondary_color',
    'footerText' => 'footer_text',
    'facebook' => 'facebook_url',
    'linkedin' => 'linkedin_url',
    'instagram' => 'instagram_url',
    'footerCompanyTitle' => 'footer_company_title',
    'footerServicesTitle' => 'footer_services_title',
    'footerProductsTitle' => 'footer_products_title',
] as $jsonKey => $acfName) {
    if (isset($settings[$jsonKey])) {
        update_field($acfName, $settings[$jsonKey], 'option');
    }
}
echo "Site settings OK\n";

// Ask price form options (bundles, budgets, timelines, service group rules)
$pricingFile = $seedDir . '/pricing-options.json';
if (file_exists($pricingFile)) {
    $pricing = json_decode(file_get_contents($pricingFile), true);
    if (is_array($pricing)) {
        update_option('cws_pricing_bundles', $pricing['bundles'] ?? []);
        update_option('cws_pricing_budget_ranges', $pricing['budgetRanges'] ?? []);
        update_option('cws_pricing_timelines', $pricing['timelines'] ?? []);
        update_option('cws_pricing_group_rules', $pricing['serviceGroupRules'] ?? []);

        $bundleRows = [];
        foreach ($pricing['bundles'] ?? [] as $b) {
            $bundleRows[] = [
                'bundle_id' => $b['id'] ?? '',
                'label'     => $b['label'] ?? '',
                'summary'   => $b['summary'] ?? '',
                'includes'  => implode("\n", $b['includes'] ?? []),
            ];
        }
        update_field('pricing_bundles', $bundleRows, 'option');

        $budgetRows = [];
        foreach ($pricing['budgetRanges'] ?? [] as $row) {
            $budgetRows[] = ['value' => $row['value'] ?? '', 'label' => $row['label'] ?? ''];
        }
        update_field('pricing_budget_ranges', $budgetRows, 'option');

        $timelineRows = [];
        foreach ($pricing['timelines'] ?? [] as $row) {
            $timelineRows[] = ['value' => $row['value'] ?? '', 'label' => $row['label'] ?? ''];
        }
        update_field('pricing_timelines', $timelineRows, 'option');

        echo "Pricing form options OK\n";
    }
}

// Menus
$menus = json_decode(file_get_contents($seedDir . '/menus.json'), true);
cws_seed_create_menu('CWS Primary', 'primary', $menus['primary'] ?? [], $frontendBase);
cws_seed_create_menu('CWS Footer Company', 'footer', $menus['footer'] ?? [], $frontendBase);
cws_seed_create_menu('CWS Footer Services', 'footer_services', $menus['footer_services'] ?? [], $frontendBase);
cws_seed_create_menu('CWS Footer Products', 'footer_products', $menus['footer_products'] ?? [], $frontendBase);

$pagesContentFile = $seedDir . '/pages-content.json';
$pagesContent = file_exists($pagesContentFile)
    ? json_decode(file_get_contents($pagesContentFile), true)
    : [];
$homeMeta = $pagesContent['home']['seo'] ?? [];

// Home page
$homeId = cws_seed_upsert_page('home', [
    'title' => 'Home',
    'content' => '',
    'seo_title' => $homeMeta['title'] ?? 'Web Development Company in Chandigarh | Creative Web Solutions',
    'seo_description' => $homeMeta['description'] ?? 'Website development, mobile apps, ecommerce, digital marketing, SEO, and IT training in Zirakpur, Chandigarh, and Mohali.',
    'seo_keywords' => $homeMeta['keywords'] ?? 'web development company Chandigarh, website developer Zirakpur, digital marketing Mohali',
]);
if ($homeId) {
    update_option('show_on_front', 'page');
    update_option('page_on_front', $homeId);

    $hpFile = $seedDir . '/homepage-sections.json';
    if (file_exists($hpFile)) {
        $sections = json_decode(file_get_contents($hpFile), true);
        $rows = array_map('cws_seed_homepage_row', $sections);
        update_field('homepage_sections', $rows, $homeId);
        echo "Homepage sections: " . count($rows) . "\n";
    }
}

// Static pages (full HTML + SEO from pages-content.json)
$pageTitles = [
    'about'     => 'About Us',
    'services'  => 'Our Services',
    'contact'   => 'Contact Us',
    'blog'      => 'Blog',
    'portfolio' => 'Portfolio',
    'courses'   => 'Courses & Training',
];
foreach ($pageTitles as $slug => $title) {
    $block = $pagesContent[$slug] ?? [];
    $seo = $block['seo'] ?? [];
    $id = cws_seed_upsert_page($slug, [
        'title'            => $title,
        'template'         => $block['template'] ?? 'default',
        'content'          => $block['content'] ?? '',
        'seo_title'        => $seo['title'] ?? $title,
        'seo_description'  => $seo['description'] ?? '',
        'seo_keywords'     => $seo['keywords'] ?? '',
    ]);
    if ($id) {
        echo "Page: $slug ($id) — " . strlen($block['content'] ?? '') . " chars body\n";
    }
}

// Service landings (reuse php data)
$phpData = $projectRoot . '/php/includes/service-seo-data.php';
if (file_exists($phpData)) {
    require_once $phpData;
    passthru('php ' . escapeshellarg(dirname(__FILE__) . '/seed-service-landings.php'), $code);
}

// Services CPT
$servicesJson = $projectRoot . '/frontend/src/data/service-details.seed.json';
if (file_exists($servicesJson)) {
    passthru('php ' . escapeshellarg(dirname(__FILE__) . '/seed-pages-and-services.php'), $code2);
}

// Blog posts (full article HTML)
$blogFile = $seedDir . '/blog-posts.json';
if (file_exists($blogFile)) {
    $posts = json_decode(file_get_contents($blogFile), true);
    foreach ($posts as $post) {
        $slug = $post['slug'];
        $existing = get_page_by_path($slug, OBJECT, 'post');
        $data = [
            'post_type'    => 'post',
            'post_title'   => $post['title'],
            'post_name'    => $slug,
            'post_status'  => 'publish',
            'post_content' => $post['content'] ?? '',
            'post_excerpt' => wp_strip_all_tags($post['excerpt'] ?? ''),
        ];
        if ($existing) {
            $data['ID'] = $existing->ID;
            $postId = wp_update_post($data);
        } else {
            $postId = wp_insert_post($data);
        }
        if ($postId && !is_wp_error($postId) && !empty($post['seo'])) {
            update_post_meta($postId, 'rank_math_title', $post['seo']['title'] ?? '');
            update_post_meta($postId, 'rank_math_description', $post['seo']['description'] ?? '');
        }
        echo "Post: $slug\n";
    }
}

echo "\n=== Seed complete. Flush permalinks in WP admin if needed. ===\n";
