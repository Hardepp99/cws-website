<?php

declare(strict_types=1);

/**
 * Replace homepage sections with streamlined modern layout.
 * Run: php cms/scripts/apply-homepage-modern.php
 */
require dirname(__DIR__) . '/bootstrap.php';

$root = dirname(__DIR__, 2);
$jsonPath = $root . '/wordpress/seed-data/homepage-sections-modern.json';

if (!is_file($jsonPath)) {
    fwrite(STDERR, "Missing $jsonPath — run from repo after pulling latest.\n");
    exit(1);
}

$sections = json_decode((string) file_get_contents($jsonPath), true, 512, JSON_THROW_ON_ERROR);
if (!is_array($sections)) {
    throw new RuntimeException('Invalid homepage sections JSON');
}

$repo = cws_repo();
$pageId = $repo->getHomepagePageId();
if (!$pageId) {
    fwrite(STDERR, "Homepage page row not found. Run migrate-seed.php first.\n");
    exit(1);
}

$repo->saveHomepageSections($pageId, $sections);
echo 'Homepage updated with ' . count($sections) . " modern sections (page id $pageId).\n";
