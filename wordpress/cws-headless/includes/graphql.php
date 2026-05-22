<?php

require_once __DIR__ . '/graphql-content.php';

add_action('graphql_register_types', function () {
    if (!function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_field('RootQuery', 'cwsSiteSettings', [
        'type'    => 'String',
        'resolve' => function () {
            if (!function_exists('get_field')) {
                return null;
            }
            $logo = get_field('logo', 'option');
            $logoWhite = get_field('logo_white', 'option');

            return wp_json_encode([
                'phone'          => (string) (get_field('phone', 'option') ?: ''),
                'email'          => (string) (get_field('email', 'option') ?: ''),
                'address'        => cws_headless_decode_text((string) (get_field('address', 'option') ?: '')),
                'logoUrl'        => is_array($logo) ? ($logo['url'] ?? '') : '',
                'logoWhiteUrl'   => is_array($logoWhite) ? ($logoWhite['url'] ?? '') : '',
                'primaryColor'   => get_field('primary_color', 'option') ?: '#1e3a8a',
                'secondaryColor' => get_field('secondary_color', 'option') ?: '#2563eb',
                'footerText'     => cws_headless_decode_text((string) (get_field('footer_text', 'option') ?: '')),
                'facebook'       => (string) (get_field('facebook_url', 'option') ?: ''),
                'linkedin'       => (string) (get_field('linkedin_url', 'option') ?: ''),
                'instagram'           => (string) (get_field('instagram_url', 'option') ?: ''),
                'footerCompanyTitle'  => (string) (get_field('footer_company_title', 'option') ?: 'Company'),
                'footerServicesTitle' => (string) (get_field('footer_services_title', 'option') ?: 'Services'),
                'footerProductsTitle' => cws_headless_decode_text((string) (get_field('footer_products_title', 'option') ?: 'Products & Training')),
            ]);
        },
    ]);

    register_graphql_field('RootQuery', 'cwsHomepage', [
        'type'    => 'String',
        'resolve' => function () {
            $front_id = (int) get_option('page_on_front');
            if (!$front_id) {
                $page = get_page_by_path('home');
                $front_id = $page ? (int) $page->ID : 0;
            }
            if (!$front_id) {
                return null;
            }
            return wp_json_encode(cws_headless_map_page(get_post($front_id)));
        },
    ]);

    register_graphql_field('RootQuery', 'cwsPage', [
        'type'    => 'String',
        'args'    => [
            'slug' => ['type' => 'String'],
        ],
        'resolve' => function ($root, $args) {
            $slug = sanitize_title($args['slug'] ?? '');
            if (!$slug) {
                return null;
            }
            $post = cws_headless_find_post_by_slug($slug, 'page');
            if (!$post) {
                return null;
            }
            return wp_json_encode(cws_headless_map_page($post));
        },
    ]);

    register_graphql_field('RootQuery', 'cwsServiceLanding', [
        'type'    => 'String',
        'args'    => [
            'slug' => ['type' => 'String'],
        ],
        'resolve' => function ($root, $args) {
            $slug = sanitize_title($args['slug'] ?? '');
            if (!$slug) {
                return null;
            }
            $post = cws_headless_find_post_by_slug($slug, 'service_landing');
            if (!$post) {
                return null;
            }
            return wp_json_encode(cws_headless_map_service_landing($post));
        },
    ]);

    register_graphql_field('RootQuery', 'cwsService', [
        'type'    => 'String',
        'args'    => [
            'slug' => ['type' => 'String'],
        ],
        'resolve' => function ($root, $args) {
            $slug = sanitize_title($args['slug'] ?? '');
            if (!$slug) {
                return null;
            }
            $post = cws_headless_find_post_by_slug($slug, 'service');
            if (!$post) {
                return null;
            }
            return wp_json_encode(cws_headless_map_service($post));
        },
    ]);

    register_graphql_field('RootQuery', 'cwsMenus', [
        'type'    => 'String',
        'resolve' => function () {
            return wp_json_encode([
                'primary'         => cws_headless_get_menu_items('primary'),
                'footer'          => cws_headless_get_menu_items('footer'),
                'footerServices'  => cws_headless_get_menu_items('footer_services'),
                'footerProducts'  => cws_headless_get_menu_items('footer_products'),
            ]);
        },
    ]);

    register_graphql_field('RootQuery', 'cwsBlogPosts', [
        'type'    => 'String',
        'resolve' => function () {
            return wp_json_encode(cws_headless_get_blog_posts());
        },
    ]);

    register_graphql_field('RootQuery', 'cwsAllSlugs', [
        'type'    => 'String',
        'resolve' => function () {
            return wp_json_encode(cws_headless_get_all_slugs());
        },
    ]);

    register_graphql_field('RootQuery', 'cwsPricingOptions', [
        'type'    => 'String',
        'resolve' => function () {
            return wp_json_encode(cws_headless_get_pricing_options());
        },
    ]);

    register_graphql_field('RootQuery', 'cwsServiceLandings', [
        'type'    => 'String',
        'resolve' => function () {
            $posts = get_posts([
                'post_type'      => 'service_landing',
                'post_status'    => 'publish',
                'posts_per_page' => -1,
                'orderby'        => 'title',
                'order'          => 'ASC',
            ]);
            $items = array_map(function ($post) {
                return cws_headless_map_service_landing($post);
            }, $posts);

            return wp_json_encode($items);
        },
    ]);
});
