<?php
/**
 * Remove Courses / Training / Education links from CMS menus and homepage courses sections.
 * Run: php cms/scripts/remove-courses-nav.php
 */
declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

$repo = cws_repo();

$menuDbKeys = ['primary', 'footer', 'footer_services', 'footer_products'];
$menuRepoKeys = [
    'primary' => 'primary',
    'footer' => 'footer',
    'footer_services' => 'footerServices',
    'footer_products' => 'footerProducts',
];

function should_drop_menu_item(array $item): bool
{
    $label = strtolower((string) ($item['label'] ?? $item['title'] ?? ''));
    $href = strtolower((string) ($item['href'] ?? $item['url'] ?? ''));

    if (str_contains($href, '/courses') || str_contains($href, 'course')) {
        return true;
    }
    if (preg_match('/\b(courses?|training|education|enrollment|tuition)\b/', $label)) {
        return true;
    }
    return false;
}

function filter_menu_items(array $items): array
{
    $out = [];
    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }
        if (should_drop_menu_item($item)) {
            continue;
        }
        if (!empty($item['children']) && is_array($item['children'])) {
            $item['children'] = filter_menu_items($item['children']);
        }
        $out[] = $item;
    }
    return array_values($out);
}

$menus = $repo->getMenus();
foreach ($menuDbKeys as $dbKey) {
    $repoKey = $menuRepoKeys[$dbKey];
    $items = $menus[$repoKey] ?? [];
    if (!is_array($items)) {
        continue;
    }
    $filtered = filter_menu_items($items);
    $repo->saveMenu($dbKey, $filtered);
    echo "Menu {$repoKey}: " . count($items) . " → " . count($filtered) . " items\n";
}

$pageId = $repo->getHomepagePageId();
$sections = $repo->getHomepageSections($pageId);
$kept = [];
$removed = 0;
foreach ($sections as $section) {
    if (($section['acfFcLayout'] ?? '') === 'courses') {
        $removed++;
        continue;
    }
    $kept[] = $section;
}
if ($removed > 0) {
    $repo->saveHomepageSections($pageId, $kept);
    echo "Removed {$removed} homepage section(s) with layout \"courses\".\n";
} else {
    echo "No homepage \"courses\" sections found.\n";
}

$settings = $repo->getSiteSettings();
$changed = false;
if (isset($settings['footerProductsTitle']) && stripos((string) $settings['footerProductsTitle'], 'training') !== false) {
    $settings['footerProductsTitle'] = 'Products';
    $changed = true;
}
if (isset($settings['footerText']) && stripos((string) $settings['footerText'], 'training') !== false) {
    $settings['footerText'] = preg_replace(
        '/\s*(and\s+)?professional\s+IT\s+training\s*/i',
        ' ',
        (string) $settings['footerText']
    ) ?? $settings['footerText'];
    $settings['footerText'] = trim(preg_replace('/\s+/', ' ', (string) $settings['footerText']) ?? '');
    $changed = true;
}
if ($changed) {
    $repo->saveSiteSettings($settings);
    echo "Updated site settings (footer titles/text).\n";
}

echo "Done.\n";
