<?php
/**
 * Plugin Name: CWS Headless
 * Description: Headless WordPress backend for Creative Web Solutions (cwsindia.online) — CPTs, CORS, revalidation, ACF, forms.
 * Version: 1.0.0
 * Author: Creative Web Solutions
 */

if (!defined('ABSPATH')) {
    exit;
}

define('CWS_HEADLESS_VERSION', '1.0.0');
define('CWS_HEADLESS_PATH', plugin_dir_path(__FILE__));
define('CWS_HEADLESS_URL', plugin_dir_url(__FILE__));

require_once CWS_HEADLESS_PATH . 'includes/cpts.php';
require_once CWS_HEADLESS_PATH . 'includes/cors.php';
require_once CWS_HEADLESS_PATH . 'includes/revalidate.php';
require_once CWS_HEADLESS_PATH . 'includes/rest-forms.php';
require_once CWS_HEADLESS_PATH . 'includes/acf-fields.php';
require_once CWS_HEADLESS_PATH . 'includes/graphql.php';

add_action('plugins_loaded', function () {
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title' => 'Site Settings',
            'menu_title' => 'Site Settings',
            'menu_slug'  => 'cws-site-settings',
            'capability' => 'edit_posts',
            'redirect'   => false,
        ]);
    }
});

add_filter('acf/settings/save_json', function () {
    return CWS_HEADLESS_PATH . 'acf-json';
});

add_filter('acf/settings/load_json', function ($paths) {
    $paths[] = CWS_HEADLESS_PATH . 'acf-json';
    return $paths;
});

register_activation_hook(__FILE__, function () {
    cws_headless_register_cpts();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function () {
    flush_rewrite_rules();
});
