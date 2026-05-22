<?php

function cws_headless_register_cpts(): void
{
    register_post_type('service_landing', [
        'labels' => [
            'name'          => 'Service Landings',
            'singular_name' => 'Service Landing',
        ],
        'public'       => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'ServiceLanding',
        'graphql_plural_name' => 'ServiceLandings',
        'menu_icon'    => 'dashicons-location-alt',
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'rewrite'      => ['slug' => 'service-landing', 'with_front' => false],
        'has_archive'  => false,
    ]);

    register_post_type('service', [
        'labels' => [
            'name'          => 'Services',
            'singular_name' => 'Service',
        ],
        'public'       => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'Service',
        'graphql_plural_name' => 'Services',
        'menu_icon'    => 'dashicons-admin-tools',
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'rewrite'      => ['slug' => 'service', 'with_front' => false],
        'has_archive'  => true,
    ]);

    register_post_type('course', [
        'labels' => [
            'name'          => 'Courses',
            'singular_name' => 'Course',
        ],
        'public'       => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'Course',
        'graphql_plural_name' => 'Courses',
        'menu_icon'    => 'dashicons-welcome-learn-more',
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'rewrite'      => ['slug' => 'course', 'with_front' => false],
        'has_archive'  => true,
    ]);

    register_post_type('portfolio_item', [
        'labels' => [
            'name'          => 'Portfolio',
            'singular_name' => 'Portfolio Item',
        ],
        'public'       => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'PortfolioItem',
        'graphql_plural_name' => 'PortfolioItems',
        'menu_icon'    => 'dashicons-portfolio',
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
        'rewrite'      => ['slug' => 'portfolio-item', 'with_front' => false],
        'has_archive'  => true,
    ]);

    register_post_type('form_submission', [
        'labels' => [
            'name'          => 'Form Submissions',
            'singular_name' => 'Form Submission',
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-email',
        'supports'     => ['title', 'custom-fields'],
        'capability_type' => 'post',
    ]);
}

add_action('init', 'cws_headless_register_cpts');

add_action('init', function () {
    register_nav_menus([
        'primary'          => __('Primary Menu', 'cws-headless'),
        'footer'           => __('Footer Company', 'cws-headless'),
        'footer_services'  => __('Footer Services', 'cws-headless'),
        'footer_products'  => __('Footer Products & Training', 'cws-headless'),
    ]);
}, 20);
