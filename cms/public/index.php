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
    if ($method === 'GET' && $path === '/gmb') {
        Http::json($repo->getGmbPublicPayload());
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
    if ($method === 'GET' && $path === '/portfolio') {
        Http::json($repo->getAllPortfolioPublished());
    }
    if ($method === 'GET' && preg_match('#^/portfolio/([a-z0-9][a-z0-9-]*)$#', $path, $m)) {
        $item = $repo->getPortfolioItemBySlug($m[1]);
        Http::json($item ?: ['error' => 'Not found'], $item ? 200 : 404);
    }
    if ($method === 'GET' && $path === '/portfolio/home') {
        $settings = $repo->getSiteSettings();
        $maxPerCategory = max(1, min(24, (int) ($settings['portfolioHomeMax'] ?? 5)));
        Http::json([
            'items' => $repo->getPortfolioForHomepage($maxPerCategory),
            'settings' => [
                'badge' => (string) ($settings['portfolioBadge'] ?? 'Local work'),
                'title' => (string) ($settings['portfolioTitle'] ?? 'Clients we have worked with'),
                'subtitle' => (string) ($settings['portfolioSubtitle'] ?? ''),
                'ctaLabel' => (string) ($settings['portfolioCtaLabel'] ?? 'View all work'),
                'ctaHref' => (string) ($settings['portfolioCtaHref'] ?? '/portfolio'),
                'maxPerCategory' => $maxPerCategory,
            ],
        ]);
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

    $community = cws_community();

    // —— Member auth (public) ——
    if ($method === 'POST' && $path === '/member/register') {
        $body = Http::readJsonBody();
        if (($body['password'] ?? '') !== ($body['confirmPassword'] ?? $body['confirm_password'] ?? '')) {
            Http::json(['success' => false, 'message' => 'Passwords do not match.'], 400);
        }
        try {
            Http::json(MemberAuth::register(
                (string) ($body['email'] ?? ''),
                (string) ($body['password'] ?? ''),
                (string) ($body['displayName'] ?? $body['name'] ?? ''),
            ));
        } catch (InvalidArgumentException $e) {
            Http::json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    if ($method === 'POST' && $path === '/member/login') {
        $body = Http::readJsonBody();
        $result = MemberAuth::login((string) ($body['email'] ?? ''), (string) ($body['password'] ?? ''));
        if (!$result) {
            Http::json(['success' => false, 'message' => 'Invalid email or password.'], 401);
        }
        Http::json($result);
    }

    if ($method === 'POST' && $path === '/member/google') {
        $body = Http::readJsonBody();
        $result = MemberAuth::loginWithGoogle((string) ($body['credential'] ?? $body['idToken'] ?? ''));
        if (!$result) {
            Http::json(['success' => false, 'message' => 'Google sign-in failed.'], 401);
        }
        Http::json($result);
    }

    if ($method === 'POST' && $path === '/member/logout') {
        $auth = MemberAuth::authorizationHeader();
        if (preg_match('/Bearer\s+(\S+)/i', $auth, $m)) {
            MemberAuth::revoke($m[1]);
        }
        Http::json(['success' => true]);
    }

    if ($method === 'GET' && $path === '/member/me') {
        $member = MemberAuth::requireMember();
        Http::json(['success' => true, 'member' => $member]);
    }

    if ($method === 'GET' && $path === '/member/contributions') {
        $member = MemberAuth::requireMember();
        Http::json($community->getMemberContributions((int) $member['id']));
    }

    if ($method === 'GET' && $path === '/member/blog') {
        $member = MemberAuth::requireMember();
        Http::json(['items' => $community->getMemberContributions((int) $member['id'])['blogPosts']]);
    }

    if ($method === 'POST' && $path === '/member/blog') {
        $member = MemberAuth::requireMember();
        $body = Http::readJsonBody();
        if (empty($body['title'])) {
            Http::json(['error' => 'Title is required'], 400);
        }
        $id = $community->createMemberBlogPost((int) $member['id'], $body);
        Http::json(['success' => true, 'id' => $id, 'status' => 'pending_review']);
    }

    if ($method === 'GET' && preg_match('#^/member/blog/(\d+)$#', $path, $m)) {
        $member = MemberAuth::requireMember();
        $post = $community->getMemberBlogPost((int) $member['id'], (int) $m[1]);
        Http::json($post ?: ['error' => 'Not found'], $post ? 200 : 404);
    }

    if ($method === 'PUT' && preg_match('#^/member/blog/(\d+)$#', $path, $m)) {
        $member = MemberAuth::requireMember();
        $community->updateMemberBlogPost((int) $member['id'], (int) $m[1], Http::readJsonBody());
        Http::json(['success' => true, 'status' => 'pending_review']);
    }

    if ($method === 'GET' && preg_match('#^/blog/([a-z0-9][a-z0-9-]*)/comments$#', $path, $m)) {
        $postId = $community->getBlogPostIdBySlug($m[1]);
        if (!$postId) {
            Http::json(['error' => 'Post not found'], 404);
        }
        $viewer = MemberAuth::optionalMember();
        Http::json($community->listApprovedComments($postId, $viewer ? (int) $viewer['id'] : null));
    }

    if ($method === 'POST' && preg_match('#^/blog/([a-z0-9][a-z0-9-]*)/comments$#', $path, $m)) {
        $member = MemberAuth::requireMember();
        $postId = $community->getBlogPostIdBySlug($m[1]);
        if (!$postId) {
            Http::json(['error' => 'Post not found'], 404);
        }
        $body = Http::readJsonBody();
        Http::json($community->createBlogComment($postId, (int) $member['id'], (string) ($body['body'] ?? '')));
    }

    if ($method === 'GET' && $path === '/community/forums') {
        Http::json($community->listForumsPublic());
    }

    if ($method === 'GET' && preg_match('#^/community/forums/([a-z0-9][a-z0-9-]*)$#', $path, $m) && !isset($segments[3])) {
        $forum = $community->getForumBySlug($m[1]);
        if (!$forum) {
            Http::json(['error' => 'Not found'], 404);
        }
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $per = min(50, max(5, (int) ($_GET['perPage'] ?? 20)));
        Http::json(['forum' => $forum, ...$community->listForumTopicsPublic((int) $forum['id'], $page, $per)]);
    }

    if ($method === 'GET' && preg_match('#^/community/forums/([a-z0-9][a-z0-9-]*)/([a-z0-9][a-z0-9-]*)$#', $path, $m)) {
        $forum = $community->getForumBySlug($m[1]);
        if (!$forum) {
            Http::json(['error' => 'Not found'], 404);
        }
        $topic = $community->getTopicPublic((int) $forum['id'], $m[2]);
        Http::json($topic ? ['forum' => $forum, 'topic' => $topic] : ['error' => 'Not found'], $topic ? 200 : 404);
    }

    if ($method === 'POST' && $path === '/community/forums') {
        $member = MemberAuth::requireMember();
        Http::json($community->createForum((int) $member['id'], Http::readJsonBody()));
    }

    if ($method === 'POST' && preg_match('#^/community/forums/([a-z0-9][a-z0-9-]*)/topics$#', $path, $m)) {
        $member = MemberAuth::requireMember();
        $forum = $community->getForumBySlug($m[1]);
        if (!$forum) {
            Http::json(['error' => 'Forum not found'], 404);
        }
        Http::json($community->createTopic((int) $forum['id'], (int) $member['id'], Http::readJsonBody()));
    }

    if ($method === 'POST' && preg_match('#^/community/topics/(\d+)/replies$#', $path, $m)) {
        $member = MemberAuth::requireMember();
        $body = Http::readJsonBody();
        $parent = isset($body['parentId']) ? (int) $body['parentId'] : null;
        Http::json($community->createReply((int) $m[1], (int) $member['id'], (string) ($body['body'] ?? ''), $parent));
    }

    Http::json(['error' => 'Not found', 'path' => $path], 404);
} catch (Throwable $e) {
    Http::json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
}
