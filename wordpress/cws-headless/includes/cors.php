<?php

add_action('init', function () {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = apply_filters('cws_headless_allowed_origins', [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://www.cwsindia.online',
        'https://cwsindia.online',
    ]);

    if ($origin && in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(204);
        exit;
    }
}, 1);

add_filter('graphql_response_headers_to_send', function ($headers) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = apply_filters('cws_headless_allowed_origins', [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://www.cwsindia.online',
        'https://cwsindia.online',
    ]);
    if ($origin && in_array($origin, $allowed, true)) {
        $headers['Access-Control-Allow-Origin'] = $origin;
        $headers['Access-Control-Allow-Credentials'] = 'true';
    }
    return $headers;
});
