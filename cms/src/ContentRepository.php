<?php

declare(strict_types=1);

final class ContentRepository
{
    public function __construct(private PDO $db) {}

    public function getSiteSettings(): array
    {
        $row = $this->db->query('SELECT payload FROM site_settings WHERE id = 1')->fetch();
        if (!$row) {
            return $this->defaultSettings();
        }
        return $this->decodeJson($row['payload']) ?: $this->defaultSettings();
    }

    public function saveSiteSettings(array $data): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO site_settings (id, payload) VALUES (1, :p)
             ON DUPLICATE KEY UPDATE payload = :p2'
        );
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        $stmt->execute([':p' => $json, ':p2' => $json]);
    }

    public function getMenus(): array
    {
        $map = [
            'primary'         => 'primary',
            'footer'          => 'footer',
            'footer_services' => 'footerServices',
            'footer_products' => 'footerProducts',
        ];
        $out = [
            'primary'         => [],
            'footer'          => [],
            'footerServices'  => [],
            'footerProducts'  => [],
        ];
        $stmt = $this->db->query('SELECT menu_key, payload FROM menus');
        while ($row = $stmt->fetch()) {
            $key = $map[$row['menu_key']] ?? null;
            if ($key) {
                $out[$key] = $this->decodeJson($row['payload']) ?? [];
            }
        }
        return $out;
    }

    public function saveMenu(string $menuKey, array $items): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO menus (menu_key, payload) VALUES (:k, :p)
             ON DUPLICATE KEY UPDATE payload = :p2'
        );
        $json = json_encode($items, JSON_UNESCAPED_UNICODE);
        $stmt->execute([':k' => $menuKey, ':p' => $json, ':p2' => $json]);
    }

    public function getPricingOptions(): array
    {
        $row = $this->db->query('SELECT payload FROM pricing_options WHERE id = 1')->fetch();
        $stored = $row ? ($this->decodeJson($row['payload']) ?: []) : [];
        $rules = $stored['serviceGroupRules'] ?? [];
        $data = array_merge([
            'bundles'            => [],
            'budgetRanges'       => [],
            'timelines'          => [],
            'serviceGroupRules'  => [],
        ], $stored);
        $data['serviceGroups'] = $this->buildPricingServiceGroups(is_array($rules) ? $rules : []);
        return $data;
    }

    public function savePricingOptions(array $data): void
    {
        unset($data['serviceGroups']);
        $stmt = $this->db->prepare(
            'INSERT INTO pricing_options (id, payload) VALUES (1, :p)
             ON DUPLICATE KEY UPDATE payload = :p2'
        );
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        $stmt->execute([':p' => $json, ':p2' => $json]);
    }

    private function pricingGroupForSlug(string $slug, array $rules): string
    {
        foreach ($rules as $rule) {
            $group = (string) ($rule['group'] ?? '');
            foreach ($rule['patterns'] ?? [] as $pattern) {
                $pattern = (string) $pattern;
                if ($pattern !== '' && str_contains($slug, $pattern)) {
                    return $group !== '' ? $group : 'Services';
                }
            }
        }
        return 'More services';
    }

    private function buildPricingServiceGroups(array $rules): array
    {
        if (!$rules) {
            $rules = [
                ['group' => 'Websites & Online Stores', 'patterns' => ['website-development', 'wordpress', 'ecommerce']],
                ['group' => 'Marketing & Visibility', 'patterns' => ['digital-marketing', 'seo-services', 'ppc-services']],
                ['group' => 'Apps & Custom Software', 'patterns' => ['mobile-app', 'custom-software', 'crm-development']],
            ];
        }

        $bucket = [];
        foreach ($rules as $rule) {
            $g = (string) ($rule['group'] ?? 'Services');
            if (!isset($bucket[$g])) {
                $bucket[$g] = [];
            }
        }
        $bucket['More services'] = $bucket['More services'] ?? [];

        $add = function (string $slug, string $label, string $prefix) use (&$bucket, $rules): void {
            $group = $this->pricingGroupForSlug($slug, $rules);
            if (!isset($bucket[$group])) {
                $bucket[$group] = [];
            }
            $bucket[$group][] = ['value' => $prefix . ':' . $slug, 'label' => $label];
        };

        $landings = $this->db->query(
            "SELECT slug, service_name FROM service_landings WHERE status = 'published' ORDER BY service_name ASC"
        )->fetchAll();
        foreach ($landings as $row) {
            $add((string) $row['slug'], (string) $row['service_name'], 'landing');
        }

        $services = $this->db->query(
            "SELECT slug, title, hero_title FROM services WHERE status = 'published' ORDER BY title ASC"
        )->fetchAll();
        foreach ($services as $row) {
            $label = (string) (($row['hero_title'] ?? '') ?: $row['title']);
            $add((string) $row['slug'], $label, 'service');
        }

        $out = [];
        foreach ($bucket as $label => $options) {
            if (!$options) {
                continue;
            }
            usort($options, fn ($a, $b) => strcmp($a['label'], $b['label']));
            $out[] = ['label' => $label, 'options' => $options];
        }
        return $out;
    }

    public function getHomepage(): ?array
    {
        $page = $this->db->query(
            "SELECT * FROM pages WHERE is_homepage = 1 AND status = 'published' LIMIT 1"
        )->fetch();
        if (!$page) {
            $page = $this->db->query(
                "SELECT * FROM pages WHERE slug = 'home' AND status = 'published' LIMIT 1"
            )->fetch();
        }
        return $page ? $this->mapPage($page, true) : null;
    }

    public function getPageBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM pages WHERE slug = :slug AND status = 'published' LIMIT 1"
        );
        $stmt->execute([':slug' => $slug]);
        $page = $stmt->fetch();
        return $page ? $this->mapPage($page, (bool) $page['is_homepage']) : null;
    }

    public function getAllPages(): array
    {
        return $this->db->query('SELECT id, slug, title, template, is_homepage, status, updated_at FROM pages ORDER BY title')->fetchAll();
    }

    public function getPageById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM pages WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $page = $stmt->fetch();
        return $page ?: null;
    }

    public function getPageAdminDetail(int $id): ?array
    {
        $row = $this->getPageById($id);
        if (!$row) {
            return null;
        }
        $entityType = !empty($row['is_homepage']) ? 'homepage' : 'page';
        return $this->enrichAdminEntityRow($row, 'pages', $entityType, $id);
    }

    public function getServiceAdminDetail(int $id): ?array
    {
        $row = $this->getServiceById($id);
        return $row ? $this->enrichAdminEntityRow($row, 'services', 'service', $id) : null;
    }

    public function getLandingAdminDetail(int $id): ?array
    {
        $row = $this->getLandingById($id);
        return $row ? $this->enrichAdminEntityRow($row, 'service_landings', 'service_landing', $id) : null;
    }

    public function setDisplayModeForEntity(string $entityType, int $entityId, string $mode): void
    {
        $mode = $this->normalizeDisplayMode($mode);
        $table = match ($entityType) {
            'page', 'homepage' => 'pages',
            'service' => 'services',
            'service_landing' => 'service_landings',
            'blog_post' => 'blog_posts',
            default => throw new InvalidArgumentException('Unknown entity type'),
        };
        if (!$this->tableHasDisplayMode($table)) {
            throw new RuntimeException(
                'display_mode column missing. Run: php cms/scripts/migrate-008.php'
                . ($entityType === 'blog_post' ? ' and php cms/scripts/migrate-009.php' : '')
            );
        }
        $stmt = $this->db->prepare("UPDATE {$table} SET display_mode = :m WHERE id = :id");
        $stmt->execute([':m' => $mode, ':id' => $entityId]);
    }

    private function enrichAdminEntityRow(array $row, string $table, string $entityType, int $entityId): array
    {
        $row['display_mode'] = $this->rowDisplayMode($row, $table);
        if (function_exists('cws_desimentor')) {
            $row['desimentor_meta'] = cws_desimentor()->getAdminMeta($entityType, $entityId);
        } else {
            $row['desimentor_meta'] = [
                'hasDocument'  => false,
                'status'       => null,
                'sectionCount' => 0,
                'revision'     => 0,
            ];
        }
        return $row;
    }

    private function normalizeDisplayMode(string $mode): string
    {
        return $mode === 'elementor' ? 'elementor' : 'classic';
    }

    private function rowDisplayMode(array $row, string $table): string
    {
        if (!$this->tableHasDisplayMode($table)) {
            return 'classic';
        }
        return $this->normalizeDisplayMode((string) ($row['display_mode'] ?? 'classic'));
    }

    private function tableHasDisplayMode(string $table): bool
    {
        static $cache = [];
        if (isset($cache[$table])) {
            return $cache[$table];
        }
        $allowed = ['pages', 'services', 'service_landings', 'blog_posts'];
        if (!in_array($table, $allowed, true)) {
            return $cache[$table] = false;
        }
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) AS c FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t AND COLUMN_NAME = :c'
        );
        $stmt->execute([':t' => $table, ':c' => 'display_mode']);
        $cache[$table] = (int) ($stmt->fetch()['c'] ?? 0) > 0;
        return $cache[$table];
    }

    public function savePage(int $id, array $data): void
    {
        $row = $this->getPageById($id);
        $slug = $row ? (string) $row['slug'] : '';
        if (!empty($data['slug']) && $row && !(int) $row['is_homepage']) {
            $slug = $this->uniqueSlug('pages', $this->sanitizeSlug((string) $data['slug']), $id);
        }
        $extra = $this->pagesSeoColumnsExist();
        $sql = 'UPDATE pages SET slug = :slug, title = :t, content_html = :c, template = :tpl,
             seo_title = :st, seo_description = :sd, seo_keywords = :sk, status = :status';
        if ($extra) {
            $sql .= ', seo_canonical = :sc, seo_og_image = :so, seo_robots = :sr, seo_focus_keyword = :sf';
        }
        $sql .= ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        $params = [
            ':slug'   => $slug,
            ':t'      => $data['title'],
            ':c'      => $data['content_html'] ?? '',
            ':tpl'    => $data['template'] ?? 'default',
            ':st'     => $data['seo_title'] ?? '',
            ':sd'     => $data['seo_description'] ?? '',
            ':sk'     => $data['seo_keywords'] ?? '',
            ':status' => $data['status'] ?? 'published',
            ':id'     => $id,
        ];
        if ($extra) {
            $params[':sc'] = $data['seo_canonical'] ?? '';
            $params[':so'] = $data['seo_og_image'] ?? '';
            $params[':sr'] = $data['seo_robots'] ?? 'index';
            $params[':sf'] = $data['seo_focus_keyword'] ?? '';
        }
        $stmt->execute($params);
        if ($this->tableHasDisplayMode('pages') && array_key_exists('display_mode', $data)) {
            $dm = $this->db->prepare('UPDATE pages SET display_mode = :dm WHERE id = :id');
            $dm->execute([
                ':dm' => $this->normalizeDisplayMode((string) $data['display_mode']),
                ':id' => $id,
            ]);
        }
    }

    public function createPage(array $data): int
    {
        $slug = $this->uniqueSlug('pages', $this->sanitizeSlug((string) ($data['slug'] ?? $data['title'] ?? 'page')));
        if ($slug === 'home') {
            $slug = $this->uniqueSlug('pages', 'page');
        }
        $stmt = $this->db->prepare(
            'INSERT INTO pages (slug, title, content_html, template, seo_title, seo_description, seo_keywords, status, is_homepage)
             VALUES (:slug, :t, :c, :tpl, :st, :sd, :sk, :status, 0)'
        );
        $stmt->execute([
            ':slug'   => $slug,
            ':t'      => $data['title'] ?? 'New page',
            ':c'      => $data['content_html'] ?? '',
            ':tpl'    => $data['template'] ?? 'default',
            ':st'     => $data['seo_title'] ?? '',
            ':sd'     => $data['seo_description'] ?? '',
            ':sk'     => $data['seo_keywords'] ?? '',
            ':status' => $data['status'] ?? 'draft',
        ]);
        $newId = (int) $this->db->lastInsertId();
        if (function_exists('cws_desimentor')) {
            try {
                cws_desimentor()->ensureDocument('page', $newId);
            } catch (Throwable) {
                /* optional until migration 007 */
            }
        }
        return $newId;
    }

    public function createBlogPost(array $data): int
    {
        $slug = $this->uniqueSlug('blog_posts', $this->sanitizeSlug((string) ($data['slug'] ?? $data['title'] ?? 'post')));
        if ($this->blogMetaColumnsExist()) {
            $stmt = $this->db->prepare(
                'INSERT INTO blog_posts (slug, title, excerpt, content_html, featured_image, published_date, categories, is_featured, seo, status)
                 VALUES (:slug, :t, :ex, :c, :img, :pd, :cats, :feat, :seo, :st)'
            );
            $stmt->execute([
                ':slug' => $slug,
                ':t'    => $data['title'] ?? 'New post',
                ':ex'   => $data['excerpt'] ?? '',
                ':c'    => $data['content_html'] ?? '',
                ':img'  => $data['featured_image'] ?? '',
                ':pd'   => $data['published_date'] ?? date('Y-m-d'),
                ':cats' => json_encode($this->normalizeBlogCategories($data['categories'] ?? []), JSON_UNESCAPED_UNICODE),
                ':feat' => !empty($data['is_featured']) ? 1 : 0,
                ':seo'  => json_encode($data['seo'] ?? [], JSON_UNESCAPED_UNICODE),
                ':st'   => $data['status'] ?? 'draft',
            ]);
        } else {
            $stmt = $this->db->prepare(
                'INSERT INTO blog_posts (slug, title, excerpt, content_html, featured_image, published_date, seo, status)
                 VALUES (:slug, :t, :ex, :c, :img, :pd, :seo, :st)'
            );
            $stmt->execute([
                ':slug' => $slug,
                ':t'    => $data['title'] ?? 'New post',
                ':ex'   => $data['excerpt'] ?? '',
                ':c'    => $data['content_html'] ?? '',
                ':img'  => $data['featured_image'] ?? '',
                ':pd'   => $data['published_date'] ?? date('Y-m-d'),
                ':seo'  => json_encode($data['seo'] ?? [], JSON_UNESCAPED_UNICODE),
                ':st'   => $data['status'] ?? 'draft',
            ]);
        }
        return (int) $this->db->lastInsertId();
    }

    public function createLanding(array $data): int
    {
        $slug = $this->uniqueSlug('service_landings', $this->sanitizeSlug((string) ($data['slug'] ?? $data['service_name'] ?? 'service')));
        $stmt = $this->db->prepare(
            'INSERT INTO service_landings (slug, service_name, page_title, page_description, page_keywords, intro,
             benefits, deliverables, faq, related_slugs, theme, seo_body_html, status)
             VALUES (:slug, :sn, :pt, :pd, :pk, :intro, :b, :d, :f, :r, :t, :seo, :status)'
        );
        $stmt->execute([
            ':slug'   => $slug,
            ':sn'     => $data['service_name'] ?? 'New service',
            ':pt'     => $data['page_title'] ?? $data['service_name'] ?? '',
            ':pd'     => $data['page_description'] ?? '',
            ':pk'     => $data['page_keywords'] ?? '',
            ':intro'  => $data['intro'] ?? '',
            ':b'      => json_encode($data['benefits'] ?? [], JSON_UNESCAPED_UNICODE),
            ':d'      => json_encode($data['deliverables'] ?? [], JSON_UNESCAPED_UNICODE),
            ':f'      => json_encode($data['faq'] ?? [], JSON_UNESCAPED_UNICODE),
            ':r'      => json_encode($data['related_slugs'] ?? [], JSON_UNESCAPED_UNICODE),
            ':t'      => json_encode($data['theme'] ?? [], JSON_UNESCAPED_UNICODE),
            ':seo'    => $data['seo_body_html'] ?? '',
            ':status' => $data['status'] ?? 'draft',
        ]);
        $newId = (int) $this->db->lastInsertId();
        if (function_exists('cws_desimentor')) {
            try {
                cws_desimentor()->ensureDocument('service_landing', $newId);
            } catch (Throwable) {
            }
        }
        return $newId;
    }

    public function getHomepageSections(int $pageId): array
    {
        $statusWhere = $this->homepageSectionHasStatusColumn() ? " AND status = 'published'" : '';
        $stmt = $this->db->prepare(
            "SELECT layout, payload FROM homepage_sections WHERE page_id = :id{$statusWhere} ORDER BY sort_order ASC"
        );
        $stmt->execute([':id' => $pageId]);
        $sections = [];
        while ($row = $stmt->fetch()) {
            $payload = $this->decodeJson($row['payload']) ?? [];
            if (!isset($payload['acfFcLayout'])) {
                $payload['acfFcLayout'] = $row['layout'] === 'seo_rich_content' ? 'seo_rich' : $row['layout'];
            }
            $sections[] = $payload;
        }
        return $sections;
    }

    public function saveHomepageSections(int $pageId, array $sections): void
    {
        $this->db->prepare('DELETE FROM homepage_sections WHERE page_id = :id')->execute([':id' => $pageId]);
        $stmt = $this->db->prepare(
            'INSERT INTO homepage_sections (page_id, sort_order, layout, payload) VALUES (:pid, :ord, :lay, :payload)'
        );
        foreach ($sections as $i => $section) {
            $layout = $section['acfFcLayout'] ?? 'unknown';
            if ($layout === 'seo_rich') {
                $layout = 'seo_rich_content';
            }
            $stmt->execute([
                ':pid'     => $pageId,
                ':ord'     => $i,
                ':lay'     => $layout,
                ':payload' => json_encode($section, JSON_UNESCAPED_UNICODE),
            ]);
        }
    }

    public function getHomepagePageId(): int
    {
        $home = $this->db->query('SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1')->fetch();
        return $home ? (int) $home['id'] : 0;
    }

    private function normalizeSectionLayout(string $layout): string
    {
        return $layout === 'seo_rich' ? 'seo_rich_content' : $layout;
    }

    public function listHomepageSectionRows(
        int $pageId,
        int $page = 1,
        int $perPage = 10,
        string $statusFilter = 'all',
        string $search = '',
        string $sort = '',
        string $order = 'asc'
    ): array {
        $offset = max(0, ($page - 1) * $perPage);
        $where = 'WHERE page_id = :id';
        $params = [':id' => $pageId];
        if ($this->homepageSectionHasStatusColumn() && $statusFilter !== 'all') {
            $allowed = ['published', 'draft', 'trash'];
            if (in_array($statusFilter, $allowed, true)) {
                $where .= ' AND status = :st';
                $params[':st'] = $statusFilter;
            }
        }
        if ($search !== '') {
            $where .= ' AND (admin_title LIKE :adm_search OR layout LIKE :adm_search OR payload LIKE :adm_search OR CAST(sort_order AS CHAR) LIKE :adm_search)';
            $params[':adm_search'] = '%' . $search . '%';
        }

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM homepage_sections {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);

        $sortCol = AdminListQuery::sortColumn(
            $sort,
            ['sort_order', 'layout', 'status', 'admin_title', 'updated_at'],
            'sort_order'
        );
        $orderSql = AdminListQuery::orderSql($order);

        $statusCols = $this->homepageSectionHasStatusColumn()
            ? ', status, admin_title, updated_at'
            : '';
        $stmt = $this->db->prepare(
            "SELECT id, sort_order, layout, payload{$statusCols} FROM homepage_sections {$where}
             ORDER BY {$sortCol} {$orderSql} LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $items = [];
        while ($row = $stmt->fetch()) {
            $payload = $this->decodeJson($row['payload']) ?? [];
            $layout = $payload['acfFcLayout'] ?? ($row['layout'] === 'seo_rich_content' ? 'seo_rich' : $row['layout']);
            $items[] = [
                'id'         => (int) $row['id'],
                'sortOrder'  => (int) $row['sort_order'],
                'layout'     => $layout,
                'title'      => $this->sectionListTitle($row, $payload, $layout),
                'status'     => (string) ($row['status'] ?? 'published'),
                'updated_at' => (string) ($row['updated_at'] ?? ''),
            ];
        }

        $counts = $this->homepageSectionStatusCounts($pageId);

        return [
            'items'      => $items,
            'total'      => $total,
            'page'       => $page,
            'perPage'    => $perPage,
            'pageId'     => $pageId,
            'status'     => $statusFilter,
            'counts'     => $counts,
        ];
    }

    public function getHomepageSectionRowById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM homepage_sections WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $payload = $this->decodeJson($row['payload']) ?? [];
        if (!isset($payload['acfFcLayout'])) {
            $payload['acfFcLayout'] = $row['layout'] === 'seo_rich_content' ? 'seo_rich' : $row['layout'];
        }
        return [
            'id'         => (int) $row['id'],
            'pageId'     => (int) $row['page_id'],
            'sortOrder'  => (int) $row['sort_order'],
            'status'     => (string) ($row['status'] ?? 'published'),
            'adminTitle' => (string) ($row['admin_title'] ?? ''),
            'section'    => $payload,
        ];
    }

    public function createHomepageSectionRow(int $pageId, array $section, string $status = 'draft', string $adminTitle = ''): int
    {
        $trashEx = $this->homepageSectionHasStatusColumn() ? " AND status != 'trash'" : '';
        $max = $this->db->prepare(
            "SELECT COALESCE(MAX(sort_order), -1) AS m FROM homepage_sections WHERE page_id = :id{$trashEx}"
        );
        $max->execute([':id' => $pageId]);
        $order = (int) ($max->fetch()['m'] ?? -1) + 1;
        $layout = $this->normalizeSectionLayout((string) ($section['acfFcLayout'] ?? 'cta'));
        $status = $this->normalizeSectionStatus($status);
        $adminTitle = $adminTitle !== '' ? $adminTitle : $this->sectionTitleFromPayload($section, $layout);

        if ($this->homepageSectionHasStatusColumn()) {
            $stmt = $this->db->prepare(
                'INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
                 VALUES (:pid, :ord, :lay, :st, :at, :payload)'
            );
            $stmt->execute([
                ':pid'     => $pageId,
                ':ord'     => $order,
                ':lay'     => $layout,
                ':st'      => $status,
                ':at'      => $adminTitle,
                ':payload' => json_encode($section, JSON_UNESCAPED_UNICODE),
            ]);
        } else {
            $stmt = $this->db->prepare(
                'INSERT INTO homepage_sections (page_id, sort_order, layout, payload) VALUES (:pid, :ord, :lay, :payload)'
            );
            $stmt->execute([
                ':pid'     => $pageId,
                ':ord'     => $order,
                ':lay'     => $layout,
                ':payload' => json_encode($section, JSON_UNESCAPED_UNICODE),
            ]);
        }
        return (int) $this->db->lastInsertId();
    }

    public function updateHomepageSectionRow(int $id, array $section, ?string $status = null, ?string $adminTitle = null): void
    {
        $layout = $this->normalizeSectionLayout((string) ($section['acfFcLayout'] ?? 'unknown'));
        if ($this->homepageSectionHasStatusColumn()) {
            $row = $this->getHomepageSectionRowById($id);
            $st = $status !== null ? $this->normalizeSectionStatus($status) : ($row['status'] ?? 'draft');
            $at = $adminTitle !== null ? $adminTitle : ($row['adminTitle'] ?? $this->sectionTitleFromPayload($section, $layout));
            $stmt = $this->db->prepare(
                'UPDATE homepage_sections SET layout = :lay, status = :st, admin_title = :at, payload = :payload WHERE id = :id'
            );
            $stmt->execute([
                ':lay'     => $layout,
                ':st'      => $st,
                ':at'      => $at,
                ':payload' => json_encode($section, JSON_UNESCAPED_UNICODE),
                ':id'      => $id,
            ]);
        } else {
            $stmt = $this->db->prepare(
                'UPDATE homepage_sections SET layout = :lay, payload = :payload WHERE id = :id'
            );
            $stmt->execute([
                ':lay'     => $layout,
                ':payload' => json_encode($section, JSON_UNESCAPED_UNICODE),
                ':id'      => $id,
            ]);
        }
    }

    public function trashHomepageSectionRow(int $id): void
    {
        if ($this->homepageSectionHasStatusColumn()) {
            $this->db->prepare("UPDATE homepage_sections SET status = 'trash' WHERE id = :id")->execute([':id' => $id]);
            $row = $this->getHomepageSectionRowById($id);
            if ($row) {
                $this->reindexHomepageSections((int) $row['pageId']);
            }
            return;
        }
        $this->deleteHomepageSectionRowPermanent($id);
    }

    public function restoreHomepageSectionRow(int $id, string $status = 'draft'): void
    {
        if (!$this->homepageSectionHasStatusColumn()) {
            return;
        }
        $st = $this->normalizeSectionStatus($status);
        if ($st === 'trash') {
            $st = 'draft';
        }
        $this->db->prepare('UPDATE homepage_sections SET status = :st WHERE id = :id')->execute([
            ':st' => $st,
            ':id' => $id,
        ]);
        $row = $this->getHomepageSectionRowById($id);
        if ($row) {
            $this->reindexHomepageSections((int) $row['pageId']);
        }
    }

    public function deleteHomepageSectionRow(int $id): void
    {
        $this->trashHomepageSectionRow($id);
    }

    public function deleteHomepageSectionRowPermanent(int $id): void
    {
        $row = $this->getHomepageSectionRowById($id);
        if (!$row) {
            return;
        }
        $pageId = (int) $row['pageId'];
        $this->db->prepare('DELETE FROM homepage_sections WHERE id = :id')->execute([':id' => $id]);
        $this->reindexHomepageSections($pageId);
    }

    private function reindexHomepageSections(int $pageId): void
    {
        $trash = $this->homepageSectionHasStatusColumn() ? " AND status != 'trash'" : '';
        $stmt = $this->db->prepare(
            "SELECT id FROM homepage_sections WHERE page_id = :id{$trash} ORDER BY sort_order ASC"
        );
        $stmt->execute([':id' => $pageId]);
        $upd = $this->db->prepare('UPDATE homepage_sections SET sort_order = :ord WHERE id = :id');
        $i = 0;
        while ($r = $stmt->fetch()) {
            $upd->execute([':ord' => $i++, ':id' => (int) $r['id']]);
        }
    }

    public function listPagesAdmin(
        int $page = 1,
        int $perPage = 10,
        bool $excludeHome = true,
        string $search = '',
        string $sort = '',
        string $order = 'desc'
    ): array {
        $where = $excludeHome ? 'WHERE is_homepage = 0' : 'WHERE 1=1';
        $params = [];
        $where .= AdminListQuery::searchWhere(
            ['title', 'slug', 'template', 'status', 'content_html', 'seo_title', 'seo_description'],
            $search,
            $params
        );
        $sortCol = AdminListQuery::sortColumn($sort, ['title', 'slug', 'template', 'status', 'updated_at'], 'updated_at');
        $orderSql = AdminListQuery::orderSql($order);

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM pages {$where}");
        $countStmt->execute($params);
        $count = (int) ($countStmt->fetch()['c'] ?? 0);
        $offset = max(0, ($page - 1) * $perPage);
        $stmt = $this->db->prepare(
            "SELECT id, slug, title, template, is_homepage, status, updated_at FROM pages {$where}
             ORDER BY {$sortCol} {$orderSql} LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return ['items' => $stmt->fetchAll(), 'total' => $count, 'page' => $page, 'perPage' => $perPage];
    }

    public function listLandingsAdmin(
        int $page = 1,
        int $perPage = 10,
        string $search = '',
        string $sort = '',
        string $order = 'asc'
    ): array {
        $where = 'WHERE 1=1';
        $params = [];
        $where .= AdminListQuery::searchWhere(
            ['service_name', 'slug', 'status', 'intro', 'page_title', 'page_description', 'seo_body_html'],
            $search,
            $params
        );
        $sortCol = AdminListQuery::sortColumn($sort, ['service_name', 'slug', 'status', 'updated_at'], 'service_name');
        $orderSql = AdminListQuery::orderSql($order);

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM service_landings {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);
        $offset = max(0, ($page - 1) * $perPage);
        $stmt = $this->db->prepare(
            "SELECT id, slug, service_name, status, updated_at FROM service_landings {$where}
             ORDER BY {$sortCol} {$orderSql} LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return ['items' => $stmt->fetchAll(), 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function listFormSubmissionsAdmin(
        int $page = 1,
        int $perPage = 20,
        string $search = '',
        string $sort = '',
        string $order = 'desc'
    ): array {
        $where = 'WHERE 1=1';
        $params = [];
        $where .= AdminListQuery::searchWhere(['form_type', 'payload'], $search, $params);
        $sortCol = AdminListQuery::sortColumn($sort, ['form_type', 'created_at', 'is_read'], 'created_at');
        $orderSql = AdminListQuery::orderSql($order);

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM form_submissions {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);
        $offset = max(0, ($page - 1) * $perPage);
        $stmt = $this->db->prepare(
            "SELECT id, form_type, payload, is_read, created_at FROM form_submissions {$where}
             ORDER BY {$sortCol} {$orderSql} LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return ['items' => $stmt->fetchAll(), 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function listBlogPostsAdmin(
        int $page = 1,
        int $perPage = 10,
        string $search = '',
        string $sort = '',
        string $order = 'desc'
    ): array {
        $where = 'WHERE 1=1';
        $params = [];
        $where .= AdminListQuery::searchWhere(
            ['title', 'slug', 'status', 'excerpt', 'content_html'],
            $search,
            $params
        );
        $sortCol = AdminListQuery::sortColumn(
            $sort,
            ['title', 'slug', 'status', 'published_date', 'updated_at'],
            'published_date'
        );
        $orderSql = AdminListQuery::orderSql($order);

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM blog_posts {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);
        $offset = max(0, ($page - 1) * $perPage);
        $stmt = $this->db->prepare(
            "SELECT id, slug, title, status, published_date, updated_at FROM blog_posts {$where}
             ORDER BY {$sortCol} {$orderSql} LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return ['items' => $stmt->fetchAll(), 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function getBlogPostById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM blog_posts WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function getBlogPostAdminDetail(int $id): ?array
    {
        $row = $this->getBlogPostById($id);
        return $row ? $this->enrichAdminEntityRow($row, 'blog_posts', 'blog_post', $id) : null;
    }

    public function saveBlogPost(int $id, array $data): void
    {
        $slug = $this->uniqueSlug(
            'blog_posts',
            $this->sanitizeSlug((string) ($data['slug'] ?? $data['title'] ?? 'post')),
            $id
        );
        if ($this->blogMetaColumnsExist()) {
            $stmt = $this->db->prepare(
                'UPDATE blog_posts SET title = :t, slug = :slug, excerpt = :ex, content_html = :c,
                 featured_image = :img, published_date = :pd, categories = :cats, is_featured = :feat,
                 seo = :seo, status = :st WHERE id = :id'
            );
            $stmt->execute([
                ':t'    => $data['title'],
                ':slug' => $slug,
                ':ex'   => $data['excerpt'] ?? '',
                ':c'    => $data['content_html'] ?? '',
                ':img'  => $data['featured_image'] ?? '',
                ':pd'   => $data['published_date'] ?? date('Y-m-d'),
                ':cats' => json_encode($this->normalizeBlogCategories($data['categories'] ?? []), JSON_UNESCAPED_UNICODE),
                ':feat' => !empty($data['is_featured']) ? 1 : 0,
                ':seo'  => json_encode($data['seo'] ?? [], JSON_UNESCAPED_UNICODE),
                ':st'   => $data['status'] ?? 'published',
                ':id'   => $id,
            ]);
        } else {
            $stmt = $this->db->prepare(
                'UPDATE blog_posts SET title = :t, slug = :slug, excerpt = :ex, content_html = :c,
                 featured_image = :img, published_date = :pd, seo = :seo, status = :st WHERE id = :id'
            );
            $stmt->execute([
                ':t'    => $data['title'],
                ':slug' => $slug,
                ':ex'   => $data['excerpt'] ?? '',
                ':c'    => $data['content_html'] ?? '',
                ':img'  => $data['featured_image'] ?? '',
                ':pd'   => $data['published_date'] ?? date('Y-m-d'),
                ':seo'  => json_encode($data['seo'] ?? [], JSON_UNESCAPED_UNICODE),
                ':st'   => $data['status'] ?? 'published',
                ':id'   => $id,
            ]);
        }
        if ($this->tableHasDisplayMode('blog_posts') && array_key_exists('display_mode', $data)) {
            $dm = $this->db->prepare('UPDATE blog_posts SET display_mode = :dm WHERE id = :id');
            $dm->execute([
                ':dm' => $this->normalizeDisplayMode((string) $data['display_mode']),
                ':id' => $id,
            ]);
        }
    }

    public function getServiceLanding(string $slug): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM service_landings WHERE slug = :slug AND status = 'published' LIMIT 1"
        );
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row ? $this->mapLanding($row) : null;
    }

    public function getAllServiceLandings(): array
    {
        $rows = $this->db->query(
            "SELECT * FROM service_landings WHERE status = 'published' ORDER BY service_name ASC"
        )->fetchAll();
        return array_map(fn ($r) => $this->mapLanding($r), $rows);
    }

    public function getAllLandingsAdmin(): array
    {
        return $this->db->query('SELECT id, slug, service_name, status, updated_at FROM service_landings ORDER BY service_name')->fetchAll();
    }

    public function getLandingById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM service_landings WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function saveLanding(int $id, array $data): void
    {
        $slug = !empty($data['slug'])
            ? $this->uniqueSlug('service_landings', $this->sanitizeSlug((string) $data['slug']), $id)
            : null;
        $sql = 'UPDATE service_landings SET service_name = :sn, page_title = :pt, page_description = :pd,
             page_keywords = :pk, intro = :intro, benefits = :b, deliverables = :d, faq = :f,
             related_slugs = :r, theme = :th, seo_body_html = :seo, status = :status';
        if ($slug !== null) {
            $sql = str_replace('SET service_name', 'SET slug = :slug, service_name', $sql);
        }
        $sql .= ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        $params = [
            ':sn'    => $data['service_name'],
            ':pt'    => $data['page_title'],
            ':pd'    => $data['page_description'] ?? '',
            ':pk'    => $data['page_keywords'] ?? '',
            ':intro' => $data['intro'] ?? '',
            ':b'     => json_encode($data['benefits'] ?? [], JSON_UNESCAPED_UNICODE),
            ':d'     => json_encode($data['deliverables'] ?? [], JSON_UNESCAPED_UNICODE),
            ':f'     => json_encode($data['faq'] ?? [], JSON_UNESCAPED_UNICODE),
            ':r'     => json_encode($data['related_slugs'] ?? [], JSON_UNESCAPED_UNICODE),
            ':th'    => json_encode($data['theme'] ?? [], JSON_UNESCAPED_UNICODE),
            ':seo'   => $data['seo_body_html'] ?? '',
            ':status'=> $data['status'] ?? 'published',
            ':id'    => $id,
        ];
        if ($slug !== null) {
            $params[':slug'] = $slug;
        }
        $stmt->execute($params);
        if ($this->tableHasDisplayMode('service_landings') && array_key_exists('display_mode', $data)) {
            $dm = $this->db->prepare('UPDATE service_landings SET display_mode = :dm WHERE id = :id');
            $dm->execute([
                ':dm' => $this->normalizeDisplayMode((string) $data['display_mode']),
                ':id' => $id,
            ]);
        }
    }

    public function getService(string $slug): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM services WHERE slug = :slug AND status = 'published' LIMIT 1"
        );
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row ? $this->mapService($row) : null;
    }

    public function getAllServicesAdmin(): array
    {
        return $this->db->query('SELECT id, slug, title, status FROM services ORDER BY title')->fetchAll();
    }

    public function listServicesAdmin(
        int $page = 1,
        int $perPage = 10,
        string $search = '',
        string $sort = '',
        string $order = 'asc'
    ): array {
        $where = 'WHERE 1=1';
        $params = [];
        $where .= AdminListQuery::searchWhere(
            ['title', 'slug', 'status', 'hero_title', 'hero_subtitle', 'content_html', 'price_badge'],
            $search,
            $params
        );
        $sortCol = AdminListQuery::sortColumn($sort, ['title', 'slug', 'status', 'updated_at'], 'title');
        $orderSql = AdminListQuery::orderSql($order);

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM services {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);
        $offset = max(0, ($page - 1) * $perPage);
        $stmt = $this->db->prepare(
            "SELECT id, slug, title, status, updated_at FROM services {$where}
             ORDER BY {$sortCol} {$orderSql} LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return ['items' => $stmt->fetchAll(), 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function getServiceById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM services WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function saveService(int $id, array $data): void
    {
        $slug = $this->uniqueSlug(
            'services',
            $this->sanitizeSlug((string) ($data['slug'] ?? $data['title'] ?? 'service')),
            $id
        );
        $stmt = $this->db->prepare(
            'UPDATE services SET slug = :slug, title = :t, hero_title = :ht, hero_subtitle = :hs, price_badge = :pb,
             content_html = :c, features = :f, cta_title = :ct, cta_text = :ctx, seo = :seo, status = :st
             WHERE id = :id'
        );
        $stmt->execute([
            ':slug' => $slug,
            ':t'   => $data['title'],
            ':ht'  => $data['hero_title'] ?? $data['title'],
            ':hs'  => $data['hero_subtitle'] ?? '',
            ':pb'  => $data['price_badge'] ?? '',
            ':c'   => $data['content_html'] ?? '',
            ':f'   => json_encode($data['features'] ?? [], JSON_UNESCAPED_UNICODE),
            ':ct'  => $data['cta_title'] ?? '',
            ':ctx' => $data['cta_text'] ?? '',
            ':seo' => json_encode($data['seo'] ?? [], JSON_UNESCAPED_UNICODE),
            ':st'  => $data['status'] ?? 'published',
            ':id'  => $id,
        ]);
        if ($this->tableHasDisplayMode('services') && array_key_exists('display_mode', $data)) {
            $dm = $this->db->prepare('UPDATE services SET display_mode = :dm WHERE id = :id');
            $dm->execute([
                ':dm' => $this->normalizeDisplayMode((string) $data['display_mode']),
                ':id' => $id,
            ]);
        }
    }

    public function createService(array $data): int
    {
        $slug = $this->uniqueSlug('services', $this->sanitizeSlug((string) ($data['slug'] ?? $data['title'] ?? 'service')));
        $stmt = $this->db->prepare(
            'INSERT INTO services (slug, title, hero_title, hero_subtitle, price_badge, content_html, features, cta_title, cta_text, seo, status)
             VALUES (:slug, :t, :ht, :hs, :pb, :c, :f, :ct, :ctx, :seo, :st)'
        );
        $stmt->execute([
            ':slug' => $slug,
            ':t'    => $data['title'] ?? 'New service',
            ':ht'   => $data['hero_title'] ?? $data['title'] ?? '',
            ':hs'   => $data['hero_subtitle'] ?? '',
            ':pb'   => $data['price_badge'] ?? '',
            ':c'    => $data['content_html'] ?? '',
            ':f'    => json_encode($data['features'] ?? [], JSON_UNESCAPED_UNICODE),
            ':ct'   => $data['cta_title'] ?? '',
            ':ctx'  => $data['cta_text'] ?? '',
            ':seo'  => json_encode($data['seo'] ?? [], JSON_UNESCAPED_UNICODE),
            ':st'   => $data['status'] ?? 'draft',
        ]);
        $newId = (int) $this->db->lastInsertId();
        if (function_exists('cws_desimentor')) {
            try {
                cws_desimentor()->ensureDocument('service', $newId);
            } catch (Throwable) {
            }
        }
        return $newId;
    }

    public function getBlogPosts(): array
    {
        $rows = $this->db->query(
            "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_date DESC, id DESC"
        )->fetchAll();
        return array_map(fn ($r) => $this->mapBlogPost($r), $rows);
    }

    public function getAllSlugs(): array
    {
        $slugs = ['home'];
        $pageWhere = "status = 'published' AND slug != 'home'";
        if ($this->pagesSeoColumnsExist()) {
            $pageWhere .= " AND (seo_robots IS NULL OR seo_robots = '' OR seo_robots = 'index')";
        }
        foreach ($this->db->query("SELECT slug FROM pages WHERE {$pageWhere}") as $r) {
            $slugs[] = $r['slug'];
        }
        foreach ($this->db->query("SELECT slug FROM service_landings WHERE status = 'published'") as $r) {
            $slugs[] = $r['slug'];
        }
        foreach ($this->db->query("SELECT slug FROM services WHERE status = 'published'") as $r) {
            $slugs[] = $r['slug'];
        }
        return array_values(array_unique($slugs));
    }

    public function saveFormSubmission(string $type, array $payload): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO form_submissions (form_type, payload) VALUES (:t, :p)'
        );
        $stmt->execute([
            ':t' => $type,
            ':p' => json_encode($payload, JSON_UNESCAPED_UNICODE),
        ]);
    }

    public function getFormSubmissions(int $limit = 50): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT :lim'
        );
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    private function mapPage(array $page, bool $withSections): array
    {
        $data = [
            'slug'         => $page['slug'],
            'title'        => html_entity_decode((string) $page['title'], ENT_QUOTES | ENT_HTML5, 'UTF-8'),
            'content'      => (string) ($page['content_html'] ?? ''),
            'template'     => $page['template'] ?: 'default',
            'displayMode'  => $this->rowDisplayMode($page, 'pages'),
            'seo'          => [
                'title'         => $page['seo_title'] ?: $page['title'],
                'description'   => $page['seo_description'] ?? '',
                'keywords'      => $page['seo_keywords'] ?? '',
                'canonical'     => $page['seo_canonical'] ?? '',
                'ogImage'       => $page['seo_og_image'] ?? '',
                'robots'        => ($page['seo_robots'] ?? 'index') === 'noindex' ? 'noindex' : 'index',
                'focusKeyword'  => $page['seo_focus_keyword'] ?? '',
            ],
        ];
        if ($withSections) {
            $data['sections'] = $this->getHomepageSections((int) $page['id']);
        }
        $entityType = !empty($page['is_homepage']) ? 'homepage' : 'page';
        $this->attachDesimentor($data, $entityType, (int) $page['id']);
        return $data;
    }

    private function mapLanding(array $row): array
    {
        $theme = $this->decodeJson($row['theme']) ?? [];
        $data = [
            'slug'            => $row['slug'],
            'displayMode'     => $this->rowDisplayMode($row, 'service_landings'),
            'service'         => $row['service_name'],
            'pageTitle'       => $row['page_title'],
            'pageDescription' => $row['page_description'] ?? '',
            'pageKeywords'    => $row['page_keywords'] ?? '',
            'intro'           => $row['intro'] ?? '',
            'benefits'        => $this->decodeJson($row['benefits']) ?? [],
            'deliverables'    => $this->decodeJson($row['deliverables']) ?? [],
            'faq'             => $this->decodeJson($row['faq']) ?? [],
            'related'         => $this->decodeJson($row['related_slugs']) ?? [],
            'seoBody'         => $row['seo_body_html'] ?? '',
            'theme'           => array_merge([
                'start'  => '#1e3a8a',
                'mid'    => '#2563eb',
                'end'    => '#3b82f6',
                'accent' => '#93c5fd',
                'icon'   => 'fas fa-briefcase',
                'badge'  => '',
            ], $theme),
        ];
        $this->attachDesimentor($data, 'service_landing', (int) $row['id']);
        return $data;
    }

    private function mapService(array $row): array
    {
        $seo = $this->decodeJson($row['seo']) ?? [];
        $data = [
            'slug'         => $row['slug'],
            'title'        => $row['title'],
            'displayMode'  => $this->rowDisplayMode($row, 'services'),
            'heroTitle'    => $row['hero_title'] ?: $row['title'],
            'heroSubtitle' => $row['hero_subtitle'] ?? '',
            'priceBadge'   => $row['price_badge'] ?? '',
            'content'      => $row['content_html'] ?? '',
            'features'     => $this->decodeJson($row['features']) ?? [],
            'ctaTitle'     => $row['cta_title'] ?? '',
            'ctaText'      => $row['cta_text'] ?? '',
            'seo'          => array_merge([
                'title'       => $row['title'],
                'description' => '',
                'keywords'    => '',
            ], $seo),
        ];
        $this->attachDesimentor($data, 'service', (int) $row['id']);
        return $data;
    }

    private function attachDesimentor(array &$data, string $entityType, int $entityId): void
    {
        if (!function_exists('cws_desimentor')) {
            return;
        }
        $dsmt = cws_desimentor();
        if (!$dsmt->tableExists()) {
            return;
        }
        $doc = $dsmt->getDocument($entityType, $entityId, false);
        if ($doc && !empty($doc['content']['sections'])) {
            $data['desimentor'] = $doc['content'];
        }
    }

    private function mapBlogPost(array $row): array
    {
        $seo = $this->decodeJson($row['seo']) ?? [];
        $robots = ($seo['robots'] ?? 'index') === 'noindex' ? 'noindex' : 'index';
        $data = [
            'slug'        => $row['slug'],
            'title'       => $row['title'],
            'excerpt'     => $row['excerpt'] ?? '',
            'date'        => $row['published_date'] ?? '',
            'image'       => $row['featured_image'] ?: null,
            'content'     => $row['content_html'] ?? '',
            'displayMode' => $this->rowDisplayMode($row, 'blog_posts'),
            'categories'  => $this->parseBlogCategoriesRow($row),
            'featured'    => !empty($row['is_featured']),
            'seo'         => array_merge([
                'title'       => $row['title'],
                'description' => $row['excerpt'] ?? '',
                'keywords'    => '',
            ], $seo, ['robots' => $robots]),
        ];
        $this->attachDesimentor($data, 'blog_post', (int) $row['id']);
        return $data;
    }

    /** @return list<string> */
    private function normalizeBlogCategories(mixed $raw): array
    {
        if (is_string($raw)) {
            $raw = array_map('trim', explode(',', $raw));
        }
        if (!is_array($raw)) {
            return [];
        }
        $out = [];
        foreach ($raw as $item) {
            $name = trim((string) $item);
            if ($name !== '') {
                $out[] = $name;
            }
        }
        return array_values(array_unique($out));
    }

    /** @return list<string> */
    private function parseBlogCategoriesRow(array $row): array
    {
        if (!$this->blogMetaColumnsExist() || !isset($row['categories'])) {
            return [];
        }
        $decoded = $this->decodeJson($row['categories']);
        return $this->normalizeBlogCategories($decoded ?? []);
    }

    private function blogMetaColumnsExist(): bool
    {
        static $cache = null;
        if ($cache !== null) {
            return $cache;
        }
        $stmt = $this->db->query("SHOW COLUMNS FROM blog_posts LIKE 'categories'");
        $cache = (bool) $stmt->fetch();
        return $cache;
    }

    private function decodeJson(mixed $raw): ?array
    {
        if (is_array($raw)) {
            return $raw;
        }
        if (!is_string($raw) || $raw === '') {
            return null;
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : null;
    }

    private function sanitizeSlug(string $value): string
    {
        $slug = strtolower(trim($value));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
        return trim($slug, '-') ?: 'item';
    }

    public function portfolioTableExists(): bool
    {
        return $this->tableExists('portfolio_items');
    }

    public function listPortfolioAdmin(
        int $page = 1,
        int $perPage = 10,
        string $search = '',
        string $sort = '',
        string $order = 'desc'
    ): array {
        if (!$this->portfolioTableExists()) {
            return ['items' => [], 'total' => 0, 'page' => $page, 'perPage' => $perPage];
        }
        $where = 'WHERE 1=1';
        $params = [];
        $where .= AdminListQuery::searchWhere(
            ['title', 'client_name', 'location', 'category', 'excerpt', 'status'],
            $search,
            $params
        );
        $sortCol = AdminListQuery::sortColumn(
            $sort,
            ['title', 'client_name', 'location', 'category', 'sort_order', 'status', 'updated_at'],
            'sort_order'
        );
        $orderSql = AdminListQuery::orderSql($order);

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM portfolio_items {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);
        $offset = max(0, ($page - 1) * $perPage);
        $stmt = $this->db->prepare(
            "SELECT id, title, client_name, location, category, image, show_on_homepage, sort_order, status, updated_at
             FROM portfolio_items {$where}
             ORDER BY {$sortCol} {$orderSql} LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return ['items' => $stmt->fetchAll(), 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function getPortfolioItemById(int $id): ?array
    {
        if (!$this->portfolioTableExists()) {
            return null;
        }
        $stmt = $this->db->prepare('SELECT * FROM portfolio_items WHERE id = :id');
        $stmt->execute([':id' => $id]);

        return $stmt->fetch() ?: null;
    }

    public function createPortfolioItem(array $data): int
    {
        if (!$this->portfolioTableExists()) {
            throw new RuntimeException('Run php cms/scripts/migrate-010.php first.');
        }
        $stmt = $this->db->prepare(
            'INSERT INTO portfolio_items (title, client_name, location, category, image, href, excerpt, sort_order, show_on_homepage, status)
             VALUES (:t, :cn, :loc, :cat, :img, :href, :ex, :ord, :home, :st)'
        );
        $stmt->execute([
            ':t'    => (string) ($data['title'] ?? $data['client_name'] ?? 'Project'),
            ':cn'   => (string) ($data['client_name'] ?? $data['title'] ?? ''),
            ':loc'  => (string) ($data['location'] ?? ''),
            ':cat'  => (string) ($data['category'] ?? ''),
            ':img'  => (string) ($data['image'] ?? ''),
            ':href' => (string) ($data['href'] ?? ''),
            ':ex'   => (string) ($data['excerpt'] ?? ''),
            ':ord'  => (int) ($data['sort_order'] ?? 0),
            ':home' => !empty($data['show_on_homepage']) ? 1 : 0,
            ':st'   => ($data['status'] ?? 'published') === 'draft' ? 'draft' : 'published',
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function savePortfolioItem(int $id, array $data): void
    {
        if (!$this->portfolioTableExists()) {
            throw new RuntimeException('Run php cms/scripts/migrate-010.php first.');
        }
        $stmt = $this->db->prepare(
            'UPDATE portfolio_items SET title = :t, client_name = :cn, location = :loc, category = :cat,
             image = :img, href = :href, excerpt = :ex, sort_order = :ord, show_on_homepage = :home, status = :st
             WHERE id = :id'
        );
        $stmt->execute([
            ':t'    => (string) ($data['title'] ?? ''),
            ':cn'   => (string) ($data['client_name'] ?? ''),
            ':loc'  => (string) ($data['location'] ?? ''),
            ':cat'  => (string) ($data['category'] ?? ''),
            ':img'  => (string) ($data['image'] ?? ''),
            ':href' => (string) ($data['href'] ?? ''),
            ':ex'   => (string) ($data['excerpt'] ?? ''),
            ':ord'  => (int) ($data['sort_order'] ?? 0),
            ':home' => !empty($data['show_on_homepage']) ? 1 : 0,
            ':st'   => ($data['status'] ?? 'published') === 'draft' ? 'draft' : 'published',
            ':id'   => $id,
        ]);
    }

    public function deletePortfolioItem(int $id): void
    {
        if (!$this->portfolioTableExists()) {
            return;
        }
        $stmt = $this->db->prepare('DELETE FROM portfolio_items WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }

    /** Published homepage items — at most $perCategoryLimit per category (global sort order). */
    public function getPortfolioForHomepage(int $perCategoryLimit = 5): array
    {
        if (!$this->portfolioTableExists()) {
            return [];
        }
        $perCategoryLimit = max(1, min(24, $perCategoryLimit));
        $stmt = $this->db->query(
            "SELECT * FROM portfolio_items
             WHERE status = 'published' AND show_on_homepage = 1
             ORDER BY sort_order ASC, id DESC"
        );
        $rows = $stmt->fetchAll();
        $counts = [];
        $result = [];
        foreach ($rows as $row) {
            $cat = trim((string) ($row['category'] ?? ''));
            $n = $counts[$cat] ?? 0;
            if ($n >= $perCategoryLimit) {
                continue;
            }
            $counts[$cat] = $n + 1;
            $result[] = $this->mapPortfolioItem($row);
        }

        return $result;
    }

    public function getAllPortfolioPublished(): array
    {
        if (!$this->portfolioTableExists()) {
            return [];
        }
        $stmt = $this->db->query(
            "SELECT * FROM portfolio_items WHERE status = 'published'
             ORDER BY sort_order ASC, id DESC"
        );

        return array_map(fn ($row) => $this->mapPortfolioItem($row), $stmt->fetchAll());
    }

    private function mapPortfolioItem(array $row): array
    {
        return [
            'id'          => (int) $row['id'],
            'title'       => (string) $row['title'],
            'clientName'  => (string) ($row['client_name'] ?? ''),
            'location'    => (string) ($row['location'] ?? ''),
            'category'    => (string) ($row['category'] ?? ''),
            'image'       => (string) ($row['image'] ?? ''),
            'href'        => (string) ($row['href'] ?? ''),
            'excerpt'     => (string) ($row['excerpt'] ?? ''),
            'showOnHomepage' => !empty($row['show_on_homepage']),
        ];
    }

    public function trackPageView(string $path, string $slug = ''): void
    {
        if (!$this->tableExists('page_views')) {
            return;
        }
        $path = substr($path, 0, 300);
        $slug = substr($slug, 0, 200);
        $day = date('Y-m-d');
        $stmt = $this->db->prepare(
            'INSERT INTO page_views (path, slug, viewed_on, views) VALUES (:p, :s, :d, 1)
             ON DUPLICATE KEY UPDATE views = views + 1'
        );
        $stmt->execute([':p' => $path, ':s' => $slug, ':d' => $day]);
    }

    public function getAdminDashboardStats(): array
    {
        $counts = [
            'pages'      => (int) $this->db->query('SELECT COUNT(*) FROM pages WHERE is_homepage = 0')->fetchColumn(),
            'blog'       => (int) $this->db->query('SELECT COUNT(*) FROM blog_posts')->fetchColumn(),
            'landings'   => (int) $this->db->query('SELECT COUNT(*) FROM service_landings')->fetchColumn(),
            'services'   => (int) $this->db->query('SELECT COUNT(*) FROM services')->fetchColumn(),
            'portfolio'  => $this->portfolioTableExists()
                ? (int) $this->db->query('SELECT COUNT(*) FROM portfolio_items')->fetchColumn()
                : 0,
            'sections'   => (int) $this->db->query('SELECT COUNT(*) FROM homepage_sections')->fetchColumn(),
            'published'  => (int) $this->db->query(
                "SELECT (
                  (SELECT COUNT(*) FROM pages WHERE status='published') +
                  (SELECT COUNT(*) FROM blog_posts WHERE status='published') +
                  (SELECT COUNT(*) FROM service_landings WHERE status='published') +
                  (SELECT COUNT(*) FROM services WHERE status='published')
                ) AS c"
            )->fetchColumn(),
            'drafts'     => (int) $this->db->query(
                "SELECT (
                  (SELECT COUNT(*) FROM pages WHERE status='draft') +
                  (SELECT COUNT(*) FROM blog_posts WHERE status='draft') +
                  (SELECT COUNT(*) FROM service_landings WHERE status='draft') +
                  (SELECT COUNT(*) FROM services WHERE status='draft')
                ) AS c"
            )->fetchColumn(),
        ];

        $formsTotal = (int) $this->db->query('SELECT COUNT(*) FROM form_submissions')->fetchColumn();
        $forms30 = (int) $this->db->query(
            'SELECT COUNT(*) FROM form_submissions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
        )->fetchColumn();

        $performance = [];
        $topPages = [];
        $hasViews = $this->tableExists('page_views');
        if ($hasViews) {
            $performance = $this->db->query(
                "SELECT viewed_on AS date, SUM(views) AS views
                 FROM page_views WHERE viewed_on >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
                 GROUP BY viewed_on ORDER BY viewed_on ASC"
            )->fetchAll();
            $topPages = $this->db->query(
                "SELECT path, slug, SUM(views) AS views
                 FROM page_views WHERE viewed_on >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
                 GROUP BY path, slug ORDER BY views DESC LIMIT 10"
            )->fetchAll();
        }

        $totalViews28 = 0;
        foreach ($performance as $row) {
            $totalViews28 += (int) $row['views'];
        }

        $clicks = $forms30;
        $impressions = max($totalViews28, $clicks * 3, 1);
        $ctr = round(($clicks / $impressions) * 100, 2);

        $seoIssues = [];
        foreach ($this->db->query(
            "SELECT id, title, slug, seo_description FROM pages WHERE is_homepage = 0 AND status = 'published'"
        )->fetchAll() as $p) {
            if (strlen(trim((string) $p['seo_description'])) < 50) {
                $seoIssues[] = ['type' => 'page', 'title' => $p['title'], 'slug' => $p['slug'], 'issue' => 'Missing meta description'];
            }
        }
        foreach ($this->db->query(
            "SELECT id, title, slug, excerpt FROM blog_posts WHERE status = 'published'"
        )->fetchAll() as $p) {
            if (strlen(trim((string) $p['excerpt'])) < 20) {
                $seoIssues[] = ['type' => 'blog', 'title' => $p['title'], 'slug' => $p['slug'], 'issue' => 'Short or missing excerpt'];
            }
        }

        $recentForms = $this->db->query(
            'SELECT form_type, created_at FROM form_submissions ORDER BY created_at DESC LIMIT 8'
        )->fetchAll();

        return [
            'overview' => [
                'clicks'      => $clicks,
                'impressions' => $impressions,
                'ctr'         => $ctr,
                'position'    => 12.4,
                'totalViews'  => $totalViews28,
            ],
            'counts'       => $counts,
            'formsTotal'   => $formsTotal,
            'performance'  => $performance,
            'topPages'     => $topPages,
            'seoIssues'    => array_slice($seoIssues, 0, 15),
            'recentForms'  => $recentForms,
            'hasAnalytics' => $hasViews,
        ];
    }

    private function homepageSectionHasStatusColumn(): bool
    {
        static $cache = null;
        if ($cache !== null) {
            return $cache;
        }
        $stmt = $this->db->query("SHOW COLUMNS FROM homepage_sections LIKE 'status'");
        $cache = (bool) $stmt->fetch();
        return $cache;
    }

    private function normalizeSectionStatus(string $status): string
    {
        return in_array($status, ['published', 'draft', 'trash'], true) ? $status : 'draft';
    }

    private function sectionTitleFromPayload(array $section, string $layout): string
    {
        if ($layout === 'hero_slider') {
            return (string) ($section['headline'] ?? $section['eyebrow'] ?? 'Hero');
        }
        return (string) ($section['title'] ?? $section['badge'] ?? $layout);
    }

    private function sectionListTitle(array $row, array $payload, string $layout): string
    {
        $admin = (string) ($row['admin_title'] ?? '');
        if ($admin !== '') {
            return $admin;
        }
        return $this->sectionTitleFromPayload($payload, $layout);
    }

    private function homepageSectionStatusCounts(int $pageId): array
    {
        if (!$this->homepageSectionHasStatusColumn()) {
            $stmt = $this->db->prepare('SELECT COUNT(*) AS c FROM homepage_sections WHERE page_id = :id');
            $stmt->execute([':id' => $pageId]);
            $total = (int) ($stmt->fetch()['c'] ?? 0);
            return ['all' => $total, 'published' => $total, 'draft' => 0, 'trash' => 0];
        }
        $stmt = $this->db->prepare(
            "SELECT status, COUNT(*) AS c FROM homepage_sections WHERE page_id = :id GROUP BY status"
        );
        $stmt->execute([':id' => $pageId]);
        $counts = ['published' => 0, 'draft' => 0, 'trash' => 0];
        while ($r = $stmt->fetch()) {
            $counts[$r['status']] = (int) $r['c'];
        }
        $counts['all'] = $counts['published'] + $counts['draft'] + $counts['trash'];
        return $counts;
    }

    private function pagesSeoColumnsExist(): bool
    {
        static $cache = null;
        if ($cache !== null) {
            return $cache;
        }
        $stmt = $this->db->query("SHOW COLUMNS FROM pages LIKE 'seo_canonical'");
        $cache = (bool) $stmt->fetch();
        return $cache;
    }

    private function tableExists(string $table): bool
    {
        if (!preg_match('/^[a-z_]+$/', $table)) {
            return false;
        }
        $stmt = $this->db->query("SHOW TABLES LIKE '{$table}'");
        return (bool) $stmt->fetch();
    }

    private function uniqueSlug(string $table, string $slug, ?int $excludeId = null): string
    {
        $allowed = ['pages', 'blog_posts', 'service_landings', 'services'];
        if (!in_array($table, $allowed, true)) {
            return $slug;
        }
        $base = $slug;
        $n = 1;
        while (true) {
            $sql = "SELECT id FROM {$table} WHERE slug = :slug";
            if ($excludeId) {
                $sql .= ' AND id != :ex';
            }
            $sql .= ' LIMIT 1';
            $stmt = $this->db->prepare($sql);
            $params = [':slug' => $slug];
            if ($excludeId) {
                $params[':ex'] = $excludeId;
            }
            $stmt->execute($params);
            if (!$stmt->fetch()) {
                return $slug;
            }
            $slug = $base . '-' . $n++;
        }
    }

    public function getGmbPublicPayload(): array
    {
        $settings = $this->getSiteSettings();
        if ($this->gmbUseLiveEnabled($settings) && GmbPlacesClient::fromConfig() !== null) {
            if ($this->gmbCacheExpired($settings)) {
                try {
                    $settings = $this->syncGmbFromGoogle($settings);
                } catch (Throwable $e) {
                    error_log('[GMB sync] ' . $e->getMessage());
                }
            }
        }

        return $this->formatGmbPublicPayload($settings);
    }

    /**
     * @param array<string, mixed> $settings
     * @return array<string, mixed>
     */
    public function syncGmbFromGoogle(array $settings = []): array
    {
        $client = GmbPlacesClient::fromConfig();
        if ($client === null) {
            throw new RuntimeException('Add google.places_api_key in cms/config.php (Places API enabled).');
        }

        if ($settings === []) {
            $settings = $this->getSiteSettings();
        }

        $placeId = trim((string) ($settings['gmbPlaceId'] ?? ''));
        if ($placeId === '') {
            $query = trim((string) ($settings['gmbPlaceQuery'] ?? 'Creative Web Solutions Zirakpur Punjab'));
            $placeId = $client->findPlaceId($query) ?? '';
            if ($placeId === '') {
                throw new RuntimeException('Could not find Google Place ID. Set gmbPlaceId in Settings → Google Business.');
            }
        }

        $details = $client->getPlaceDetails($placeId);
        $previous = $this->decodeGmbReviewsList($settings['gmbReviewsJson'] ?? '');
        $reviews = $this->mergeGoogleReviewsIntoSettings($details['reviews'], $previous);

        $count = $details['userRatingCount'];
        $settings['gmbPlaceId'] = $details['placeId'];
        $settings['gmbUseLive'] = '1';
        $settings['gmbRating'] = $details['rating'] > 0 ? (string) round($details['rating'], 1) : ($settings['gmbRating'] ?? '4.9');
        $settings['gmbReviewCount'] = $count > 0 ? (string) $count : ($settings['gmbReviewCount'] ?? '0');
        if (!empty($details['mapsUrl'])) {
            $settings['gmbMapsUrl'] = $details['mapsUrl'];
        }
        if (!empty($details['name'])) {
            $settings['gmbPlaceName'] = $details['name'];
        }
        $settings['gmbReviewsJson'] = json_encode($reviews, JSON_UNESCAPED_UNICODE);
        $settings['gmbReviewsCachedAt'] = gmdate('c');

        $this->saveSiteSettings($settings);

        return $settings;
    }

    private function gmbUseLiveEnabled(array $settings): bool
    {
        $flag = $settings['gmbUseLive'] ?? '1';

        return $flag !== '0' && $flag !== 'false' && $flag !== '';
    }

    private function gmbCacheExpired(array $settings): bool
    {
        $cachedAt = strtotime((string) ($settings['gmbReviewsCachedAt'] ?? ''));
        $hours = max(1, (int) ($settings['gmbCacheHours'] ?? 12));
        if ($cachedAt <= 0) {
            return true;
        }

        return (time() - $cachedAt) > ($hours * 3600);
    }

    /** @return list<array<string, mixed>> */
    private function decodeGmbReviewsList(string|array|null $raw): array
    {
        if (is_array($raw)) {
            return $raw;
        }
        if (!is_string($raw) || trim($raw) === '') {
            return [];
        }
        $decoded = json_decode($raw, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param list<array{author: string, rating: int, text: string, ago: string, time: int}> $fromGoogle
     * @param list<array<string, mixed>> $previous
     * @return list<array<string, mixed>>
     */
    private function mergeGoogleReviewsIntoSettings(array $fromGoogle, array $previous): array
    {
        $prevById = [];
        foreach ($previous as $p) {
            if (!is_array($p)) {
                continue;
            }
            $id = (string) ($p['id'] ?? '');
            if ($id !== '') {
                $prevById[$id] = $p;
            }
        }

        $out = [];
        foreach ($fromGoogle as $r) {
            $id = 'google-' . substr(md5($r['author'] . '|' . ($r['time'] ?: $r['text'])), 0, 12);
            $prev = $prevById[$id] ?? null;
            $show = true;
            if ($prev !== null && array_key_exists('showOnHomepage', $prev)) {
                $show = !empty($prev['showOnHomepage']);
            }
            $out[] = [
                'id'             => $id,
                'author'         => $r['author'],
                'text'           => $r['text'],
                'rating'         => min(5, max(1, $r['rating'])),
                'ago'            => $r['ago'],
                'showOnHomepage' => $show,
                'source'         => 'google',
            ];
        }

        return $out;
    }

    /** @param array<string, mixed> $settings */
    private function formatGmbPublicPayload(array $settings): array
    {
        $reviews = [];
        foreach ($this->decodeGmbReviewsList($settings['gmbReviewsJson'] ?? '') as $i => $r) {
            if (!is_array($r)) {
                continue;
            }
            if (isset($r['showOnHomepage']) && !$r['showOnHomepage']) {
                continue;
            }
            $author = trim((string) ($r['author'] ?? ''));
            $text = trim((string) ($r['text'] ?? ''));
            if ($author === '' || $text === '') {
                continue;
            }
            $reviews[] = [
                'id'     => (string) ($r['id'] ?? 'gmb-' . $i),
                'author' => $author,
                'text'   => $text,
                'rating' => min(5, max(1, (int) ($r['rating'] ?? 5))),
                'ago'    => (string) ($r['ago'] ?? ''),
            ];
        }

        $count = (string) ($settings['gmbReviewCount'] ?? '');
        if ($count !== '' && !str_contains($count, '+')) {
            $count .= '+';
        }

        return [
            'mapsUrl'     => (string) ($settings['gmbMapsUrl'] ?? ''),
            'placeName'   => (string) ($settings['gmbPlaceName'] ?? ''),
            'rating'      => (float) ($settings['gmbRating'] ?? 0),
            'reviewCount' => $count,
            'reviews'     => $reviews,
            'cachedAt'    => (string) ($settings['gmbReviewsCachedAt'] ?? ''),
            'live'        => $this->gmbUseLiveEnabled($settings) && GmbPlacesClient::fromConfig() !== null,
        ];
    }

    private function defaultSettings(): array
    {
        return [
            'phone'               => '',
            'email'               => '',
            'address'             => '',
            'logoUrl'             => '/assets/images/cws-logo.svg',
            'logoWhiteUrl'        => '/assets/images/cws-logo-light.svg',
            'primaryColor'        => '#0057FF',
            'secondaryColor'      => '#0088FF',
            'footerText'          => '',
            'facebook'            => '',
            'linkedin'            => '',
            'instagram'           => '',
            'footerCompanyTitle'  => 'Company',
            'footerServicesTitle' => 'Services',
            'footerProductsTitle' => 'Products & Training',
        ];
    }
}
