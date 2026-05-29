<?php

declare(strict_types=1);

final class AdminApi
{
    public static function handle(string $method, string $path, ContentRepository $repo): void
    {
        if ($method === 'POST' && $path === '/login') {
            $body = Http::readJsonBody();
            $result = AdminAuth::login($body['username'] ?? '', $body['password'] ?? '');
            if (!$result) {
                Http::json(['success' => false, 'message' => 'Invalid credentials'], 401);
            }
            Http::json(['success' => true, ...$result]);
        }

        if ($method === 'POST' && $path === '/logout') {
            $auth = AdminAuth::authorizationHeader();
            if (preg_match('/Bearer\s+(\S+)/i', $auth, $m)) {
                AdminAuth::revoke($m[1]);
            }
            Http::json(['success' => true]);
        }

        AdminAuth::requireUser();

        if ($method === 'GET' && $path === '/me') {
            Http::json(['ok' => true]);
        }

        if ($method === 'GET' && $path === '/dashboard/stats') {
            Http::json($repo->getAdminDashboardStats());
        }

        $pageNum = max(1, (int) ($_GET['page'] ?? 1));
        $perPage = min(50, max(5, (int) ($_GET['perPage'] ?? 10)));
        $listQ = AdminListQuery::fromRequest();

        // Homepage sections (row CRUD)
        if ($method === 'GET' && $path === '/homepage/sections/list') {
            $pageId = $repo->getHomepagePageId();
            $statusFilter = (string) ($_GET['status'] ?? 'all');
            if (!$pageId) {
                Http::json([
                    'pageId'  => 0,
                    'items'   => [],
                    'total'   => 0,
                    'page'    => 1,
                    'perPage' => $perPage,
                    'status'  => $statusFilter,
                    'counts'  => ['all' => 0, 'published' => 0, 'draft' => 0, 'trash' => 0],
                ]);
            }
            Http::json($repo->listHomepageSectionRows(
                $pageId,
                $pageNum,
                $perPage,
                $statusFilter,
                $listQ['search'],
                $listQ['sort'],
                $listQ['order']
            ));
        }

        if ($method === 'GET' && preg_match('#^/homepage/sections/(\d+)$#', $path, $m)) {
            $row = $repo->getHomepageSectionRowById((int) $m[1]);
            Http::json($row ?: ['error' => 'Not found'], $row ? 200 : 404);
        }

        if ($method === 'POST' && $path === '/homepage/sections') {
            $body = Http::readJsonBody();
            $pageId = $repo->getHomepagePageId();
            $section = $body['section'] ?? $body;
            if (!$pageId || !is_array($section)) {
                Http::json(['error' => 'Invalid payload'], 400);
            }
            $status = (string) ($body['status'] ?? 'draft');
            $adminTitle = (string) ($body['adminTitle'] ?? '');
            $id = $repo->createHomepageSectionRow($pageId, $section, $status, $adminTitle);
            Http::json(['success' => true, 'id' => $id]);
        }

        if ($method === 'PUT' && preg_match('#^/homepage/sections/(\d+)$#', $path, $m)) {
            $body = Http::readJsonBody();
            $section = $body['section'] ?? $body;
            if (!is_array($section)) {
                Http::json(['error' => 'Invalid payload'], 400);
            }
            $status = isset($body['status']) ? (string) $body['status'] : null;
            $adminTitle = array_key_exists('adminTitle', $body) ? (string) $body['adminTitle'] : null;
            $repo->updateHomepageSectionRow((int) $m[1], $section, $status, $adminTitle);
            Http::json(['success' => true]);
        }

        if ($method === 'POST' && preg_match('#^/homepage/sections/(\d+)/restore$#', $path, $m)) {
            $body = Http::readJsonBody();
            $status = (string) ($body['status'] ?? 'draft');
            $repo->restoreHomepageSectionRow((int) $m[1], $status);
            Http::json(['success' => true]);
        }

        if ($method === 'DELETE' && preg_match('#^/homepage/sections/(\d+)$#', $path, $m)) {
            $permanent = isset($_GET['permanent']) && $_GET['permanent'] === '1';
            if ($permanent) {
                $repo->deleteHomepageSectionRowPermanent((int) $m[1]);
            } else {
                $repo->deleteHomepageSectionRow((int) $m[1]);
            }
            Http::json(['success' => true]);
        }

        if ($method === 'PUT' && $path === '/homepage/sections') {
            $body = Http::readJsonBody();
            $pageId = (int) ($body['pageId'] ?? $repo->getHomepagePageId());
            $sections = $body['sections'] ?? [];
            if (!$pageId || !is_array($sections)) {
                Http::json(['error' => 'Invalid payload'], 400);
            }
            $repo->saveHomepageSections($pageId, $sections);
            Http::json(['success' => true, 'count' => count($sections)]);
        }

        // Pages
        if ($method === 'GET' && $path === '/pages/list') {
            Http::json($repo->listPagesAdmin($pageNum, $perPage, true, $listQ['search'], $listQ['sort'], $listQ['order']));
        }

        if ($method === 'GET' && $path === '/pages') {
            Http::json($repo->listPagesAdmin(1, 100, false)['items']);
        }

        if ($method === 'GET' && preg_match('#^/pages/(\d+)$#', $path, $m)) {
            $page = $repo->getPageAdminDetail((int) $m[1]);
            Http::json($page ?: ['error' => 'Not found'], $page ? 200 : 404);
        }

        if ($method === 'PUT' && preg_match('#^/pages/(\d+)$#', $path, $m)) {
            $repo->savePage((int) $m[1], Http::readJsonBody());
            Http::json(['success' => true]);
        }

        if ($method === 'PUT' && preg_match('#^/pages/(\d+)/display-mode$#', $path, $m)) {
            $body = Http::readJsonBody();
            $mode = (string) ($body['display_mode'] ?? $body['mode'] ?? 'classic');
            try {
                $repo->setDisplayModeForEntity('page', (int) $m[1], $mode);
                Http::json(['success' => true, 'display_mode' => $mode === 'elementor' ? 'elementor' : 'classic']);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'POST' && $path === '/pages') {
            $body = Http::readJsonBody();
            if (empty($body['title'])) {
                Http::json(['error' => 'Title is required'], 400);
            }
            $id = $repo->createPage($body);
            Http::json(['success' => true, 'id' => $id]);
        }

        // Landings
        if ($method === 'GET' && $path === '/landings/list') {
            Http::json($repo->listLandingsAdmin($pageNum, $perPage, $listQ['search'], $listQ['sort'], $listQ['order']));
        }

        if ($method === 'GET' && $path === '/landings') {
            Http::json($repo->getAllLandingsAdmin());
        }

        if ($method === 'GET' && preg_match('#^/landings/(\d+)$#', $path, $m)) {
            $row = $repo->getLandingAdminDetail((int) $m[1]);
            Http::json($row ?: ['error' => 'Not found'], $row ? 200 : 404);
        }

        if ($method === 'PUT' && preg_match('#^/landings/(\d+)$#', $path, $m)) {
            $repo->saveLanding((int) $m[1], Http::readJsonBody());
            Http::json(['success' => true]);
        }

        if ($method === 'PUT' && preg_match('#^/landings/(\d+)/display-mode$#', $path, $m)) {
            $body = Http::readJsonBody();
            $mode = (string) ($body['display_mode'] ?? $body['mode'] ?? 'classic');
            try {
                $repo->setDisplayModeForEntity('service_landing', (int) $m[1], $mode);
                Http::json(['success' => true, 'display_mode' => $mode === 'elementor' ? 'elementor' : 'classic']);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'POST' && $path === '/landings') {
            $body = Http::readJsonBody();
            if (empty($body['service_name'])) {
                Http::json(['error' => 'Service name is required'], 400);
            }
            $id = $repo->createLanding($body);
            Http::json(['success' => true, 'id' => $id]);
        }

        // Blog
        if ($method === 'GET' && $path === '/blog/list') {
            Http::json($repo->listBlogPostsAdmin($pageNum, $perPage, $listQ['search'], $listQ['sort'], $listQ['order']));
        }

        if ($method === 'GET' && preg_match('#^/blog/(\d+)$#', $path, $m)) {
            $post = $repo->getBlogPostAdminDetail((int) $m[1]);
            Http::json($post ?: ['error' => 'Not found'], $post ? 200 : 404);
        }

        if ($method === 'PUT' && preg_match('#^/blog/(\d+)$#', $path, $m)) {
            $repo->saveBlogPost((int) $m[1], Http::readJsonBody());
            Http::json(['success' => true]);
        }

        if ($method === 'PUT' && preg_match('#^/blog/(\d+)/display-mode$#', $path, $m)) {
            $body = Http::readJsonBody();
            $mode = (string) ($body['display_mode'] ?? $body['mode'] ?? 'classic');
            try {
                $repo->setDisplayModeForEntity('blog_post', (int) $m[1], $mode);
                Http::json(['success' => true, 'display_mode' => $mode === 'elementor' ? 'elementor' : 'classic']);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'POST' && $path === '/blog') {
            $body = Http::readJsonBody();
            if (empty($body['title'])) {
                Http::json(['error' => 'Title is required'], 400);
            }
            $id = $repo->createBlogPost($body);
            Http::json(['success' => true, 'id' => $id]);
        }

        // Portfolio (local clients)
        if ($method === 'GET' && $path === '/portfolio/list') {
            Http::json($repo->listPortfolioAdmin($pageNum, $perPage, $listQ['search'], $listQ['sort'], $listQ['order']));
        }

        if ($method === 'GET' && preg_match('#^/portfolio/(\d+)$#', $path, $m)) {
            $row = $repo->getPortfolioItemById((int) $m[1]);
            Http::json($row ?: ['error' => 'Not found'], $row ? 200 : 404);
        }

        if ($method === 'POST' && $path === '/portfolio') {
            $body = Http::readJsonBody();
            if (empty($body['title']) && empty($body['client_name'])) {
                Http::json(['error' => 'Client or project title is required'], 400);
            }
            $id = $repo->createPortfolioItem($body);
            Http::json(['success' => true, 'id' => $id]);
        }

        if ($method === 'PUT' && preg_match('#^/portfolio/(\d+)$#', $path, $m)) {
            $repo->savePortfolioItem((int) $m[1], Http::readJsonBody());
            Http::json(['success' => true]);
        }

        if ($method === 'DELETE' && preg_match('#^/portfolio/(\d+)$#', $path, $m)) {
            $repo->deletePortfolioItem((int) $m[1]);
            Http::json(['success' => true]);
        }

        // Services
        if ($method === 'GET' && $path === '/services/list') {
            Http::json($repo->listServicesAdmin($pageNum, $perPage, $listQ['search'], $listQ['sort'], $listQ['order']));
        }

        if ($method === 'GET' && $path === '/services') {
            Http::json($repo->getAllServicesAdmin());
        }

        if ($method === 'GET' && preg_match('#^/services/(\d+)$#', $path, $m)) {
            $row = $repo->getServiceAdminDetail((int) $m[1]);
            Http::json($row ?: ['error' => 'Not found'], $row ? 200 : 404);
        }

        if ($method === 'PUT' && preg_match('#^/services/(\d+)$#', $path, $m)) {
            $repo->saveService((int) $m[1], Http::readJsonBody());
            Http::json(['success' => true]);
        }

        if ($method === 'PUT' && preg_match('#^/services/(\d+)/display-mode$#', $path, $m)) {
            $body = Http::readJsonBody();
            $mode = (string) ($body['display_mode'] ?? $body['mode'] ?? 'classic');
            try {
                $repo->setDisplayModeForEntity('service', (int) $m[1], $mode);
                Http::json(['success' => true, 'display_mode' => $mode === 'elementor' ? 'elementor' : 'classic']);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'POST' && $path === '/services') {
            $body = Http::readJsonBody();
            if (empty($body['title'])) {
                Http::json(['error' => 'Title is required'], 400);
            }
            $id = $repo->createService($body);
            Http::json(['success' => true, 'id' => $id]);
        }

        // Settings
        if ($method === 'GET' && $path === '/settings') {
            Http::json($repo->getSiteSettings());
        }

        if ($method === 'PUT' && $path === '/settings') {
            $repo->saveSiteSettings(Http::readJsonBody());
            Http::json(['success' => true]);
        }

        if ($method === 'POST' && $path === '/gmb/sync') {
            try {
                $settings = $repo->syncGmbFromGoogle();
                Http::json([
                    'success'  => true,
                    'payload'  => $repo->getGmbPublicPayload(),
                    'settings' => [
                        'gmbPlaceId'         => $settings['gmbPlaceId'] ?? '',
                        'gmbReviewsCachedAt' => $settings['gmbReviewsCachedAt'] ?? '',
                        'gmbRating'          => $settings['gmbRating'] ?? '',
                        'gmbReviewCount'     => $settings['gmbReviewCount'] ?? '',
                    ],
                ]);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        // Menus
        if ($method === 'GET' && $path === '/menus/list') {
            $menus = $repo->getMenus();
            Http::json([
                ['key' => 'primary', 'label' => 'Primary Menu', 'count' => count($menus['primary'] ?? [])],
                ['key' => 'footer', 'label' => 'Footer Company', 'count' => count($menus['footer'] ?? [])],
                ['key' => 'footerServices', 'label' => 'Footer Services', 'count' => count($menus['footerServices'] ?? [])],
                ['key' => 'footerProducts', 'label' => 'Footer Products', 'count' => count($menus['footerProducts'] ?? [])],
            ]);
        }

        if ($method === 'GET' && $path === '/menus') {
            Http::json($repo->getMenus());
        }

        if ($method === 'GET' && preg_match('#^/menus/([a-zA-Z_]+)$#', $path, $m)) {
            $key = $m[1];
            $map = [
                'primary' => 'primary',
                'footer' => 'footer',
                'footerServices' => 'footerServices',
                'footerProducts' => 'footerProducts',
            ];
            if (!isset($map[$key])) {
                Http::json(['error' => 'Unknown menu'], 404);
            }
            $all = $repo->getMenus();
            Http::json(['key' => $key, 'items' => $all[$map[$key]] ?? []]);
        }

        if ($method === 'PUT' && preg_match('#^/menus/([a-zA-Z_]+)$#', $path, $m)) {
            $key = $m[1];
            $map = [
                'primary' => 'primary',
                'footer' => 'footer',
                'footerServices' => 'footer_services',
                'footerProducts' => 'footer_products',
            ];
            if (!isset($map[$key])) {
                Http::json(['error' => 'Unknown menu'], 404);
            }
            $body = Http::readJsonBody();
            $items = $body['items'] ?? $body;
            $repo->saveMenu($map[$key], is_array($items) ? $items : []);
            Http::json(['success' => true]);
        }

        if ($method === 'PUT' && $path === '/menus') {
            $body = Http::readJsonBody();
            $map = [
                'primary' => 'primary',
                'footer' => 'footer',
                'footerServices' => 'footer_services',
                'footerProducts' => 'footer_products',
                'footer_services' => 'footer_services',
                'footer_products' => 'footer_products',
            ];
            foreach ($body as $key => $items) {
                if (is_array($items) && isset($map[$key])) {
                    $repo->saveMenu($map[$key], $items);
                }
            }
            Http::json(['success' => true]);
        }

        if ($method === 'GET' && $path === '/pricing') {
            Http::json($repo->getPricingOptions());
        }

        if ($method === 'PUT' && $path === '/pricing') {
            $repo->savePricingOptions(Http::readJsonBody());
            Http::json(['success' => true]);
        }

        if ($method === 'GET' && $path === '/forms/list') {
            Http::json($repo->listFormSubmissionsAdmin($pageNum, $perPage, $listQ['search'], $listQ['sort'], $listQ['order']));
        }

        if ($method === 'GET' && $path === '/forms') {
            Http::json($repo->getFormSubmissions(100));
        }

        $media = cws_media();
        $mediaRepo = cws_media_repo();

        if ($method === 'GET' && $path === '/media/list') {
            $type = (string) ($_GET['type'] ?? 'all');
            $mPage = max(1, (int) ($_GET['page'] ?? 1));
            $mPer = min(48, max(12, (int) ($_GET['perPage'] ?? 24)));
            Http::json($mediaRepo->listMedia(
                $mPage,
                $mPer,
                $type,
                $listQ['search'],
                $listQ['sort'],
                $listQ['order']
            ));
        }

        if ($method === 'GET' && preg_match('#^/media/(\d+)$#', $path, $m)) {
            $row = $mediaRepo->getById((int) $m[1]);
            Http::json($row ?: ['error' => 'Not found'], $row ? 200 : 404);
        }

        if ($method === 'POST' && $path === '/media/upload') {
            if (empty($_FILES['file'])) {
                Http::json(['error' => 'No file uploaded'], 400);
            }
            try {
                $meta = [
                    'title'    => $_POST['title'] ?? '',
                    'alt_text' => $_POST['alt_text'] ?? $_POST['altText'] ?? '',
                ];
                Http::json(['success' => true, 'item' => $media->upload($_FILES['file'], $meta)]);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'PUT' && preg_match('#^/media/(\d+)$#', $path, $m)) {
            try {
                Http::json([
                    'success' => true,
                    'item'    => $media->updateMeta((int) $m[1], Http::readJsonBody()),
                ]);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'POST' && preg_match('#^/media/(\d+)/crop$#', $path, $m)) {
            try {
                Http::json([
                    'success' => true,
                    'item'    => $media->crop((int) $m[1], Http::readJsonBody()),
                ]);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'DELETE' && preg_match('#^/media/(\d+)$#', $path, $m)) {
            $media->delete((int) $m[1]);
            Http::json(['success' => true]);
        }

        $dsmt = cws_desimentor();

        if ($method === 'GET' && preg_match('#^/desimentor/([a-z_]+)/(\d+)$#', $path, $m)) {
            $doc = $dsmt->getDocument($m[1], (int) $m[2], true);
            Http::json([
                'document'      => $doc,
                'empty'         => $dsmt->emptyDocument(),
                'previewToken'  => $dsmt->createPreviewToken($m[1], (int) $m[2]),
            ]);
        }

        if ($method === 'PUT' && preg_match('#^/desimentor/([a-z_]+)/(\d+)$#', $path, $m)) {
            $body = Http::readJsonBody();
            $content = $body['content'] ?? $dsmt->emptyDocument();
            $status = ($body['status'] ?? 'draft') === 'published' ? 'published' : 'draft';
            try {
                Http::json([
                    'success'  => true,
                    'document' => $dsmt->saveDocument($m[1], (int) $m[2], $content, $status),
                ]);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'POST' && preg_match('#^/desimentor/([a-z_]+)/(\d+)/publish$#', $path, $m)) {
            try {
                $body = Http::readJsonBody();
                $document = $dsmt->publish($m[1], (int) $m[2]);
                $useOnSite = !array_key_exists('useOnSite', $body) || !empty($body['useOnSite']);
                if ($useOnSite) {
                    $repo->setDisplayModeForEntity($m[1], (int) $m[2], 'elementor');
                }
                Http::json([
                    'success'       => true,
                    'document'      => $document,
                    'display_mode'  => $useOnSite ? 'elementor' : null,
                ]);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'GET' && $path === '/desimentor/preview') {
            $token = (string) ($_GET['token'] ?? '');
            $verified = $dsmt->verifyPreviewToken($token);
            if (!$verified) {
                Http::json(['error' => 'Invalid preview token'], 403);
            }
            $doc = $dsmt->getDocument($verified['entityType'], $verified['entityId'], true);
            Http::json(['content' => $doc['content'] ?? $dsmt->emptyDocument()]);
        }

        if ($method === 'GET' && $path === '/desimentor/templates') {
            $cat = (string) ($_GET['category'] ?? 'all');
            Http::json(['items' => $dsmt->listTemplates($cat)]);
        }

        if ($method === 'GET' && preg_match('#^/desimentor/templates/(\d+)$#', $path, $m)) {
            $tpl = $dsmt->getTemplate((int) $m[1]);
            Http::json($tpl ?: ['error' => 'Not found'], $tpl ? 200 : 404);
        }

        if ($method === 'POST' && $path === '/desimentor/templates') {
            try {
                Http::json(['success' => true, 'template' => $dsmt->saveTemplate(Http::readJsonBody())]);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'PUT' && preg_match('#^/desimentor/templates/(\d+)$#', $path, $m)) {
            try {
                Http::json(['success' => true, 'template' => $dsmt->saveTemplate(Http::readJsonBody(), (int) $m[1])]);
            } catch (Throwable $e) {
                Http::json(['error' => $e->getMessage()], 400);
            }
        }

        if ($method === 'DELETE' && preg_match('#^/desimentor/templates/(\d+)$#', $path, $m)) {
            $dsmt->deleteTemplate((int) $m[1]);
            Http::json(['success' => true]);
        }

        Http::json(['error' => 'Admin route not found', 'path' => $path], 404);
    }
}
