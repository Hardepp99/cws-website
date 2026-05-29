<?php

declare(strict_types=1);

define('CWS_CMS_ROOT', __DIR__);

$configFile = CWS_CMS_ROOT . '/config.php';
if (!is_file($configFile)) {
    $configFile = CWS_CMS_ROOT . '/config.example.php';
}
/** @var array<string, mixed> $CWS_CONFIG */
$CWS_CONFIG = require $configFile;

// Optional env overrides (production / Docker) — see docs/PRODUCTION_DEPLOY.md
if ($v = getenv('CWS_SITE_URL')) {
    $CWS_CONFIG['site_url'] = $v;
}
if ($v = getenv('CWS_CMS_PUBLIC_URL')) {
    $CWS_CONFIG['cms_public_url'] = $v;
}
$corsEnv = getenv('CWS_CORS_ORIGINS');
if ($corsEnv !== false && $corsEnv !== '') {
    $CWS_CONFIG['cors_origins'] = array_values(array_filter(array_map('trim', explode(',', $corsEnv))));
}

$placesKey = getenv('GOOGLE_PLACES_API_KEY');
if ($placesKey && empty($CWS_CONFIG['google']['places_api_key'])) {
    $CWS_CONFIG['google']['places_api_key'] = $placesKey;
}
$googleOauthId = getenv('GOOGLE_OAUTH_CLIENT_ID');
if ($googleOauthId && empty($CWS_CONFIG['google']['oauth_client_id'])) {
    $CWS_CONFIG['google']['oauth_client_id'] = $googleOauthId;
}

// Composer autoloader (for PHPMailer and future libraries)
$composerAutoload = CWS_CMS_ROOT . '/vendor/autoload.php';
if (is_file($composerAutoload)) {
    require_once $composerAutoload;
}

require_once CWS_CMS_ROOT . '/src/Database.php';
require_once CWS_CMS_ROOT . '/src/Http.php';
require_once CWS_CMS_ROOT . '/src/AdminListQuery.php';
require_once CWS_CMS_ROOT . '/src/ContentRepository.php';
require_once CWS_CMS_ROOT . '/src/Auth.php';
require_once CWS_CMS_ROOT . '/src/AdminActivityLog.php';
require_once CWS_CMS_ROOT . '/src/AdminAuth.php';
require_once CWS_CMS_ROOT . '/src/AdminUsers.php';
require_once CWS_CMS_ROOT . '/src/MediaRepository.php';
require_once CWS_CMS_ROOT . '/src/MediaService.php';
require_once CWS_CMS_ROOT . '/src/DesimentorRepository.php';
require_once CWS_CMS_ROOT . '/src/GmbPlacesClient.php';
require_once CWS_CMS_ROOT . '/src/SmtpMailer.php';
require_once CWS_CMS_ROOT . '/src/CrmInbox.php';
require_once CWS_CMS_ROOT . '/src/MemberAuth.php';
require_once CWS_CMS_ROOT . '/src/CommunityRepository.php';
require_once CWS_CMS_ROOT . '/src/AdminApi.php';

function cws_config(string $key, mixed $default = null): mixed
{
    global $CWS_CONFIG;
    $parts = explode('.', $key);
    $val = $CWS_CONFIG;
    foreach ($parts as $part) {
        if (!is_array($val) || !array_key_exists($part, $val)) {
            return $default;
        }
        $val = $val[$part];
    }
    return $val;
}

function cws_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $pdo = Database::connect([
        'host'     => (string) cws_config('db.host', '127.0.0.1'),
        'port'     => (int) cws_config('db.port', 3306),
        'name'     => (string) cws_config('db.name', 'cws_cms'),
        'user'     => (string) cws_config('db.user', 'root'),
        'password' => (string) cws_config('db.password', ''),
        'charset'  => (string) cws_config('db.charset', 'utf8mb4'),
    ]);
    return $pdo;
}

function cws_repo(): ContentRepository
{
    static $repo = null;
    if (!$repo) {
        $repo = new ContentRepository(cws_db());
    }
    return $repo;
}
