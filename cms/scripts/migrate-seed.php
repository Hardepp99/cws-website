<?php
/**
 * Import content from wordpress/seed-data + frontend JSON into cws_cms MySQL.
 * Run: php cms/scripts/migrate-seed.php
 */

declare(strict_types=1);

$root = dirname(__DIR__, 2);
require_once dirname(__DIR__) . '/bootstrap.php';
require_once __DIR__ . '/service-grid-page-content.php';

$schemaFile = dirname(__DIR__) . '/database/schema.sql';
$sql = file_get_contents($schemaFile);
foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
    if ($statement === '' || stripos($statement, 'CREATE DATABASE') === 0 || stripos($statement, 'USE ') === 0) {
        continue;
    }
    try {
        cws_db()->exec($statement);
    } catch (PDOException $e) {
        if (!str_contains($e->getMessage(), 'already exists')) {
            throw $e;
        }
    }
}

// Create DB if missing
try {
    $host = cws_config('db.host');
    $port = cws_config('db.port');
    $name = cws_config('db.name');
    $user = cws_config('db.user');
    $pass = cws_config('db.password');
    $pdo = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$name`");
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
        if ($statement === '' || stripos($statement, 'CREATE DATABASE') === 0 || stripos($statement, 'USE ') === 0) {
            continue;
        }
        try {
            $pdo->exec($statement);
        } catch (PDOException $e) {
            if (!str_contains($e->getMessage(), 'already exists')) {
                echo "SQL warn: " . $e->getMessage() . "\n";
            }
        }
    }
} catch (Throwable $e) {
    fwrite(STDERR, "DB setup failed: " . $e->getMessage() . "\n");
    exit(1);
}

$db = cws_db();
$repo = cws_repo();
$seedDir = $root . '/wordpress/seed-data';

function read_json_file(string $path): mixed
{
    if (!is_file($path)) {
        return null;
    }
    return json_decode(file_get_contents($path), true);
}

// Admin user
$adminPass = getenv('CWS_ADMIN_PASSWORD') ?: 'CwsAdmin@2026';
$hash = password_hash($adminPass, PASSWORD_DEFAULT);
$db->exec('DELETE FROM users');
$stmt = $db->prepare('INSERT INTO users (username, password_hash, display_name, role) VALUES (:u, :p, :d, :r)');
$stmt->execute([':u' => 'admin', ':p' => $hash, ':d' => 'Administrator', ':r' => 'admin']);
echo "Admin user: admin / $adminPass\n";

// Site settings
$settings = read_json_file($seedDir . '/site-settings.json');
if ($settings) {
    $repo->saveSiteSettings($settings);
    echo "Site settings imported\n";
}

// Menus
$menus = read_json_file($seedDir . '/menus.json');
if ($menus) {
    foreach ($menus as $key => $items) {
        $repo->saveMenu($key, $items);
    }
    echo "Menus imported\n";
}

// Pricing
$pricing = read_json_file($seedDir . '/pricing-options.json');
if ($pricing) {
    $repo->savePricingOptions($pricing);
    echo "Pricing options imported\n";
}

// Pages
$pagesContent = read_json_file($seedDir . '/pages-content.json') ?? [];
$pageTitles = [
    'about'     => 'About Us',
    'services'  => 'Our Services',
    'contact'   => 'Contact Us',
    'blog'      => 'Blog',
    'portfolio' => 'Portfolio',
    'courses'   => 'Courses & Training',
];
$db->exec('DELETE FROM homepage_sections');
$db->exec('DELETE FROM pages');

$homeSeo = $pagesContent['home']['seo'] ?? [];
$ins = $db->prepare(
    'INSERT INTO pages (slug, title, content_html, template, seo_title, seo_description, seo_keywords, is_homepage, status)
     VALUES (:slug, :title, :content, :tpl, :st, :sd, :sk, :home, :status)'
);
$ins->execute([
    ':slug'   => 'home',
    ':title'  => 'Home',
    ':content'=> '',
    ':tpl'    => 'default',
    ':st'     => $homeSeo['title'] ?? 'Creative Web Solutions',
    ':sd'     => $homeSeo['description'] ?? '',
    ':sk'     => $homeSeo['keywords'] ?? '',
    ':home'   => 1,
    ':status' => 'published',
]);
$homeId = (int) $db->lastInsertId();

$sections = read_json_file($seedDir . '/homepage-sections-modern.json');
if (!is_array($sections)) {
    $sections = read_json_file($seedDir . '/homepage-sections.json');
}
if (is_array($sections)) {
    $repo->saveHomepageSections($homeId, $sections);
    echo 'Homepage sections: ' . count($sections) . "\n";
}

foreach ($pageTitles as $slug => $title) {
    $block = $pagesContent[$slug] ?? [];
    $seo = $block['seo'] ?? [];
    $ins->execute([
        ':slug'   => $slug,
        ':title'  => $title,
        ':content'=> $block['content'] ?? '',
        ':tpl'    => $block['template'] ?? 'default',
        ':st'     => $seo['title'] ?? $title,
        ':sd'     => $seo['description'] ?? '',
        ':sk'     => $seo['keywords'] ?? '',
        ':home'   => 0,
        ':status' => 'published',
    ]);
    echo "Page: $slug\n";
}

// Homepage services grid → full site pages (classic + Elementor in admin)
$gridLandings = read_json_file($root . '/frontend/src/data/service-landings.json') ?? [];
$gridSeoBodies = read_json_file($seedDir . '/landing-seo-bodies.json') ?? [];
foreach (cws_service_grid_slugs() as $gridSlug) {
    if (!isset($gridLandings[$gridSlug]) || !is_array($gridLandings[$gridSlug])) {
        continue;
    }
    $row = cws_service_grid_page_row($gridSlug, $gridLandings[$gridSlug], $gridSeoBodies[$gridSlug] ?? []);
    $ins->execute([
        ':slug'   => $row['slug'],
        ':title'  => $row['title'],
        ':content'=> $row['content_html'],
        ':tpl'    => $row['template'],
        ':st'     => $row['seo_title'],
        ':sd'     => $row['seo_description'],
        ':sk'     => $row['seo_keywords'],
        ':home'   => 0,
        ':status' => $row['status'],
    ]);
    echo "Service grid page: {$row['slug']}\n";
}

// Service landings
$db->exec('DELETE FROM service_landings');
$landings = read_json_file($root . '/frontend/src/data/service-landings.json') ?? [];
$seoBodies = read_json_file($seedDir . '/landing-seo-bodies.json') ?? [];
$lins = $db->prepare(
    'INSERT INTO service_landings (slug, service_name, page_title, page_description, page_keywords, intro,
     benefits, deliverables, faq, related_slugs, theme, seo_body_html, status)
     VALUES (:slug, :sn, :pt, :pd, :pk, :intro, :b, :d, :f, :r, :t, :seo, :status)'
);
foreach ($landings as $slug => $L) {
    $extra = $seoBodies[$slug] ?? [];
    $faq = $L['faq'] ?? [];
    if (!empty($extra['extraFaq']) && is_array($extra['extraFaq'])) {
        $faq = array_merge($faq, $extra['extraFaq']);
    }
    $lins->execute([
        ':slug'  => $slug,
        ':sn'    => $L['service'] ?? $slug,
        ':pt'    => $L['pageTitle'] ?? $L['service'] ?? $slug,
        ':pd'    => $extra['pageDescription'] ?? $L['pageDescription'] ?? '',
        ':pk'    => $extra['pageKeywords'] ?? $L['pageKeywords'] ?? '',
        ':intro' => $L['intro'] ?? '',
        ':b'     => json_encode($L['benefits'] ?? []),
        ':d'     => json_encode($L['deliverables'] ?? []),
        ':f'     => json_encode($faq),
        ':r'     => json_encode($L['related'] ?? []),
        ':t'     => json_encode($L['theme'] ?? []),
        ':seo'   => $extra['seoBody'] ?? '',
        ':status'=> 'published',
    ]);
}
echo 'Service landings: ' . count($landings) . "\n";

// Services
$db->exec('DELETE FROM services');
$services = read_json_file($root . '/frontend/src/data/service-details.seed.json') ?? [];
$bodyFile = read_json_file($seedDir . '/service-detail-bodies.json') ?? [];
$sins = $db->prepare(
    'INSERT INTO services (slug, title, hero_title, hero_subtitle, price_badge, content_html, features, cta_title, cta_text, seo, status)
     VALUES (:slug, :title, :ht, :hs, :pb, :content, :feat, :ct, :ctx, :seo, :status)'
);
foreach ($services as $slug => $S) {
    $content = $bodyFile[$slug]['content'] ?? $bodyFile[$slug]['long_content'] ?? '';
    $sins->execute([
        ':slug'    => $slug,
        ':title'   => $S['title'] ?? $slug,
        ':ht'      => $S['heroTitle'] ?? '',
        ':hs'      => $S['heroSubtitle'] ?? '',
        ':pb'      => $S['priceBadge'] ?? '',
        ':content' => $content,
        ':feat'    => json_encode($S['features'] ?? []),
        ':ct'      => $S['ctaTitle'] ?? '',
        ':ctx'     => $S['ctaText'] ?? '',
        ':seo'     => json_encode($S['seo'] ?? []),
        ':status'  => 'published',
    ]);
}
echo 'Services: ' . count($services) . "\n";

// Blog
$db->exec('DELETE FROM blog_posts');
$posts = read_json_file($seedDir . '/blog-posts.json') ?? [];
$pins = $db->prepare(
    'INSERT INTO blog_posts (slug, title, excerpt, content_html, featured_image, published_date, seo, status)
     VALUES (:slug, :title, :excerpt, :content, :img, :date, :seo, :status)'
);
foreach ($posts as $post) {
    $pins->execute([
        ':slug'    => $post['slug'],
        ':title'   => $post['title'],
        ':excerpt' => $post['excerpt'] ?? '',
        ':content' => $post['content'] ?? '',
        ':img'     => $post['image'] ?? '',
        ':date'    => $post['date'] ?? date('Y-m-d'),
        ':seo'     => json_encode($post['seo'] ?? []),
        ':status'  => 'published',
    ]);
}
echo 'Blog posts: ' . count($posts) . "\n";

// Portfolio table (migration 010) + items
$migration010 = dirname(__DIR__) . '/database/migrations/010_portfolio_items.sql';
if (is_file($migration010)) {
    $m10 = file_get_contents($migration010);
    foreach (array_filter(array_map('trim', explode(';', $m10))) as $stmt) {
        if ($stmt !== '') {
            try {
                $db->exec($stmt);
            } catch (PDOException $e) {
                if (!str_contains($e->getMessage(), 'already exists')) {
                    echo 'Portfolio migration warn: ' . $e->getMessage() . "\n";
                }
            }
        }
    }
}
$portfolioRows = read_json_file($seedDir . '/portfolio-items.json');
if (is_array($portfolioRows) && $repo->portfolioTableExists()) {
    $db->exec('DELETE FROM portfolio_items');
    foreach ($portfolioRows as $row) {
        if (is_array($row)) {
            $repo->createPortfolioItem($row);
        }
    }
    echo 'Portfolio items: ' . count($portfolioRows) . "\n";
} else {
    echo "Portfolio: skipped (table missing or no seed JSON)\n";
}

echo "\n=== CWS CMS migration complete ===\n";
echo "API: " . cws_config('cms_public_url') . "/api/v1/homepage\n";
echo "Admin: http://localhost" . cws_config('admin_path') . "\n";
