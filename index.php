<?php

declare(strict_types=1);

/**
 * WAMP: opening http://localhost/cws-website/ lands here.
 * The live Next.js site runs on port 3000 — not the legacy php/ folder.
 */
$nextBase = getenv('CWS_NEXT_URL') ?: 'http://localhost:3000';
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = preg_replace('#^/cws-website#', '', $uri) ?: '/';
$target = rtrim($nextBase, '/') . $path;
header('Location: ' . $target, true, 302);
exit;
