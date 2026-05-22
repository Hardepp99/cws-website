<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

Auth::startSession();
$repo = cws_repo();
$page = $_GET['page'] ?? 'dashboard';
$notice = '';
$error = '';

if ($page === 'logout') {
    Auth::logout();
    header('Location: ?page=login');
    exit;
}

if ($page === 'login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $user = trim($_POST['username'] ?? '');
        $pass = $_POST['password'] ?? '';
        if (Auth::login($user, $pass)) {
            header('Location: ?page=dashboard');
            exit;
        }
        $error = 'Invalid username or password.';
    }
    if (Auth::check()) {
        header('Location: ?page=dashboard');
        exit;
    }
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Log In — CWS CMS</title>
  <link rel="stylesheet" href="assets/admin.css" />
</head>
<body class="cws-admin">
  <div class="cws-login-wrap">
    <form class="cws-login-box" method="post">
      <h1>CWS CMS</h1>
      <?php if ($error): ?><div class="cws-notice error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
      <label>Username</label>
      <input type="text" name="username" required autofocus />
      <label>Password</label>
      <input type="password" name="password" required />
      <p style="margin-top:16px"><button type="submit" class="cws-btn" style="width:100%">Log In</button></p>
    </form>
  </div>
</body>
</html>
    <?php
    exit;
}

Auth::requireLogin();

function admin_layout(string $title, string $active, string $body): void
{
    $menu = [
        'dashboard' => 'Dashboard',
        'homepage'  => 'Homepage',
        'pages'     => 'Pages',
        'landings'  => 'Service Landings',
        'menus'     => 'Menus',
        'settings'  => 'Site Settings',
        'pricing'   => 'Ask Price Options',
        'forms'     => 'Form Submissions',
    ];
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><?= htmlspecialchars($title) ?> — CWS CMS</title>
  <link rel="stylesheet" href="assets/admin.css" />
  <script src="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"></script>
</head>
<body class="cws-admin">
  <div class="cws-admin-wrap">
    <aside class="cws-admin-sidebar">
      <div class="cws-admin-brand">Creative Web Solutions</div>
      <ul class="cws-admin-menu">
        <?php foreach ($menu as $key => $label): ?>
          <li><a href="?page=<?= $key ?>" class="<?= $active === $key ? 'active' : '' ?>"><?= htmlspecialchars($label) ?></a></li>
        <?php endforeach; ?>
      </ul>
    </aside>
    <div class="cws-admin-main">
      <div class="cws-admin-topbar">
        <strong><?= htmlspecialchars($title) ?></strong>
        <span>
          <?= htmlspecialchars(Auth::displayName()) ?> ·
          <a href="<?= htmlspecialchars(cws_config('site_url', 'http://localhost:3000')) ?>" target="_blank">View site</a> ·
          <a href="?page=logout">Log out</a>
        </span>
      </div>
      <div class="cws-admin-content">
        <?= $body ?>
      </div>
    </div>
  </div>
  <script>
    if (document.querySelector('.wysiwyg')) {
      tinymce.init({
        selector: '.wysiwyg',
        height: 420,
        menubar: false,
        plugins: 'lists link code table',
        toolbar: 'undo redo | blocks | bold italic | bullist numlist | link | code',
      });
    }
  </script>
</body>
</html>
    <?php
}

// POST handlers
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($page === 'settings' && isset($_POST['settings_json'])) {
        $data = json_decode($_POST['settings_json'], true);
        if ($data) {
            $repo->saveSiteSettings($data);
            $notice = 'Site settings saved.';
        } else {
            $error = 'Invalid JSON.';
        }
    }
    if ($page === 'homepage' && isset($_POST['sections_json'])) {
        $home = $repo->getPageById((int) ($_POST['page_id'] ?? 0));
        if (!$home) {
            $hp = cws_db()->query("SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1")->fetch();
            $home = $hp ? ['id' => $hp['id']] : null;
        }
        $sections = json_decode($_POST['sections_json'], true);
        if ($home && is_array($sections)) {
            $repo->saveHomepageSections((int) $home['id'], $sections);
            $notice = 'Homepage sections saved (' . count($sections) . ' blocks).';
        } else {
            $error = 'Invalid sections JSON.';
        }
    }
    if ($page === 'page-edit' && isset($_POST['page_id'])) {
        $repo->savePage((int) $_POST['page_id'], [
            'title'            => $_POST['title'] ?? '',
            'content_html'     => $_POST['content_html'] ?? '',
            'template'         => $_POST['template'] ?? 'default',
            'seo_title'        => $_POST['seo_title'] ?? '',
            'seo_description'  => $_POST['seo_description'] ?? '',
            'seo_keywords'     => $_POST['seo_keywords'] ?? '',
            'status'           => $_POST['status'] ?? 'published',
        ]);
        $notice = 'Page saved.';
        $page = 'pages';
    }
    if ($page === 'landing-edit' && isset($_POST['landing_id'])) {
        $benefits = array_values(array_filter(array_map('trim', explode("\n", $_POST['benefits'] ?? ''))));
        $deliverables = array_values(array_filter(array_map('trim', explode("\n", $_POST['deliverables'] ?? ''))));
        $related = array_values(array_filter(array_map('trim', explode(',', $_POST['related'] ?? ''))));
        $faqRaw = json_decode($_POST['faq_json'] ?? '[]', true);
        $repo->saveLanding((int) $_POST['landing_id'], [
            'service_name'     => $_POST['service_name'] ?? '',
            'page_title'       => $_POST['page_title'] ?? '',
            'page_description' => $_POST['page_description'] ?? '',
            'page_keywords'    => $_POST['page_keywords'] ?? '',
            'intro'            => $_POST['intro'] ?? '',
            'benefits'         => $benefits,
            'deliverables'     => $deliverables,
            'faq'              => is_array($faqRaw) ? $faqRaw : [],
            'related_slugs'    => $related,
            'theme'            => [
                'start'  => $_POST['theme_start'] ?? '#1e3a8a',
                'mid'    => $_POST['theme_mid'] ?? '#2563eb',
                'end'    => $_POST['theme_end'] ?? '#3b82f6',
                'accent' => $_POST['theme_accent'] ?? '#93c5fd',
                'icon'   => $_POST['theme_icon'] ?? 'fas fa-briefcase',
                'badge'  => $_POST['theme_badge'] ?? '',
            ],
            'seo_body_html'    => $_POST['seo_body_html'] ?? '',
            'status'           => $_POST['status'] ?? 'published',
        ]);
        $notice = 'Landing saved.';
        $page = 'landings';
    }
    if ($page === 'menus' && isset($_POST['menu_key'], $_POST['menu_json'])) {
        $items = json_decode($_POST['menu_json'], true);
        if (is_array($items)) {
            $repo->saveMenu($_POST['menu_key'], $items);
            $notice = 'Menu saved.';
        } else {
            $error = 'Invalid menu JSON.';
        }
    }
    if ($page === 'pricing' && isset($_POST['pricing_json'])) {
        $data = json_decode($_POST['pricing_json'], true);
        if ($data) {
            $repo->savePricingOptions($data);
            $notice = 'Pricing options saved.';
        } else {
            $error = 'Invalid JSON.';
        }
    }
}

ob_start();
if ($notice) {
    echo '<div class="cws-notice">' . htmlspecialchars($notice) . '</div>';
}
if ($error) {
    echo '<div class="cws-notice error">' . htmlspecialchars($error) . '</div>';
}

switch ($page) {
    case 'dashboard':
        $counts = [
            'pages'    => count($repo->getAllPages()),
            'landings' => count($repo->getAllLandingsAdmin()),
            'forms'    => count($repo->getFormSubmissions(200)),
        ];
        ?>
        <div class="cws-card">
          <h2>Welcome</h2>
          <p>Manage website content for the Next.js frontend. Data is stored in MySQL (<code><?= htmlspecialchars((string) cws_config('db.name')) ?></code>).</p>
          <ul>
            <li><?= (int) $counts['pages'] ?> pages</li>
            <li><?= (int) $counts['landings'] ?> service landings</li>
            <li><?= (int) $counts['forms'] ?> form submissions</li>
          </ul>
          <p><a class="cws-btn" href="?page=homepage">Edit homepage sections</a></p>
        </div>
        <?php
        break;

    case 'homepage':
        $homeRow = cws_db()->query('SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1')->fetch();
        $sections = $homeRow ? $repo->getHomepageSections((int) $homeRow['id']) : [];
        $json = json_encode($sections, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        ?>
        <div class="cws-card">
          <h2>Homepage sections</h2>
          <p>Slider, services grid, FAQ, and other blocks. Each object needs <code>acfFcLayout</code> (e.g. <code>hero_slider</code>, <code>faq</code>, <code>seo_rich</code>). Re-order array to change order on site.</p>
          <form method="post" class="cws-form">
            <input type="hidden" name="page_id" value="<?= (int) ($homeRow['id'] ?? 0) ?>" />
            <textarea class="code" name="sections_json"><?= htmlspecialchars($json ?: '[]') ?></textarea>
            <p><button type="submit" class="cws-btn">Save homepage</button></p>
          </form>
        </div>
        <?php
        break;

    case 'pages':
        if (isset($_GET['edit'])) {
            $p = $repo->getPageById((int) $_GET['edit']);
            if ($p) {
                ?>
                <div class="cws-card">
                  <h2>Edit: <?= htmlspecialchars($p['title']) ?></h2>
                  <form method="post" class="cws-form" action="?page=page-edit">
                    <input type="hidden" name="page_id" value="<?= (int) $p['id'] ?>" />
                    <label>Title</label>
                    <input type="text" name="title" value="<?= htmlspecialchars($p['title']) ?>" />
                    <label>Template</label>
                    <select name="template">
                      <?php foreach (['default', 'services', 'contact'] as $tpl): ?>
                        <option value="<?= $tpl ?>" <?= ($p['template'] ?? '') === $tpl ? 'selected' : '' ?>><?= $tpl ?></option>
                      <?php endforeach; ?>
                    </select>
                    <label>Content (HTML)</label>
                    <textarea class="wysiwyg" name="content_html"><?= htmlspecialchars($p['content_html'] ?? '') ?></textarea>
                    <label>SEO Title</label>
                    <input type="text" name="seo_title" value="<?= htmlspecialchars($p['seo_title'] ?? '') ?>" />
                    <label>SEO Description</label>
                    <textarea name="seo_description" rows="3"><?= htmlspecialchars($p['seo_description'] ?? '') ?></textarea>
                    <label>SEO Keywords</label>
                    <input type="text" name="seo_keywords" value="<?= htmlspecialchars($p['seo_keywords'] ?? '') ?>" />
                    <label>Status</label>
                    <select name="status">
                      <option value="published" <?= ($p['status'] ?? '') === 'published' ? 'selected' : '' ?>>Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <p><button type="submit" class="cws-btn">Update page</button>
                    <a class="cws-btn cws-btn-secondary" href="?page=pages">Cancel</a></p>
                  </form>
                </div>
                <?php
                break;
            }
        }
        ?>
        <div class="cws-card">
          <h2>Pages</h2>
          <table class="cws-table">
            <thead><tr><th>Title</th><th>Slug</th><th></th></tr></thead>
            <tbody>
            <?php foreach ($repo->getAllPages() as $p): ?>
              <tr>
                <td><?= htmlspecialchars($p['title']) ?><?= $p['is_homepage'] ? ' (Home)' : '' ?></td>
                <td><code>/<?= htmlspecialchars($p['slug'] === 'home' ? '' : $p['slug']) ?></code></td>
                <td>
                  <?php if ($p['is_homepage']): ?>
                    <a href="?page=homepage">Sections</a>
                  <?php else: ?>
                    <a href="?page=pages&edit=<?= (int) $p['id'] ?>">Edit</a>
                  <?php endif; ?>
                </td>
              </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>
        <?php
        break;

    case 'landings':
        if (isset($_GET['edit'])) {
            $L = $repo->getLandingById((int) $_GET['edit']);
            if ($L) {
                $faq = json_encode(json_decode($L['faq'] ?? '[]', true) ?: [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                $theme = json_decode($L['theme'] ?? '{}', true) ?: [];
                ?>
                <div class="cws-card">
                  <h2><?= htmlspecialchars($L['service_name']) ?></h2>
                  <form method="post" class="cws-form" action="?page=landing-edit">
                    <input type="hidden" name="landing_id" value="<?= (int) $L['id'] ?>" />
                    <label>Service name</label><input type="text" name="service_name" value="<?= htmlspecialchars($L['service_name']) ?>" />
                    <label>Page title (SEO)</label><input type="text" name="page_title" value="<?= htmlspecialchars($L['page_title']) ?>" />
                    <label>Meta description</label><textarea name="page_description" rows="2"><?= htmlspecialchars($L['page_description'] ?? '') ?></textarea>
                    <label>Keywords</label><input type="text" name="page_keywords" value="<?= htmlspecialchars($L['page_keywords'] ?? '') ?>" />
                    <label>Intro</label><textarea name="intro" rows="3"><?= htmlspecialchars($L['intro'] ?? '') ?></textarea>
                    <label>Benefits (one per line)</label><textarea name="benefits" rows="5"><?= htmlspecialchars(implode("\n", json_decode($L['benefits'] ?? '[]', true) ?: [])) ?></textarea>
                    <label>Deliverables (one per line)</label><textarea name="deliverables" rows="5"><?= htmlspecialchars(implode("\n", json_decode($L['deliverables'] ?? '[]', true) ?: [])) ?></textarea>
                    <label>Related slugs (comma-separated)</label><input type="text" name="related" value="<?= htmlspecialchars(implode(', ', json_decode($L['related_slugs'] ?? '[]', true) ?: [])) ?>" />
                    <label>FAQ (JSON array)</label><textarea class="code" name="faq_json" style="min-height:120px"><?= htmlspecialchars($faq) ?></textarea>
                    <label>Long SEO body (HTML)</label><textarea class="wysiwyg" name="seo_body_html"><?= htmlspecialchars($L['seo_body_html'] ?? '') ?></textarea>
                    <h3>Theme</h3>
                    <label>Badge</label><input type="text" name="theme_badge" value="<?= htmlspecialchars($theme['badge'] ?? '') ?>" />
                    <label>Icon class</label><input type="text" name="theme_icon" value="<?= htmlspecialchars($theme['icon'] ?? '') ?>" />
                    <label>Colors</label>
                    <input type="text" name="theme_start" placeholder="start" value="<?= htmlspecialchars($theme['start'] ?? '') ?>" />
                    <input type="text" name="theme_mid" placeholder="mid" value="<?= htmlspecialchars($theme['mid'] ?? '') ?>" />
                    <input type="text" name="theme_end" placeholder="end" value="<?= htmlspecialchars($theme['end'] ?? '') ?>" />
                    <input type="text" name="theme_accent" placeholder="accent" value="<?= htmlspecialchars($theme['accent'] ?? '') ?>" />
                    <p><button type="submit" class="cws-btn">Save landing</button></p>
                  </form>
                </div>
                <?php
                break;
            }
        }
        ?>
        <div class="cws-card">
          <h2>Service landings</h2>
          <table class="cws-table">
            <thead><tr><th>Service</th><th>Slug</th><th></th></tr></thead>
            <tbody>
            <?php foreach ($repo->getAllLandingsAdmin() as $row): ?>
              <tr>
                <td><?= htmlspecialchars($row['service_name']) ?></td>
                <td><code>/<?= htmlspecialchars($row['slug']) ?></code></td>
                <td><a href="?page=landings&edit=<?= (int) $row['id'] ?>">Edit</a></td>
              </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>
        <?php
        break;

    case 'menus':
        $menuKey = $_GET['menu'] ?? 'primary';
        $menus = $repo->getMenus();
        $keys = ['primary' => 'primary', 'footer' => 'footer', 'footerServices' => 'footer_services', 'footerProducts' => 'footer_products'];
        $dbKey = $keys[$menuKey] ?? 'primary';
        $items = $menus[$menuKey] ?? [];
        ?>
        <div class="cws-card">
          <h2>Menus</h2>
          <p>
            <?php foreach (array_keys($keys) as $k): ?>
              <a href="?page=menus&menu=<?= $k ?>" class="cws-btn <?= $k === $menuKey ? '' : 'cws-btn-secondary' ?>" style="margin-right:6px"><?= $k ?></a>
            <?php endforeach; ?>
          </p>
          <form method="post" class="cws-form">
            <input type="hidden" name="menu_key" value="<?= htmlspecialchars($dbKey) ?>" />
            <textarea class="code" name="menu_json"><?= htmlspecialchars(json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) ?></textarea>
            <p><button type="submit" class="cws-btn">Save menu</button></p>
          </form>
        </div>
        <?php
        break;

    case 'settings':
        $settings = $repo->getSiteSettings();
        ?>
        <div class="cws-card">
          <h2>Site settings</h2>
          <form method="post" class="cws-form">
            <textarea class="code" name="settings_json"><?= htmlspecialchars(json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) ?></textarea>
            <p><button type="submit" class="cws-btn">Save settings</button></p>
          </form>
        </div>
        <?php
        break;

    case 'pricing':
        $pricing = $repo->getPricingOptions();
        ?>
        <div class="cws-card">
          <h2>Ask price form options</h2>
          <form method="post" class="cws-form">
            <textarea class="code" name="pricing_json"><?= htmlspecialchars(json_encode($pricing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) ?></textarea>
            <p><button type="submit" class="cws-btn">Save</button></p>
          </form>
        </div>
        <?php
        break;

    case 'forms':
        ?>
        <div class="cws-card">
          <h2>Form submissions</h2>
          <table class="cws-table">
            <thead><tr><th>Date</th><th>Type</th><th>Data</th></tr></thead>
            <tbody>
            <?php foreach ($repo->getFormSubmissions(100) as $f): ?>
              <tr>
                <td><?= htmlspecialchars($f['created_at']) ?></td>
                <td><?= htmlspecialchars($f['form_type']) ?></td>
                <td><pre style="white-space:pre-wrap;font-size:11px;margin:0"><?= htmlspecialchars($f['payload']) ?></pre></td>
              </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>
        <?php
        break;

    default:
        echo '<p>Unknown page.</p>';
}

$body = ob_get_clean();
admin_layout('CWS CMS', $page, $body);
