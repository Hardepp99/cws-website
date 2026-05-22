<?php

/**
 * Registers ACF field groups programmatically when ACF is active.
 * JSON files in acf-json/ are the source of truth for sync in WP admin.
 */

add_action('acf/include_fields', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    // Site Settings (Options)
    acf_add_local_field_group([
        'key'    => 'group_cws_site_settings',
        'title'  => 'Site Settings',
        'fields' => [
            ['key' => 'field_cws_phone', 'label' => 'Phone', 'name' => 'phone', 'type' => 'text', 'default_value' => '+91-7015969967'],
            ['key' => 'field_cws_email', 'label' => 'Email', 'name' => 'email', 'type' => 'email', 'default_value' => 'info@cwsindia.online'],
            ['key' => 'field_cws_address', 'label' => 'Address', 'name' => 'address', 'type' => 'textarea'],
            ['key' => 'field_cws_logo', 'label' => 'Logo', 'name' => 'logo', 'type' => 'image', 'return_format' => 'array'],
            ['key' => 'field_cws_logo_white', 'label' => 'Logo White', 'name' => 'logo_white', 'type' => 'image', 'return_format' => 'array'],
            ['key' => 'field_cws_primary', 'label' => 'Primary Color', 'name' => 'primary_color', 'type' => 'color_picker', 'default_value' => '#1e3a8a'],
            ['key' => 'field_cws_secondary', 'label' => 'Secondary Color', 'name' => 'secondary_color', 'type' => 'color_picker', 'default_value' => '#2563eb'],
            ['key' => 'field_cws_footer', 'label' => 'Footer Text', 'name' => 'footer_text', 'type' => 'textarea'],
            ['key' => 'field_cws_fb', 'label' => 'Facebook URL', 'name' => 'facebook_url', 'type' => 'url'],
            ['key' => 'field_cws_li', 'label' => 'LinkedIn URL', 'name' => 'linkedin_url', 'type' => 'url'],
            ['key' => 'field_cws_ig', 'label' => 'Instagram URL', 'name' => 'instagram_url', 'type' => 'url'],
            ['key' => 'field_cws_footer_company_title', 'label' => 'Footer Company Column Title', 'name' => 'footer_company_title', 'type' => 'text', 'default_value' => 'Company'],
            ['key' => 'field_cws_footer_services_title', 'label' => 'Footer Services Column Title', 'name' => 'footer_services_title', 'type' => 'text', 'default_value' => 'Services'],
            ['key' => 'field_cws_footer_products_title', 'label' => 'Footer Products Column Title', 'name' => 'footer_products_title', 'type' => 'text', 'default_value' => 'Products & Training'],
            [
                'key'          => 'field_cws_pricing_bundles',
                'label'        => 'Ask Price — Package bundles',
                'name'         => 'pricing_bundles',
                'type'         => 'repeater',
                'instructions' => 'Shown first in the Request pricing form.',
                'sub_fields'   => [
                    ['key' => 'field_pb_id', 'label' => 'Bundle ID', 'name' => 'bundle_id', 'type' => 'text'],
                    ['key' => 'field_pb_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text'],
                    ['key' => 'field_pb_summary', 'label' => 'Summary', 'name' => 'summary', 'type' => 'textarea'],
                    ['key' => 'field_pb_includes', 'label' => 'Includes (one per line)', 'name' => 'includes', 'type' => 'textarea'],
                ],
            ],
            [
                'key'          => 'field_cws_pricing_budget',
                'label'        => 'Ask Price — Budget ranges',
                'name'         => 'pricing_budget_ranges',
                'type'         => 'repeater',
                'sub_fields'   => [
                    ['key' => 'field_pbr_value', 'label' => 'Value', 'name' => 'value', 'type' => 'text'],
                    ['key' => 'field_pbr_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text'],
                ],
            ],
            [
                'key'          => 'field_cws_pricing_timeline',
                'label'        => 'Ask Price — Timelines',
                'name'         => 'pricing_timelines',
                'type'         => 'repeater',
                'sub_fields'   => [
                    ['key' => 'field_pt_value', 'label' => 'Value', 'name' => 'value', 'type' => 'text'],
                    ['key' => 'field_pt_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text'],
                ],
            ],
        ],
        'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'cws-site-settings']]],
    ]);

    // Service Landing fields
    acf_add_local_field_group([
        'key'    => 'group_cws_service_landing',
        'title'  => 'Service Landing SEO',
        'fields' => cws_headless_service_landing_fields(),
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'service_landing']]],
    ]);

    // Service detail fields
    acf_add_local_field_group([
        'key'    => 'group_cws_service_detail',
        'title'  => 'Service Detail',
        'fields' => cws_headless_service_detail_fields(),
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'service']]],
    ]);

    // Homepage flexible content on front page
    acf_add_local_field_group([
        'key'    => 'group_cws_homepage',
        'title'  => 'Homepage Sections',
        'fields' => [
            [
                'key'          => 'field_cws_home_sections',
                'label'        => 'Sections',
                'name'         => 'homepage_sections',
                'type'         => 'flexible_content',
                'layouts'      => cws_headless_homepage_layouts(),
                'button_label' => 'Add Section',
            ],
        ],
        'location' => [
            [['param' => 'page_type', 'operator' => '==', 'value' => 'front_page']],
            [['param' => 'page_template', 'operator' => '==', 'value' => 'default']],
        ],
    ]);

    acf_add_local_field_group([
        'key'    => 'group_cws_page_meta',
        'title'  => 'Page SEO & Template',
        'fields' => [
            [
                'key'           => 'field_cws_page_template',
                'label'         => 'Frontend Template',
                'name'          => 'page_template',
                'type'          => 'select',
                'choices'       => [
                    'default'  => 'Default',
                    'services' => 'Services listing',
                    'contact'  => 'Contact',
                ],
                'default_value' => 'default',
            ],
            ['key' => 'field_cws_page_seo_title', 'label' => 'SEO Title', 'name' => 'seo_title', 'type' => 'text'],
            ['key' => 'field_cws_page_seo_desc', 'label' => 'SEO Description', 'name' => 'seo_description', 'type' => 'textarea'],
            ['key' => 'field_cws_page_seo_keywords', 'label' => 'SEO Keywords', 'name' => 'seo_keywords', 'type' => 'text'],
        ],
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'page']]],
    ]);
});

function cws_headless_service_landing_fields(): array
{
    return [
        ['key' => 'field_sl_service', 'label' => 'Service Name', 'name' => 'service_name', 'type' => 'text'],
        ['key' => 'field_sl_intro', 'label' => 'Intro', 'name' => 'intro', 'type' => 'textarea'],
        ['key' => 'field_sl_meta_title', 'label' => 'SEO Title', 'name' => 'seo_title', 'type' => 'text'],
        ['key' => 'field_sl_meta_desc', 'label' => 'SEO Description', 'name' => 'seo_description', 'type' => 'textarea'],
        ['key' => 'field_sl_keywords', 'label' => 'SEO Keywords', 'name' => 'seo_keywords', 'type' => 'text'],
        ['key' => 'field_sl_benefits', 'label' => 'Benefits', 'name' => 'benefits', 'type' => 'textarea', 'instructions' => 'One per line'],
        ['key' => 'field_sl_deliverables', 'label' => 'Deliverables', 'name' => 'deliverables', 'type' => 'textarea', 'instructions' => 'One per line'],
        ['key' => 'field_sl_faq', 'label' => 'FAQ', 'name' => 'faq', 'type' => 'repeater', 'sub_fields' => [
            ['key' => 'field_sl_faq_q', 'label' => 'Question', 'name' => 'question', 'type' => 'text'],
            ['key' => 'field_sl_faq_a', 'label' => 'Answer', 'name' => 'answer', 'type' => 'textarea'],
        ]],
        ['key' => 'field_sl_related', 'label' => 'Related Slugs', 'name' => 'related_slugs', 'type' => 'text', 'instructions' => 'Comma-separated slugs'],
        ['key' => 'field_sl_theme_start', 'label' => 'Theme Start', 'name' => 'theme_start', 'type' => 'color_picker'],
        ['key' => 'field_sl_theme_mid', 'label' => 'Theme Mid', 'name' => 'theme_mid', 'type' => 'color_picker'],
        ['key' => 'field_sl_theme_end', 'label' => 'Theme End', 'name' => 'theme_end', 'type' => 'color_picker'],
        ['key' => 'field_sl_theme_accent', 'label' => 'Theme Accent', 'name' => 'theme_accent', 'type' => 'color_picker'],
        ['key' => 'field_sl_icon', 'label' => 'Icon Class', 'name' => 'icon_class', 'type' => 'text', 'default_value' => 'fas fa-briefcase'],
        ['key' => 'field_sl_badge', 'label' => 'Badge Text', 'name' => 'badge_text', 'type' => 'text'],
        ['key' => 'field_sl_seo_body', 'label' => 'SEO Body (long-form HTML)', 'name' => 'seo_body', 'type' => 'wysiwyg'],
    ];
}

function cws_headless_service_detail_fields(): array
{
    return [
        ['key' => 'field_sd_hero_title', 'label' => 'Hero Title', 'name' => 'hero_title', 'type' => 'text'],
        ['key' => 'field_sd_hero_subtitle', 'label' => 'Hero Subtitle', 'name' => 'hero_subtitle', 'type' => 'textarea'],
        ['key' => 'field_sd_price_badge', 'label' => 'Price Badge', 'name' => 'price_badge', 'type' => 'text'],
        ['key' => 'field_sd_features', 'label' => 'Features', 'name' => 'features', 'type' => 'repeater', 'sub_fields' => [
            ['key' => 'field_sd_feat_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
            ['key' => 'field_sd_feat_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
            ['key' => 'field_sd_feat_icon', 'label' => 'Icon', 'name' => 'icon', 'type' => 'text'],
        ]],
        ['key' => 'field_sd_cta_title', 'label' => 'CTA Title', 'name' => 'cta_title', 'type' => 'text'],
        ['key' => 'field_sd_cta_text', 'label' => 'CTA Text', 'name' => 'cta_text', 'type' => 'textarea'],
        ['key' => 'field_sd_long_content', 'label' => 'Long Content (SEO HTML)', 'name' => 'long_content', 'type' => 'wysiwyg'],
        ['key' => 'field_sd_seo_title', 'label' => 'SEO Title', 'name' => 'seo_title', 'type' => 'text'],
        ['key' => 'field_sd_seo_desc', 'label' => 'SEO Description', 'name' => 'seo_description', 'type' => 'textarea'],
        ['key' => 'field_sd_seo_keywords', 'label' => 'SEO Keywords', 'name' => 'seo_keywords', 'type' => 'text'],
    ];
}

function cws_headless_homepage_layouts(): array
{
    $textFields = function (string $prefix): array {
        return [
            ['key' => "field_{$prefix}_badge", 'label' => 'Badge', 'name' => 'badge', 'type' => 'text'],
            ['key' => "field_{$prefix}_title", 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
            ['key' => "field_{$prefix}_subtitle", 'label' => 'Subtitle', 'name' => 'subtitle', 'type' => 'textarea'],
            ['key' => "field_{$prefix}_content", 'label' => 'Content', 'name' => 'content', 'type' => 'wysiwyg'],
        ];
    };

    $layouts = [
        'hero_slider' => 'Hero Slider',
        'trust_badges' => 'Trust Badges',
        'services_marquee' => 'Services Marquee',
        'services_grid' => 'Services Grid',
        'industries' => 'Industries',
        'website_types' => 'Website Types',
        'process' => 'Process',
        'why_codify' => 'Why Choose Us',
        'about' => 'About',
        'portfolio' => 'Portfolio',
        'tech_stack' => 'Tech Stack',
        'pricing_packages' => 'Pricing Packages',
        'guarantees' => 'Guarantees',
        'testimonials' => 'Testimonials',
        'faq' => 'FAQ',
        'courses' => 'Courses',
        'blog_preview' => 'Blog Preview',
        'cta' => 'CTA',
        'seo_rich_content' => 'SEO Rich Content',
        'contact_preview' => 'Contact Preview',
        'why_choose' => 'Why Section',
    ];

    $gridItemFields = [
        'key'        => 'field_grid_items',
        'label'      => 'Items',
        'name'       => 'grid_items',
        'type'       => 'repeater',
        'sub_fields' => [
            ['key' => 'field_gi_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
            ['key' => 'field_gi_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
            ['key' => 'field_gi_href', 'label' => 'Link', 'name' => 'href', 'type' => 'text'],
            ['key' => 'field_gi_icon', 'label' => 'Icon class', 'name' => 'icon', 'type' => 'text'],
            ['key' => 'field_gi_letter', 'label' => 'Letter (marquee)', 'name' => 'letter', 'type' => 'text'],
            ['key' => 'field_gi_tone', 'label' => 'Tone color', 'name' => 'tone', 'type' => 'text'],
        ],
    ];
    $gridLayouts = [
        'trust_badges',
        'services_marquee',
        'services_grid',
        'industries',
        'website_types',
        'tech_stack',
        'pricing_packages',
        'guarantees',
        'faq',
    ];

    $result = [];
    foreach ($layouts as $name => $label) {
        $fields = $textFields($name);
        if ($name === 'hero_slider') {
            $fields = array_merge($fields, [
                ['key' => 'field_hero_eyebrow', 'label' => 'Eyebrow', 'name' => 'eyebrow', 'type' => 'text'],
                ['key' => 'field_hero_headline', 'label' => 'Headline', 'name' => 'headline', 'type' => 'text'],
                [
                    'key'          => 'field_hero_headline_parts',
                    'label'        => 'Headline Parts (colored words)',
                    'name'         => 'headline_parts',
                    'type'         => 'repeater',
                    'sub_fields'   => [
                        ['key' => 'field_hero_part_text', 'label' => 'Text', 'name' => 'text', 'type' => 'text'],
                        [
                            'key'     => 'field_hero_part_tone',
                            'label'   => 'Tone',
                            'name'    => 'tone',
                            'type'    => 'select',
                            'choices' => [
                                'white'  => 'White',
                                'blue'   => 'Blue',
                                'green'  => 'Green',
                                'orange' => 'Orange',
                                'royal'  => 'Royal',
                                'slate'  => 'Slate',
                            ],
                        ],
                    ],
                ],
                ['key' => 'field_hero_subheadline', 'label' => 'Subheadline', 'name' => 'subheadline', 'type' => 'textarea'],
                [
                    'key'        => 'field_hero_cta_primary',
                    'label'      => 'Primary CTA',
                    'name'       => 'cta_primary',
                    'type'       => 'group',
                    'sub_fields' => [
                        ['key' => 'field_hero_cta_p_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text'],
                        ['key' => 'field_hero_cta_p_href', 'label' => 'URL', 'name' => 'href', 'type' => 'text'],
                    ],
                ],
                [
                    'key'        => 'field_hero_cta_secondary',
                    'label'      => 'Secondary CTA',
                    'name'       => 'cta_secondary',
                    'type'       => 'group',
                    'sub_fields' => [
                        ['key' => 'field_hero_cta_s_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text'],
                        ['key' => 'field_hero_cta_s_href', 'label' => 'URL', 'name' => 'href', 'type' => 'text'],
                    ],
                ],
                [
                    'key'        => 'field_hero_stats',
                    'label'      => 'Stats',
                    'name'       => 'stats',
                    'type'       => 'repeater',
                    'sub_fields' => [
                        ['key' => 'field_hero_stat_icon', 'label' => 'Icon class', 'name' => 'icon', 'type' => 'text'],
                        ['key' => 'field_hero_stat_count', 'label' => 'Count', 'name' => 'count', 'type' => 'number'],
                        ['key' => 'field_hero_stat_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text'],
                    ],
                ],
                ['key' => 'field_hero_slides', 'label' => 'Slides', 'name' => 'slides', 'type' => 'repeater', 'sub_fields' => [
                    ['key' => 'field_hero_slide_image', 'label' => 'Image', 'name' => 'image', 'type' => 'image', 'return_format' => 'array'],
                ]],
            ]);
        }
        if ($name === 'about') {
            $fields[] = ['key' => 'field_about_image', 'label' => 'Image', 'name' => 'image', 'type' => 'image', 'return_format' => 'array'];
            $fields[] = [
                'key'        => 'field_about_features',
                'label'      => 'Features',
                'name'       => 'features',
                'type'       => 'repeater',
                'sub_fields' => [
                    ['key' => 'field_about_feat_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                    ['key' => 'field_about_feat_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
                ],
            ];
            $fields[] = ['key' => 'field_about_cta_label', 'label' => 'CTA Label', 'name' => 'cta_label', 'type' => 'text'];
            $fields[] = ['key' => 'field_about_cta_href', 'label' => 'CTA URL', 'name' => 'cta_href', 'type' => 'text'];
        }
        if ($name === 'why_codify') {
            $fields[] = [
                'key'        => 'field_why_cards',
                'label'      => 'Cards',
                'name'       => 'cards',
                'type'       => 'repeater',
                'sub_fields' => [
                    ['key' => 'field_why_card_icon', 'label' => 'Icon', 'name' => 'icon', 'type' => 'text'],
                    ['key' => 'field_why_card_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                    ['key' => 'field_why_card_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
                    ['key' => 'field_why_card_number', 'label' => 'Number', 'name' => 'number', 'type' => 'text'],
                ],
            ];
        }
        if ($name === 'process') {
            $fields[] = [
                'key'        => 'field_process_steps',
                'label'      => 'Steps',
                'name'       => 'steps',
                'type'       => 'repeater',
                'sub_fields' => [
                    ['key' => 'field_process_step_icon', 'label' => 'Icon', 'name' => 'icon', 'type' => 'text'],
                    ['key' => 'field_process_step_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                    ['key' => 'field_process_step_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
                ],
            ];
        }
        if ($name === 'cta' || $name === 'contact_preview') {
            $fields[] = ['key' => "field_{$name}_cta_label", 'label' => 'CTA Label', 'name' => 'cta_label', 'type' => 'text'];
            $fields[] = ['key' => "field_{$name}_cta_href", 'label' => 'CTA URL', 'name' => 'cta_href', 'type' => 'text'];
        }
        if (in_array($name, $gridLayouts, true)) {
            $fields[] = $gridItemFields;
        }
        if ($name === 'courses') {
            $fields[] = [
                'key'        => 'field_courses_items',
                'label'      => 'Course Cards',
                'name'       => 'course_items',
                'type'       => 'repeater',
                'sub_fields' => [
                    ['key' => 'field_ci_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                    ['key' => 'field_ci_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
                    ['key' => 'field_ci_href', 'label' => 'Link', 'name' => 'href', 'type' => 'text'],
                    ['key' => 'field_ci_icon', 'label' => 'Icon', 'name' => 'icon', 'type' => 'text'],
                ],
            ];
        }
        if ($name === 'portfolio') {
            $fields[] = [
                'key'        => 'field_portfolio_items',
                'label'      => 'Portfolio Items',
                'name'       => 'portfolio_items',
                'type'       => 'repeater',
                'sub_fields' => [
                    ['key' => 'field_pi_title', 'label' => 'Title', 'name' => 'title', 'type' => 'text'],
                    ['key' => 'field_pi_image', 'label' => 'Image path or URL', 'name' => 'image', 'type' => 'text'],
                    ['key' => 'field_pi_href', 'label' => 'Link', 'name' => 'href', 'type' => 'text'],
                ],
            ];
        }
        if ($name === 'testimonials') {
            $fields[] = [
                'key'        => 'field_testimonial_items',
                'label'      => 'Testimonials',
                'name'       => 'testimonial_items',
                'type'       => 'repeater',
                'sub_fields' => [
                    ['key' => 'field_ti_name', 'label' => 'Name', 'name' => 'name', 'type' => 'text'],
                    ['key' => 'field_ti_text', 'label' => 'Quote', 'name' => 'text', 'type' => 'textarea'],
                    ['key' => 'field_ti_role', 'label' => 'Role', 'name' => 'role', 'type' => 'text'],
                ],
            ];
        }
        $result[$name] = [
            'key'        => "layout_{$name}",
            'name'       => $name,
            'label'      => $label,
            'display'    => 'block',
            'sub_fields' => $fields,
        ];
    }
    return $result;
}
