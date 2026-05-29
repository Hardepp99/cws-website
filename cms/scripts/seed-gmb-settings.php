<?php

declare(strict_types=1);

/**
 * Merge GMB fields into site_settings from wordpress/seed-data/site-settings.json
 * Run: php cms/scripts/seed-gmb-settings.php
 */
require dirname(__DIR__) . '/bootstrap.php';

$root = dirname(__DIR__, 2);
$jsonPath = $root . '/wordpress/seed-data/site-settings.json';
if (!is_file($jsonPath)) {
    fwrite(STDERR, "Missing $jsonPath\n");
    exit(1);
}

$seed = json_decode((string) file_get_contents($jsonPath), true, 512, JSON_THROW_ON_ERROR);
$repo = cws_repo();
$current = $repo->getSiteSettings();
$merged = array_merge($current, array_intersect_key($seed, array_flip([
    'gmbMapsUrl',
    'gmbPlaceName',
    'gmbRating',
    'gmbReviewCount',
    'gmbReviewsJson',
])));
$repo->saveSiteSettings($merged);
echo "GMB settings saved (Maps URL + " . strlen((string) ($merged['gmbReviewsJson'] ?? '')) . " bytes reviews JSON).\n";
