<?php
/**
 * Copy to config.php and set URLs for your host (any domain or subdirectory).
 *
 * Environment overrides (optional, for production without editing this file):
 *   CWS_SITE_URL          — public Next.js URL (https://example.com)
 *   CWS_CMS_PUBLIC_URL    — public CMS API base (https://example.com/cms/public)
 *   CWS_CORS_ORIGINS      — comma-separated browser origins allowed for CORS
 *   GOOGLE_PLACES_API_KEY — Google Places API key
 */
return [
    'db' => [
        'host'     => '127.0.0.1',
        'port'     => 3306,
        'name'     => 'cws_cms',
        'user'     => 'root',
        'password' => '',
        'charset'  => 'utf8mb4',
    ],
    /** Public Next.js site — used for admin “View site” links */
    'site_url'       => 'http://localhost:3000',
    /**
     * Public URL of this CMS (scheme + host + path to cms/public).
     * Must match what browsers use for /api/v1/media/... image URLs.
     */
    'cms_public_url' => 'http://localhost/cws-website/cms/public',
    'admin_path'     => '/cws-website/cms/admin',
    'session_secret' => 'change-this-to-a-long-random-string',
    /** Origins allowed to call the CMS API from the browser (usually your Next.js URL only) */
    'cors_origins'   => ['http://localhost:3000', 'http://127.0.0.1:3000'],
    'upload_dir'     => __DIR__ . '/uploads',
    'upload_url'     => '/cws-website/cms/uploads',
    'google'         => [
        'places_api_key'   => '',
        /** Google Sign-In (members) — OAuth 2.0 Web client ID */
        'oauth_client_id'  => '',
    ],
];
