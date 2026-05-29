<?php

declare(strict_types=1);

/** @return array<string, mixed> */
function cws_dsmt_uid(string $prefix = 'w'): string
{
    return $prefix . '_' . bin2hex(random_bytes(6));
}

/** @param array<string, mixed> $props */
function cws_dsmt_widget(string $type, array $props, array $styles = []): array
{
    return ['id' => cws_dsmt_uid('w'), 'type' => $type, 'props' => $props, 'styles' => $styles];
}

/** @param list<array<string, mixed>> $widgets */
function cws_dsmt_column(float $width, array $widgets, array $styles = []): array
{
    return ['id' => cws_dsmt_uid('c'), 'width' => $width, 'widgets' => $widgets, 'styles' => $styles];
}

/** @param list<array<string, mixed>> $columns */
function cws_dsmt_section(array $columns, array $settings = []): array
{
    return ['id' => cws_dsmt_uid('s'), 'type' => 'section', 'settings' => $settings, 'columns' => $columns];
}

/** @return list<string> */
function cws_dsmt_stock_images(): array
{
    return [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80',
    ];
}

function cws_dsmt_image_for_slug(string $slug): string
{
    $local = [
        'about'   => '/assets/images/about-office.jpg',
        'courses' => '/assets/images/process-hero-mac-students.jpg',
    ];
    if (isset($local[$slug])) {
        return $local[$slug];
    }
    $stock = cws_dsmt_stock_images();
    $idx = abs(crc32($slug)) % count($stock);
    return $stock[$idx];
}

function cws_dsmt_lead_for_slug(string $slug): string
{
    $leads = [
        'about'            => 'Engineering-led web, apps, and marketing from the Chandigarh Tricity — with transparent delivery and long-term support.',
        'services'         => 'Websites, ecommerce, mobile apps, SEO, custom software, and IT training — one accountable team for Indian SMEs and growing brands.',
        'contact'          => 'Tell us what you are building. We respond within one business day with practical next steps and a realistic scope conversation.',
        'portfolio'        => 'Real delivery patterns across healthcare, retail, B2B, and product teams — filter by category to see relevant work.',
        'courses'          => 'Job-ready tracks in PHP, Laravel, React, Node.js, and full-stack — taught by developers who ship client work daily.',
        'blog'             => 'Practical guides for owners and marketing leads — local SEO, performance, ecommerce, and honest vendor selection.',
        'privacy-policy'   => 'How we collect, use, and protect information when you use our website and services.',
        'terms-conditions' => 'Terms of use for our website, client services, and training programs.',
    ];
    return $leads[$slug] ?? 'Creative Web Solutions — websites, applications, and growth marketing from Zirakpur, Chandigarh, and Mohali.';
}

/** @return list<string> */
function cws_dsmt_gallery_for_slug(string $slug): array
{
    if (!in_array($slug, ['services', 'portfolio', 'about'], true)) {
        return [];
    }
    return array_slice(cws_dsmt_stock_images(), 0, 3);
}

function cws_dsmt_section_band(array $columns, array $settings = [], bool $alt = false): array
{
    if ($alt) {
        $settings['backgroundColor'] = $settings['backgroundColor'] ?? '#f8fafc';
    }
    $settings['paddingTop'] = $settings['paddingTop'] ?? '3rem';
    $settings['paddingBottom'] = $settings['paddingBottom'] ?? '3rem';
    return cws_dsmt_section($columns, $settings);
}

function cws_dsmt_section_intro(string $html, bool $alt = false): array
{
    return cws_dsmt_section_band(
        [cws_dsmt_column(100, [cws_dsmt_widget('text', ['html' => '<div class="dsmt-prose-intro">' . $html . '</div>'])])],
        ['textAlign' => 'center'],
        $alt
    );
}

function cws_dsmt_section_heading(string $title, string $subtitle = '', bool $centered = true): array
{
    $widgets = [
        cws_dsmt_widget('heading', ['text' => $title, 'tag' => 'h2']),
    ];
    if ($subtitle !== '') {
        $widgets[] = cws_dsmt_widget('text', [
            'html' => '<p class="dsmt-section-sub">' . htmlspecialchars($subtitle, ENT_QUOTES, 'UTF-8') . '</p>',
        ]);
    }
    return cws_dsmt_section_band(
        [cws_dsmt_column(100, $widgets)],
        ['textAlign' => $centered ? 'center' : 'left', 'paddingBottom' => '1rem']
    );
}

/** @return list<float> Column widths that sum to 100 */
function cws_dsmt_column_widths(int $count): array
{
    $count = max(1, min($count, 6));
    $base = intdiv(100, $count);
    $widths = array_fill(0, $count, $base);
    for ($i = 0, $rem = 100 - $base * $count; $i < $rem; $i++) {
        $widths[$i]++;
    }
    return $widths;
}

/**
 * @param list<array{title: string, description: string}> $cards
 * @return list<array<string, mixed>>
 */
function cws_dsmt_section_icon_grids(array $cards, array $icons, bool $alt = false): array
{
    if ($cards === []) {
        return [];
    }

    $out = [];
    foreach (array_chunk($cards, 6) as $chunk) {
        $cols = [];
        $widths = cws_dsmt_column_widths(count($chunk));
        foreach ($chunk as $i => $card) {
            $title = $card['title'] !== '' ? $card['title'] : ('Item ' . ($i + 1));
            $cols[] = cws_dsmt_column((float) $widths[$i], [
                cws_dsmt_widget('icon-box', [
                    'iconClass'   => $icons[$i % count($icons)] ?? 'fas fa-check-circle',
                    'title'       => $title,
                    'description' => $card['description'] ?? '',
                    'iconColor'   => '#0057ff',
                    'position'    => 'top',
                ], ['customCss' => 'padding:1.25rem;border-radius:12px;background:#fff;box-shadow:0 8px 28px rgba(15,23,42,.06);height:100%;']),
            ]);
        }
        $out[] = cws_dsmt_section_band($cols, [], $alt);
        $alt = !$alt;
    }

    return $out;
}

/** @param list<array{title: string, description: string}> $cards */
function cws_dsmt_section_pathways(array $cards, bool $alt = false): array
{
    $pathIcons = ['fas fa-globe', 'fas fa-chart-line', 'fas fa-laptop-code', 'fas fa-mobile-alt'];
    $cols = [];
    $slice = array_slice($cards, 0, 6);
    $widths = cws_dsmt_column_widths(count($slice));
    foreach ($slice as $i => $card) {
        $cols[] = cws_dsmt_column((float) $widths[$i], [
            cws_dsmt_widget('icon-box', [
                'iconClass'   => $pathIcons[$i % count($pathIcons)],
                'title'       => $card['title'],
                'description' => $card['description'] ?? '',
                'iconColor'   => '#0057ff',
                'position'    => 'top',
            ], ['customCss' => 'padding:1.5rem;border-radius:14px;background:#fff;border:1px solid #e2e8f0;height:100%;']),
        ]);
    }
    return cws_dsmt_section_band($cols, [], $alt);
}

function cws_dsmt_section_stats(): array
{
    $stats = [
        ['number' => 15, 'suffix' => '+', 'title' => 'Years delivering'],
        ['number' => 500, 'suffix' => '+', 'title' => 'Projects shipped'],
        ['number' => 4.9, 'suffix' => '★', 'title' => 'Google rating'],
        ['number' => 18, 'suffix' => '+', 'title' => 'Service landings'],
    ];
    $cols = [];
    foreach ($stats as $s) {
        $cols[] = cws_dsmt_column(25, [
            cws_dsmt_widget('counter', [
                'number'   => $s['number'],
                'suffix'   => $s['suffix'],
                'title'    => $s['title'],
                'duration' => 2,
            ]),
        ]);
    }
    return cws_dsmt_section_band(
        $cols,
        ['backgroundColor' => '#0a1e5e', 'color' => '#ffffff', 'paddingTop' => '2.5rem', 'paddingBottom' => '2.5rem']
    );
}

function cws_dsmt_section_cta(): array
{
    return cws_dsmt_section(
        [cws_dsmt_column(100, [
            cws_dsmt_widget('call-to-action', [
                'title'        => 'Ready to move forward?',
                'description'  => 'Use Ask price in the menu for a written estimate, or book a discovery call with our Zirakpur team.',
                'buttonLabel'  => 'Contact our team',
                'buttonHref'   => '/contact',
                'buttonColor'  => 'green',
                'bgColor'      => '#f5f5f7',
                'textColor'    => '#1d1d1f',
            ]),
        ])],
        ['paddingTop' => '2rem', 'paddingBottom' => '4rem']
    );
}

function cws_dsmt_hero_section(string $title, string $lead, string $heroImageUrl): array
{
    return cws_dsmt_section(
        [
            cws_dsmt_column(58, [
                cws_dsmt_widget('text', ['html' => '<span class="section-badge section-badge--growth"><span class="dot"></span> Creative Web Solutions</span>']),
                cws_dsmt_widget('heading', ['text' => $title, 'tag' => 'h1']),
                cws_dsmt_widget('text', ['html' => '<p class="lead-copy">' . $lead . '</p>']),
                cws_dsmt_widget('button', ['label' => 'Ask price', 'href' => '/contact', 'variant' => 'primary', 'color' => 'green', 'size' => 'md']),
            ]),
            cws_dsmt_column(42, [
                cws_dsmt_widget('image', ['url' => $heroImageUrl, 'alt' => $title], ['borderRadius' => '16px', 'boxShadow' => '0 20px 50px rgba(15,23,42,0.12)']),
            ]),
        ],
        ['paddingTop' => '2.5rem', 'paddingBottom' => '3rem', 'backgroundColor' => '#f8fafc']
    );
}

/** @param array<string, mixed> $block */
function cws_dsmt_block_to_sections(array $block, bool &$alt, string $slug): array
{
    $sections = [];
    $icons = ['fas fa-globe', 'fas fa-cubes', 'fas fa-mobile-alt', 'fas fa-chart-line', 'fas fa-graduation-cap', 'fas fa-check-circle'];

    if (($block['kind'] ?? '') === 'intro') {
        $sections[] = cws_dsmt_section_intro((string) ($block['html'] ?? ''), $alt);
        $alt = !$alt;
        return $sections;
    }

    if (($block['kind'] ?? '') === 'pathways') {
        $sections[] = cws_dsmt_section_heading((string) ($block['title'] ?? ''), '');
        $sections[] = cws_dsmt_section_pathways((array) ($block['cards'] ?? []), $alt);
        $alt = !$alt;
        return $sections;
    }

    $title = (string) ($block['title'] ?? '');
    $listItems = (array) ($block['listItems'] ?? []);
    $orderedItems = (array) ($block['orderedItems'] ?? []);
    $paragraphs = (array) ($block['paragraphs'] ?? []);

    if ($title !== '') {
        $sections[] = cws_dsmt_section_heading($title, '');
    }

    if ($paragraphs !== []) {
        $html = '<div class="seo-rich-prose dsmt-prose-block">' . implode("\n", $paragraphs) . '</div>';
        $sections[] = cws_dsmt_section_band(
            [cws_dsmt_column(100, [cws_dsmt_widget('text', ['html' => $html])])],
            [],
            $alt
        );
        $alt = !$alt;
    }

    if ($listItems !== []) {
        foreach (cws_dsmt_section_icon_grids($listItems, $icons, $alt) as $sec) {
            $sections[] = $sec;
        }
        $alt = !$alt;
    }

    if ($orderedItems !== []) {
        $steps = [];
        foreach ($orderedItems as $i => $item) {
            $steps[] = [
                'title'       => ($item['title'] ?? '') !== '' ? $item['title'] : ('Step ' . ($i + 1)),
                'description' => $item['description'] ?? '',
            ];
        }
        $stepIcons = ['fas fa-search', 'fas fa-file-alt', 'fas fa-palette', 'fas fa-rocket', 'fas fa-chart-line'];
        foreach (cws_dsmt_section_icon_grids($steps, $stepIcons, $alt) as $sec) {
            $sections[] = $sec;
        }
        $alt = !$alt;
    }

    return $sections;
}

/**
 * Rich page layout — hero, parsed sections (cards/stats), CTA. Stored in desimentor_documents for Elementor edit.
 *
 * @return array{version: int, sections: list<array<string, mixed>>}
 */
function cws_dsmt_page_document(
    string $slug,
    string $title,
    string $lead,
    string $html,
    string $heroImageUrl,
    array $galleryUrls = []
): array {
    require_once __DIR__ . '/desimentor-html-parser.php';

    $sections = [cws_dsmt_hero_section($title, $lead, $heroImageUrl)];

    if ($slug === 'about') {
        $sections[] = cws_dsmt_section_stats();
    }

    $alt = false;
    foreach (cws_dsmt_parse_html_blocks($html) as $block) {
        foreach (cws_dsmt_block_to_sections($block, $alt, $slug) as $sec) {
            $sections[] = $sec;
        }
    }

    if (count($galleryUrls) >= 2) {
        $items = [];
        foreach ($galleryUrls as $url) {
            $items[] = ['url' => $url, 'alt' => $title];
        }
        $sections[] = cws_dsmt_section_band(
            [
                cws_dsmt_column(100, [
                    cws_dsmt_widget('heading', ['text' => 'Inside our studio', 'tag' => 'h2']),
                    cws_dsmt_widget('gallery', ['columns' => 3, 'items' => $items]),
                ]),
            ],
            ['textAlign' => 'center'],
            $alt
        );
    }

    $sections[] = cws_dsmt_section_cta();

    return ['version' => 1, 'sections' => $sections];
}

/**
 * @param list<string> $benefits
 * @param list<string> $deliverables
 * @param list<array{question?: string, answer?: string}> $faq
 * @return array{version: int, sections: list<array<string, mixed>>}
 */
function cws_dsmt_landing_document(
    string $title,
    string $lead,
    string $html,
    string $heroImageUrl,
    array $benefits = [],
    array $deliverables = [],
    array $faq = []
): array {
    require_once __DIR__ . '/desimentor-html-parser.php';

    $sections = [cws_dsmt_hero_section($title, $lead, $heroImageUrl)];

    if ($benefits !== []) {
        $cards = [];
        foreach ($benefits as $b) {
            $text = (string) $b;
            $short = strlen($text) > 48 ? substr($text, 0, 45) . '…' : $text;
            $cards[] = ['title' => $short, 'description' => $text];
        }
        $sections[] = cws_dsmt_section_heading('Why choose us', 'Outcomes clients care about');
        foreach (cws_dsmt_section_icon_grids($cards, ['fas fa-check-circle', 'fas fa-bolt', 'fas fa-shield-alt'], false) as $sec) {
            $sections[] = $sec;
        }
    }

    $alt = true;
    foreach (cws_dsmt_parse_html_blocks($html) as $block) {
        foreach (cws_dsmt_block_to_sections($block, $alt, 'landing') as $sec) {
            $sections[] = $sec;
        }
    }

    if ($deliverables !== []) {
        $items = [];
        foreach ($deliverables as $d) {
            $items[] = ['iconClass' => 'fas fa-check', 'text' => (string) $d];
        }
        $sections[] = cws_dsmt_section_heading('What you get', 'Deliverables included in delivery');
        $sections[] = cws_dsmt_section_band(
            [cws_dsmt_column(100, [cws_dsmt_widget('icon-list', ['items' => $items])])],
            ['backgroundColor' => '#f8fafc'],
            $alt
        );
    }

    if ($faq !== []) {
        $accItems = [];
        foreach (array_slice($faq, 0, 8) as $f) {
            if (!is_array($f)) {
                continue;
            }
            $q = (string) ($f['question'] ?? '');
            $a = (string) ($f['answer'] ?? '');
            if ($q !== '' && $a !== '') {
                $accItems[] = ['title' => $q, 'content' => '<p>' . htmlspecialchars($a, ENT_QUOTES, 'UTF-8') . '</p>'];
            }
        }
        if ($accItems !== []) {
            $sections[] = cws_dsmt_section_heading('Frequently asked questions', '');
            $sections[] = cws_dsmt_section_band(
                [cws_dsmt_column(100, [cws_dsmt_widget('accordion', ['items' => $accItems])])],
                [],
                !$alt
            );
        }
    }

    $sections[] = cws_dsmt_section_cta();

    return ['version' => 1, 'sections' => $sections];
}

/**
 * @param list<array{title?: string, description?: string, icon?: string}> $features
 * @return array{version: int, sections: list<array<string, mixed>>}
 */
function cws_dsmt_service_document(
    string $title,
    string $subtitle,
    string $html,
    string $heroImageUrl,
    array $features = []
): array {
    require_once __DIR__ . '/desimentor-html-parser.php';

    $sections = [cws_dsmt_hero_section($title, $subtitle, $heroImageUrl)];

    if ($features !== []) {
        $cards = [];
        foreach ($features as $feat) {
            $cards[] = [
                'title'       => (string) ($feat['title'] ?? 'Feature'),
                'description' => (string) ($feat['description'] ?? ''),
            ];
        }
        $featIcons = array_map(
            static fn ($f) => (string) ($f['icon'] ?? 'fas fa-star'),
            $features
        );
        $sections[] = cws_dsmt_section_heading('Key features', 'What is included in this package');
        foreach (cws_dsmt_section_icon_grids($cards, $featIcons !== [] ? $featIcons : ['fas fa-star'], false) as $sec) {
            $sections[] = $sec;
        }
    }

    $alt = true;
    $bodyHtml = trim($html);
    if ($bodyHtml !== '') {
        foreach (cws_dsmt_parse_html_blocks($bodyHtml) as $block) {
            foreach (cws_dsmt_block_to_sections($block, $alt, 'service') as $sec) {
                $sections[] = $sec;
            }
        }
    }

    $sections[] = cws_dsmt_section_cta();

    return ['version' => 1, 'sections' => $sections];
}

/**
 * @return array{version: int, sections: list<array<string, mixed>>}
 */
function cws_dsmt_blog_document(
    string $title,
    string $excerpt,
    string $html,
    string $heroImageUrl
): array {
    require_once __DIR__ . '/desimentor-html-parser.php';

    $sections = [];

    if ($heroImageUrl !== '') {
        $sections[] = cws_dsmt_section(
            [cws_dsmt_column(100, [
                cws_dsmt_widget('image', ['url' => $heroImageUrl, 'alt' => $title], ['borderRadius' => '12px']),
            ])],
            ['paddingTop' => '1.5rem', 'paddingBottom' => '0.5rem']
        );
    }

    $sections[] = cws_dsmt_section_band(
        [
            cws_dsmt_column(100, [
                cws_dsmt_widget('heading', ['text' => $title, 'tag' => 'h1']),
                cws_dsmt_widget('text', ['html' => '<p class="lead-copy">' . htmlspecialchars($excerpt, ENT_QUOTES, 'UTF-8') . '</p>']),
            ]),
        ],
        ['paddingBottom' => '1.5rem']
    );

    $alt = false;
    foreach (cws_dsmt_parse_html_blocks($html) as $block) {
        foreach (cws_dsmt_block_to_sections($block, $alt, 'blog') as $sec) {
            $sections[] = $sec;
        }
    }

    $sections[] = cws_dsmt_section_cta();

    return ['version' => 1, 'sections' => $sections];
}
