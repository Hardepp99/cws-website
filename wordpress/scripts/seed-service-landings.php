<?php
/**
 * Seed 18 service landing posts from service-seo-data.php
 * Run: php wordpress/scripts/seed-service-landings.php
 * Requires WordPress loaded (run from WP root via wp-cli or include wp-load.php)
 */

$candidates = [
    'C:/wamp64/www/cws-cms/wp-load.php',
    dirname(__DIR__, 2) . '/cws-cms/wp-load.php',
    dirname(__DIR__, 3) . '/cws-cms/wp-load.php',
    dirname(__DIR__, 2) . '/wordpress-site/wp-load.php',
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
$phpData = dirname(__DIR__, 2) . '/php/includes/service-seo-data.php';
if (!file_exists($phpData)) {
    $phpData = dirname(__DIR__, 3) . '/cws-website/php/includes/service-seo-data.php';
}
require_once $phpData;

$themeMap = [
    'website-development-zirakpur' => ['start' => '#1e3a8a', 'mid' => '#2563eb', 'end' => '#3b82f6', 'accent' => '#93c5fd', 'icon' => 'fas fa-globe', 'badge' => 'Responsive Business Websites'],
    'digital-marketing-zirakpur' => ['start' => '#f97316', 'mid' => '#fb923c', 'end' => '#1e3a8a', 'accent' => '#fed7aa', 'icon' => 'fas fa-bullhorn', 'badge' => 'SEO, Ads and Lead Growth'],
    'ecommerce-website-zirakpur' => ['start' => '#0f766e', 'mid' => '#14b8a6', 'end' => '#0f172a', 'accent' => '#99f6e4', 'icon' => 'fas fa-cart-shopping', 'badge' => 'Sell Products Online'],
    'ui-ux-design-zirakpur' => ['start' => '#14b8a6', 'mid' => '#2dd4bf', 'end' => '#1e3a8a', 'accent' => '#ccfbf1', 'icon' => 'fas fa-palette', 'badge' => 'Modern Product Design'],
    'custom-software-development-zirakpur' => ['start' => '#1e3a8a', 'mid' => '#2563eb', 'end' => '#3b82f6', 'accent' => '#93c5fd', 'icon' => 'fas fa-laptop-code', 'badge' => 'Tailored Business Solutions'],
    'crm-development-zirakpur' => ['start' => '#0f766e', 'mid' => '#10b981', 'end' => '#34d399', 'accent' => '#d1fae5', 'icon' => 'fas fa-users-cog', 'badge' => 'Lead and Sales Management'],
    'erp-hrm-software-zirakpur' => ['start' => '#1d4ed8', 'mid' => '#3b82f6', 'end' => '#0f766e', 'accent' => '#bfdbfe', 'icon' => 'fas fa-cogs', 'badge' => 'Operations and HR Control'],
    'mobile-app-development-zirakpur' => ['start' => '#059669', 'mid' => '#10b981', 'end' => '#34d399', 'accent' => '#d1fae5', 'icon' => 'fas fa-mobile-alt', 'badge' => 'Android and iOS Apps'],
    'blockchain-development-zirakpur' => ['start' => '#1e3a8a', 'mid' => '#6366f1', 'end' => '#8b5cf6', 'accent' => '#ddd6fe', 'icon' => 'fas fa-cubes', 'badge' => 'Web3 Product Development'],
    'smart-contract-development-zirakpur' => ['start' => '#4338ca', 'mid' => '#6366f1', 'end' => '#8b5cf6', 'accent' => '#ddd6fe', 'icon' => 'fas fa-file-contract', 'badge' => 'Secure Contract Logic'],
    'graphic-designing-zirakpur' => ['start' => '#ec4899', 'mid' => '#f472b6', 'end' => '#8b5cf6', 'accent' => '#fbcfe8', 'icon' => 'fas fa-pen-nib', 'badge' => 'Creative Brand Assets'],
    'seo-services-zirakpur' => ['start' => '#ea580c', 'mid' => '#f59e0b', 'end' => '#1d4ed8', 'accent' => '#fde68a', 'icon' => 'fas fa-chart-line', 'badge' => 'Rank Better on Google'],
    'wordpress-website-zirakpur' => ['start' => '#1d4ed8', 'mid' => '#3b82f6', 'end' => '#0f172a', 'accent' => '#bfdbfe', 'icon' => 'fab fa-wordpress', 'badge' => 'Easy to Manage Websites'],
    'shopify-website-zirakpur' => ['start' => '#047857', 'mid' => '#10b981', 'end' => '#065f46', 'accent' => '#bbf7d0', 'icon' => 'fas fa-store', 'badge' => 'Conversion Focused Stores'],
    'cms-based-website-zirakpur' => ['start' => '#1e40af', 'mid' => '#3b82f6', 'end' => '#14b8a6', 'accent' => '#bfdbfe', 'icon' => 'fas fa-file-lines', 'badge' => 'Editable Business Websites'],
    'website-maintenance-zirakpur' => ['start' => '#334155', 'mid' => '#475569', 'end' => '#1d4ed8', 'accent' => '#cbd5e1', 'icon' => 'fas fa-screwdriver-wrench', 'badge' => 'Support and Ongoing Updates'],
    'ppc-services-zirakpur' => ['start' => '#b91c1c', 'mid' => '#ef4444', 'end' => '#f59e0b', 'accent' => '#fecaca', 'icon' => 'fas fa-bullseye', 'badge' => 'Google Ads Lead Campaigns'],
    'social-media-marketing-zirakpur' => ['start' => '#7c3aed', 'mid' => '#a855f7', 'end' => '#ec4899', 'accent' => '#e9d5ff', 'icon' => 'fas fa-hashtag', 'badge' => 'Social Reach and Engagement'],
];

$seedDir = dirname(__DIR__) . '/seed-data';
$enrichFile = $seedDir . '/landing-seo-bodies.json';
$enrichments = file_exists($enrichFile)
    ? json_decode(file_get_contents($enrichFile), true)
    : [];

global $serviceLandingPages;
$count = 0;

foreach ($serviceLandingPages as $slug => $data) {
    $extra = $enrichments[$slug] ?? [];
    $existing = get_page_by_path($slug, OBJECT, 'service_landing');
    $theme = $themeMap[$slug] ?? ['start' => '#1e3a8a', 'mid' => '#2563eb', 'end' => '#0f766e', 'accent' => '#bfdbfe', 'icon' => 'fas fa-briefcase', 'badge' => 'Professional Service Solutions'];

    $postData = [
        'post_type'    => 'service_landing',
        'post_title'   => $data['service'],
        'post_name'    => $slug,
        'post_status'  => 'publish',
        'post_content' => $data['intro'],
    ];

    if ($existing) {
        $postData['ID'] = $existing->ID;
        $id = wp_update_post($postData);
    } else {
        $id = wp_insert_post($postData);
    }

    if (is_wp_error($id) || !$id) {
        echo "Failed: $slug\n";
        continue;
    }

    if (function_exists('update_field')) {
        update_field('service_name', $data['service'], $id);
        update_field('intro', $data['intro'], $id);
        update_field('seo_title', $data['pageTitle'], $id);
        update_field('seo_description', $extra['pageDescription'] ?? $data['pageDescription'], $id);
        update_field('seo_keywords', $extra['pageKeywords'] ?? $data['pageKeywords'], $id);
        if (!empty($extra['seoBody'])) {
            update_field('seo_body', $extra['seoBody'], $id);
        }
        update_field('benefits', implode("\n", $data['benefits']), $id);
        update_field('deliverables', implode("\n", $data['deliverables']), $id);
        update_field('related_slugs', implode(',', $data['related']), $id);
        update_field('theme_start', $theme['start'], $id);
        update_field('theme_mid', $theme['mid'], $id);
        update_field('theme_end', $theme['end'], $id);
        update_field('theme_accent', $theme['accent'], $id);
        update_field('icon_class', $theme['icon'], $id);
        update_field('badge_text', $theme['badge'], $id);
        $faqRows = [];
        foreach ($data['faq'] as $item) {
            $faqRows[] = ['question' => $item['question'], 'answer' => $item['answer']];
        }
        foreach ($extra['extraFaq'] ?? [] as $item) {
            $faqRows[] = ['question' => $item['question'], 'answer' => $item['answer']];
        }
        update_field('faq', $faqRows, $id);
    }

    $count++;
    echo "Seeded: $slug (ID $id)\n";
}

echo "Done. $count service landings.\n";
