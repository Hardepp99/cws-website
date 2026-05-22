<?php

/**
 * Maps WordPress + ACF data to JSON consumed by the Next.js frontend.
 */

/** Decode HTML entities from WP menu titles and text fields for JSON/API consumers */
function cws_headless_decode_text(string $text): string
{
    if ($text === '') {
        return '';
    }
    return html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function cws_headless_get_seo_meta(int $post_id, string $fallback_title = '', string $fallback_desc = ''): array
{
    $title = get_field('seo_title', $post_id) ?: get_post_meta($post_id, 'rank_math_title', true);
    $description = get_field('seo_description', $post_id) ?: get_post_meta($post_id, 'rank_math_description', true);
    $keywords = get_field('seo_keywords', $post_id) ?: get_post_meta($post_id, 'rank_math_focus_keyword', true);

    if (!$title) {
        $title = get_the_title($post_id);
    }
    if (!$description) {
        $description = get_post_field('post_excerpt', $post_id) ?: wp_trim_words(wp_strip_all_tags(get_post_field('post_content', $post_id)), 30);
    }

    return [
        'title'       => $title ?: $fallback_title,
        'description' => $description ?: $fallback_desc,
        'keywords'    => $keywords ?: '',
        'canonical'   => get_permalink($post_id) ?: '',
    ];
}

function cws_headless_image_url($image): ?string
{
    if (empty($image)) {
        return null;
    }
    if (is_array($image)) {
        return $image['url'] ?? null;
    }
    if (is_numeric($image)) {
        return wp_get_attachment_url((int) $image) ?: null;
    }
    return is_string($image) ? $image : null;
}

function cws_headless_lines_to_list($value): array
{
    if (is_array($value)) {
        return array_values(array_filter(array_map('trim', $value)));
    }
    if (!is_string($value) || $value === '') {
        return [];
    }
    return array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $value))));
}

function cws_headless_map_homepage_sections(int $post_id): array
{
    $rows = get_field('homepage_sections', $post_id);
    if (!is_array($rows)) {
        return [];
    }

    $sections = [];
    foreach ($rows as $row) {
        $layout = $row['acf_fc_layout'] ?? '';
        if ($layout === 'seo_rich_content') {
            $layout = 'seo_rich';
        }

        $section = ['acfFcLayout' => $layout];

        foreach ($row as $key => $value) {
            if ($key === 'acf_fc_layout') {
                continue;
            }

            if ($key === 'slides' && is_array($value)) {
                $section['slides'] = array_map(function ($slide) {
                    return ['image' => ['url' => cws_headless_image_url($slide['image'] ?? null) ?: '']];
                }, $value);
                continue;
            }

            if ($key === 'image') {
                $section['image'] = cws_headless_image_url($value) ?: '';
                continue;
            }

            if ($key === 'headline_parts' && is_array($value)) {
                $section['headlineParts'] = array_map(function ($part) {
                    return [
                        'text' => $part['text'] ?? '',
                        'tone' => $part['tone'] ?? 'white',
                    ];
                }, $value);
                continue;
            }

            if ($key === 'cta_primary' && is_array($value)) {
                $section['ctaPrimary'] = [
                    'label' => $value['label'] ?? 'Contact',
                    'href'  => $value['href'] ?? '/contact',
                ];
                continue;
            }

            if ($key === 'cta_secondary' && is_array($value)) {
                $section['ctaSecondary'] = [
                    'label' => $value['label'] ?? 'Services',
                    'href'  => $value['href'] ?? '/services',
                ];
                continue;
            }

            if ($key === 'grid_items' && is_array($value)) {
                $section['items'] = array_map(function ($item) {
                    return [
                        'title'  => $item['title'] ?? '',
                        'desc'   => $item['description'] ?? '',
                        'href'   => $item['href'] ?? '',
                        'icon'   => $item['icon'] ?? 'fas fa-check',
                        'letter' => $item['letter'] ?? '',
                        'tone'   => $item['tone'] ?? '',
                    ];
                }, $value);
                continue;
            }

            if ($key === 'course_items' && is_array($value)) {
                $section['courses'] = array_map(function ($item) {
                    return [
                        'title' => $item['title'] ?? '',
                        'desc'  => $item['description'] ?? '',
                        'href'  => $item['href'] ?? '/courses',
                        'icon'  => $item['icon'] ?? 'fas fa-book',
                    ];
                }, $value);
                continue;
            }

            if ($key === 'testimonial_items' && is_array($value)) {
                $section['testimonials'] = $value;
                continue;
            }

            if ($key === 'portfolio_items' && is_array($value)) {
                $section['portfolioItems'] = array_map(function ($item) {
                    return [
                        'title' => $item['title'] ?? '',
                        'image' => is_string($item['image'] ?? null) ? $item['image'] : (cws_headless_image_url($item['image'] ?? null) ?: ''),
                        'href'  => $item['href'] ?? '/portfolio',
                    ];
                }, $value);
                continue;
            }

            if ($key === 'stats' && is_array($value)) {
                $section['stats'] = array_map(function ($stat) {
                    return [
                        'icon'  => $stat['icon'] ?? '',
                        'count' => (int) ($stat['count'] ?? 0),
                        'label' => $stat['label'] ?? '',
                    ];
                }, $value);
                continue;
            }

            $section[$key] = $value;
        }

        if (isset($section['cta_label'])) {
            $section['ctaLabel'] = $section['cta_label'];
            unset($section['cta_label']);
        }
        if (isset($section['cta_href'])) {
            $section['ctaHref'] = $section['cta_href'];
            unset($section['cta_href']);
        }

        $sections[] = $section;
    }

    return $sections;
}

function cws_headless_map_service_landing(WP_Post $post): array
{
    $benefits = cws_headless_lines_to_list(get_field('benefits', $post->ID));
    $deliverables = cws_headless_lines_to_list(get_field('deliverables', $post->ID));
    $relatedRaw = (string) (get_field('related_slugs', $post->ID) ?: '');
    $related = array_values(array_filter(array_map('trim', explode(',', $relatedRaw))));

    $faqRows = get_field('faq', $post->ID) ?: [];
    $faq = [];
    if (is_array($faqRows)) {
        foreach ($faqRows as $row) {
            if (!empty($row['question'])) {
                $faq[] = [
                    'question' => $row['question'],
                    'answer'   => $row['answer'] ?? '',
                ];
            }
        }
    }

    $seoBody = get_field('seo_body', $post->ID);
    if (!$seoBody && $post->post_content) {
        $seoBody = apply_filters('the_content', $post->post_content);
    }

    return [
        'slug'            => $post->post_name,
        'service'         => get_field('service_name', $post->ID) ?: $post->post_title,
        'pageTitle'       => get_field('seo_title', $post->ID) ?: $post->post_title,
        'pageDescription' => get_field('seo_description', $post->ID) ?: '',
        'pageKeywords'    => get_field('seo_keywords', $post->ID) ?: '',
        'intro'           => get_field('intro', $post->ID) ?: '',
        'benefits'        => $benefits,
        'deliverables'    => $deliverables,
        'faq'             => $faq,
        'related'         => $related,
        'seoBody'         => $seoBody ?: '',
        'theme'           => [
            'start'  => get_field('theme_start', $post->ID) ?: '#1e3a8a',
            'mid'    => get_field('theme_mid', $post->ID) ?: '#2563eb',
            'end'    => get_field('theme_end', $post->ID) ?: '#3b82f6',
            'accent' => get_field('theme_accent', $post->ID) ?: '#93c5fd',
            'icon'   => get_field('icon_class', $post->ID) ?: 'fas fa-briefcase',
            'badge'  => get_field('badge_text', $post->ID) ?: '',
        ],
    ];
}

function cws_headless_map_service(WP_Post $post): array
{
    $features = [];
    $featureRows = get_field('features', $post->ID) ?: [];
    if (is_array($featureRows)) {
        foreach ($featureRows as $row) {
            if (!empty($row['title'])) {
                $features[] = [
                    'title'       => $row['title'],
                    'description' => $row['description'] ?? '',
                    'icon'        => $row['icon'] ?? 'fas fa-check',
                ];
            }
        }
    }

    $content = get_field('long_content', $post->ID);
    if (!$content && $post->post_content) {
        $content = apply_filters('the_content', $post->post_content);
    }

    return [
        'slug'         => $post->post_name,
        'title'        => $post->post_title,
        'heroTitle'    => get_field('hero_title', $post->ID) ?: $post->post_title,
        'heroSubtitle' => get_field('hero_subtitle', $post->ID) ?: '',
        'priceBadge'   => get_field('price_badge', $post->ID) ?: '',
        'content'      => $content ?: '',
        'features'     => $features,
        'ctaTitle'     => get_field('cta_title', $post->ID) ?: '',
        'ctaText'      => get_field('cta_text', $post->ID) ?: '',
        'seo'          => array_merge(
            cws_headless_get_seo_meta($post->ID, $post->post_title),
            ['keywords' => get_field('seo_keywords', $post->ID) ?: '']
        ),
    ];
}

function cws_headless_map_page(WP_Post $post): array
{
    $template = get_field('page_template', $post->ID) ?: 'default';
    $content = $post->post_content ? apply_filters('the_content', $post->post_content) : '';

    $data = [
        'slug'     => $post->post_name,
        'title'    => cws_headless_decode_text($post->post_title),
        'content'  => $content,
        'template' => $template,
        'seo'      => cws_headless_get_seo_meta($post->ID, $post->post_title),
    ];

    if ($post->post_name === 'home' || (int) get_option('page_on_front') === (int) $post->ID) {
        $data['sections'] = cws_headless_map_homepage_sections($post->ID);
    }

    return $data;
}

function cws_headless_get_menu_items(string $location): array
{
    $locations = get_nav_menu_locations();
    if (empty($locations[$location])) {
        return [];
    }

    $items = wp_get_nav_menu_items($locations[$location]);
    if (!$items) {
        return [];
    }

    $by_parent = [];
    foreach ($items as $item) {
        $parent = (int) $item->menu_item_parent;
        $by_parent[$parent][] = $item;
    }

    $build = function (int $parent_id) use (&$build, $by_parent): array {
        $nodes = $by_parent[$parent_id] ?? [];
        $out = [];
        foreach ($nodes as $item) {
            $path = wp_parse_url($item->url, PHP_URL_PATH) ?: '/';
            $entry = [
                'label' => cws_headless_decode_text($item->title),
                'href'  => $path,
            ];
            $icon = get_post_meta($item->ID, '_menu_item_icon', true);
            if ($icon) {
                $entry['icon'] = $icon;
            }
            $children = $build((int) $item->ID);
            if ($children) {
                $entry['children'] = $children;
            }
            $out[] = $entry;
        }
        return $out;
    };

    return $build(0);
}

function cws_headless_get_blog_posts(): array
{
    $query = new WP_Query([
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => 20,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ]);

    $posts = [];
    foreach ($query->posts as $post) {
        $thumb = get_the_post_thumbnail_url($post->ID, 'large');
        $posts[] = [
            'slug'    => $post->post_name,
            'title'   => $post->post_title,
            'excerpt' => wp_trim_words(wp_strip_all_tags($post->post_excerpt ?: $post->post_content), 28),
            'date'    => get_the_date('Y-m-d', $post),
            'image'   => $thumb ?: null,
            'content' => apply_filters('the_content', $post->post_content),
            'seo'     => cws_headless_get_seo_meta($post->ID, $post->post_title),
        ];
    }
    wp_reset_postdata();

    return $posts;
}

function cws_headless_get_all_slugs(): array
{
    $slugs = ['home'];

    foreach (['page', 'service_landing', 'service', 'course'] as $type) {
        $posts = get_posts([
            'post_type'      => $type,
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ]);
        foreach ($posts as $id) {
            $slug = get_post_field('post_name', $id);
            if ($slug && $slug !== 'home') {
                $slugs[] = $slug;
            }
        }
    }

    return array_values(array_unique($slugs));
}

function cws_headless_find_post_by_slug(string $slug, string $post_type): ?WP_Post
{
    $posts = get_posts([
        'name'           => $slug,
        'post_type'      => $post_type,
        'post_status'    => 'publish',
        'posts_per_page' => 1,
    ]);
    return $posts[0] ?? null;
}

function cws_headless_pricing_group_for_slug(string $slug, array $rules): string
{
    foreach ($rules as $rule) {
        $group = $rule['group'] ?? '';
        foreach ($rule['patterns'] ?? [] as $pattern) {
            if ($pattern !== '' && str_contains($slug, $pattern)) {
                return $group ?: 'Services';
            }
        }
    }
    return 'More services';
}

function cws_headless_get_pricing_bundles(): array
{
    $rows = function_exists('get_field') ? get_field('pricing_bundles', 'option') : null;
    $bundles = [];
    if (is_array($rows)) {
        foreach ($rows as $row) {
            if (empty($row['label'])) {
                continue;
            }
            $includes = cws_headless_lines_to_list($row['includes'] ?? '');
            $bundles[] = [
                'id'       => $row['bundle_id'] ?? sanitize_title($row['label']),
                'label'    => $row['label'],
                'summary'  => $row['summary'] ?? '',
                'includes' => $includes,
            ];
        }
    }
    if ($bundles) {
        return $bundles;
    }
    $stored = get_option('cws_pricing_bundles');
    return is_array($stored) ? $stored : [];
}

function cws_headless_get_pricing_select_list(string $option_key, string $acf_name): array
{
    $rows = function_exists('get_field') ? get_field($acf_name, 'option') : null;
    $list = [];
    if (is_array($rows)) {
        foreach ($rows as $row) {
            if (!empty($row['label'])) {
                $list[] = [
                    'value' => $row['value'] ?? sanitize_title($row['label']),
                    'label' => $row['label'],
                ];
            }
        }
    }
    if ($list) {
        return $list;
    }
    $stored = get_option($option_key);
    return is_array($stored) ? $stored : [];
}

function cws_headless_build_pricing_service_groups(): array
{
    $rules = get_option('cws_pricing_group_rules');
    if (!is_array($rules) || !$rules) {
        $rules = [
            ['group' => 'Websites & Online Stores', 'patterns' => ['website-development', 'wordpress', 'ecommerce', 'shopify', 'cms-based', 'website-maintenance']],
            ['group' => 'Marketing & Visibility', 'patterns' => ['digital-marketing', 'seo-services', 'ppc-services', 'social-media', 'graphic-designing', 'ui-ux-design']],
            ['group' => 'Apps & Custom Software', 'patterns' => ['mobile-app', 'custom-software', 'crm-development', 'erp-hrm', 'web-application']],
            ['group' => 'Blockchain & Web3', 'patterns' => ['blockchain', 'smart-contract', 'exchange-listing']],
        ];
    }

    $bucket = [];
    foreach ($rules as $rule) {
        $g = $rule['group'] ?? 'Services';
        if (!isset($bucket[$g])) {
            $bucket[$g] = [];
        }
    }
    $bucket['More services'] = $bucket['More services'] ?? [];

    $add = function (string $slug, string $label, string $prefix) use (&$bucket, $rules): void {
        $group = cws_headless_pricing_group_for_slug($slug, $rules);
        if (!isset($bucket[$group])) {
            $bucket[$group] = [];
        }
        $bucket[$group][] = [
            'value' => $prefix . ':' . $slug,
            'label' => $label,
        ];
    };

    $landings = get_posts([
        'post_type'      => 'service_landing',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'title',
        'order'          => 'ASC',
    ]);
    foreach ($landings as $post) {
        $name = get_field('service_name', $post->ID) ?: $post->post_title;
        $add($post->post_name, $name, 'landing');
    }

    $services = get_posts([
        'post_type'      => 'service',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'title',
        'order'          => 'ASC',
    ]);
    foreach ($services as $post) {
        $title = get_field('hero_title', $post->ID) ?: $post->post_title;
        $add($post->post_name, $title, 'service');
    }

    $out = [];
    foreach ($bucket as $label => $options) {
        if (!$options) {
            continue;
        }
        usort($options, fn ($a, $b) => strcmp($a['label'], $b['label']));
        $out[] = ['label' => $label, 'options' => $options];
    }
    return $out;
}

function cws_headless_get_pricing_options(): array
{
    return [
        'bundles'        => cws_headless_get_pricing_bundles(),
        'serviceGroups'  => cws_headless_build_pricing_service_groups(),
        'budgetRanges'   => cws_headless_get_pricing_select_list('cws_pricing_budget_ranges', 'pricing_budget_ranges'),
        'timelines'      => cws_headless_get_pricing_select_list('cws_pricing_timelines', 'pricing_timelines'),
    ];
}
