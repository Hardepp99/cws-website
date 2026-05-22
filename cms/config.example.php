<?php
/**
 * Copy to config.php and adjust for WAMP MySQL.
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
    'site_url'       => 'http://localhost:3000',
    'cms_public_url' => 'http://localhost/cws-website/cms/public',
    'admin_path'     => '/cws-website/cms/admin',
    'session_secret' => 'change-this-to-a-long-random-string',
    'cors_origins'   => ['http://localhost:3000', 'http://127.0.0.1:3000'],
    'upload_dir'     => __DIR__ . '/uploads',
    'upload_url'     => '/cws-website/cms/uploads',
];
