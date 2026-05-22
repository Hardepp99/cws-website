<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

Http::cors();

$repo = cws_repo();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

// Strip base path: /cws-website/cms/public/api/v1/settings -> /api/v1/settings
$base = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/');
if ($base && str_starts_with($uri, $base)) {
    $uri = substr($uri, strlen($base)) ?: '/';
}

if (!str_starts_with($uri, '/api/v1')) {
    Http::json(['ok' => true, 'service' => 'CWS CMS API', 'version' => '1'], 200);
}

$path = substr($uri, strlen('/api/v1')) ?: '/';
$segments = array_values(array_filter(explode('/', trim($path, '/'))));

try {
    if ($method === 'GET' && preg_match('#^/media/(\d+)/file$#', $path, $m)) {
        cws_media()->serve((int) $m[1], (string) ($_GET['variant'] ?? 'medium'));
    }

    if (str_starts_with($path, '/admin')) {
        $adminPath = substr($path, strlen('/admin')) ?: '/';
        AdminApi::handle($method, $adminPath, $repo);
    }
    if ($method === 'GET' && $path === '/settings') {
        Http::json($repo->getSiteSettings());
    }
    if ($method === 'GET' && $path === '/menus') {
        Http::json($repo->getMenus());
    }
    if ($method === 'GET' && $path === '/pricing-options') {
        Http::json($repo->getPricingOptions());
    }
    if ($method === 'GET' && $path === '/homepage') {
        $page = $repo->getHomepage();
        Http::json($page ?? ['error' => 'Homepage not found'], $page ? 200 : 404);
    }
    if ($method === 'GET' && ($segments[0] ?? '') === 'pages' && isset($segments[1])) {
        $page = $repo->getPageBySlug($segments[1]);
        Http::json($page ?? ['error' => 'Not found'], $page ? 200 : 404);
    }
    if ($method === 'GET' && ($segments[0] ?? '') === 'landings' && !isset($segments[1])) {
        Http::json($repo->getAllServiceLandings());
    }
    if ($method === 'GET' && ($segments[0] ?? '') === 'landings' && isset($segments[1])) {
        $landing = $repo->getServiceLanding($segments[1]);
        Http::json($landing ?? ['error' => 'Not found'], $landing ? 200 : 404);
    }
    if ($method === 'GET' && ($segments[0] ?? '') === 'services' && isset($segments[1])) {
        $service = $repo->getService($segments[1]);
        Http::json($service ?? ['error' => 'Not found'], $service ? 200 : 404);
    }
    if ($method === 'GET' && $path === '/blog') {
        Http::json($repo->getBlogPosts());
    }

    if ($method === 'GET' && preg_match('#^/desimentor/([a-z_]+)/(\d+)$#', $path, $m)) {
        $dsmt = cws_desimentor();
        $doc = $dsmt->getDocument($m[1], (int) $m[2], false);
        Http::json($doc ?? ['error' => 'Not found'], $doc ? 200 : 404);
    }
    if ($method === 'GET' && $path === '/slugs') {
        Http::json($repo->getAllSlugs());
    }

    if ($method === 'POST' && $path === '/contact') {
        $body = Http::readJsonBody();
        if (empty($body['name']) || empty($body['email']) || empty($body['phone']) || empty($body['message'])) {
            Http::json(['success' => false, 'message' => 'All fields are required.'], 400);
        }
        $repo->saveFormSubmission('contact', $body);
        Http::json(['success' => true, 'message' => 'Thank you! We will contact you soon.']);
    }

    if ($method === 'POST' && $path === '/lead') {
        $body = Http::readJsonBody();
        $repo->saveFormSubmission($body['source'] ?? 'ask_price', $body);
        Http::json(['success' => true, 'message' => 'Thank you! Our team will reach out shortly.']);
    }

    if ($method === 'POST' && $path === '/enrollment') {
        $body = Http::readJsonBody();
        $repo->saveFormSubmission('enrollment', $body);
        Http::json(['success' => true, 'message' => 'Thank you! We will contact you about the course.']);
    }

    if ($method === 'POST' && $path === '/track-view') {
        $body = Http::readJsonBody();
        $repo->trackPageView((string) ($body['path'] ?? '/'), (string) ($body['slug'] ?? ''));
        Http::json(['ok' => true]);
    }

    Http::json(['error' => 'Not found', 'path' => $path], 404);
} catch (Throwable $e) {
    Http::json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
}
