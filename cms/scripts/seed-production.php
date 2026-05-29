<?php

declare(strict_types=1);

/**
 * One-command production content bootstrap.
 * Run from repo root: php cms/scripts/seed-production.php
 */
$root = dirname(__DIR__, 2);
chdir($root);

/** Optional migrations — safe to fail if already applied. */
$optionalMigrations = [
    'cms/scripts/migrate-002.php',
    'cms/scripts/migrate-003.php',
    'cms/scripts/migrate-005.php',
    'cms/scripts/migrate-008.php',
    'cms/scripts/migrate-009.php',
    'cms/scripts/migrate-010.php',
];

/** Required for a full content refresh. */
$required = [
    'cms/scripts/migrate-seed.php',
    'cms/scripts/seed-gmb-settings.php',
];

echo "=== CWS production seed ===\n\n";

$run = static function (string $script, bool $required) use ($root): void {
    $path = $root . '/' . $script;
    if (!is_file($path)) {
        echo "Skip missing: $script\n";
        return;
    }
    echo ">> php $script\n";
    passthru('php ' . escapeshellarg($path), $code);
    if ($code !== 0) {
        $msg = "Warn: $script (exit $code)" . ($required ? ' — aborting' : ' — continuing') . "\n";
        echo $msg;
        if ($required) {
            exit(1);
        }
    }
    echo "\n";
};

foreach ($optionalMigrations as $script) {
    $run($script, false);
}
foreach ($required as $script) {
    $run($script, true);
}

echo "=== Done. Verify: /api/v1/homepage and /api/v1/portfolio ===\n";
