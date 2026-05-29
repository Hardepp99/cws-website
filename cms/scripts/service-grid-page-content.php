<?php

declare(strict_types=1);

/** Homepage services grid slugs → full CMS pages (Elementor + classic HTML). */
function cws_service_grid_slugs(): array
{
    return [
        'ui-ux-design-zirakpur',
        'website-development-zirakpur',
        'mobile-app-development-zirakpur',
        'digital-marketing-zirakpur',
        'custom-software-development-zirakpur',
        'graphic-designing-zirakpur',
        'ecommerce-website-zirakpur',
        'seo-services-zirakpur',
    ];
}

function cws_build_service_grid_page_html(array $landing, array $seoExtra = []): string
{
    $parts = [];
    $intro = trim((string) ($landing['intro'] ?? ''));
    if ($intro !== '') {
        $parts[] = '<p class="lead">' . htmlspecialchars($intro, ENT_QUOTES, 'UTF-8') . '</p>';
    }

    $benefits = $landing['benefits'] ?? [];
    if (is_array($benefits) && $benefits !== []) {
        $parts[] = '<h2>What you get</h2><ul>';
        foreach ($benefits as $item) {
            $parts[] = '<li>' . htmlspecialchars((string) $item, ENT_QUOTES, 'UTF-8') . '</li>';
        }
        $parts[] = '</ul>';
    }

    $deliverables = $landing['deliverables'] ?? [];
    if (is_array($deliverables) && $deliverables !== []) {
        $parts[] = '<h2>Typical deliverables</h2><ul>';
        foreach ($deliverables as $item) {
            $parts[] = '<li>' . htmlspecialchars((string) $item, ENT_QUOTES, 'UTF-8') . '</li>';
        }
        $parts[] = '</ul>';
    }

    $seoBody = trim((string) ($seoExtra['seoBody'] ?? ''));
    if ($seoBody !== '') {
        $parts[] = $seoBody;
    }

    $faq = $landing['faq'] ?? [];
    if (!empty($seoExtra['extraFaq']) && is_array($seoExtra['extraFaq'])) {
        $faq = array_merge($faq, $seoExtra['extraFaq']);
    }
    if (is_array($faq) && $faq !== []) {
        $parts[] = '<h2>Frequently asked questions</h2>';
        foreach ($faq as $item) {
            if (!is_array($item)) {
                continue;
            }
            $q = trim((string) ($item['question'] ?? ''));
            $a = trim((string) ($item['answer'] ?? ''));
            if ($q === '') {
                continue;
            }
            $parts[] = '<h3>' . htmlspecialchars($q, ENT_QUOTES, 'UTF-8') . '</h3>';
            $parts[] = '<p>' . htmlspecialchars($a, ENT_QUOTES, 'UTF-8') . '</p>';
        }
    }

    $parts[] = '<p class="service-page-cta"><strong>Ready for a written quote?</strong> Use <a href="#ask-price">Ask price</a> or <a href="/contact">contact our team</a> — we respond within one business day.</p>';

    return implode("\n", $parts);
}

function cws_service_grid_page_row(string $slug, array $landing, array $seoExtra = []): array
{
    $service = (string) ($landing['service'] ?? $slug);
    $pageTitle = (string) ($landing['pageTitle'] ?? $service);
    $title = explode('|', $pageTitle)[0];
    $title = trim($title) ?: $service;

    return [
        'slug'         => $slug,
        'title'        => $title,
        'content_html' => cws_build_service_grid_page_html($landing, $seoExtra),
        'template'     => 'default',
        'seo_title'    => $pageTitle,
        'seo_description' => (string) ($seoExtra['pageDescription'] ?? $landing['pageDescription'] ?? ''),
        'seo_keywords' => (string) ($seoExtra['pageKeywords'] ?? $landing['pageKeywords'] ?? ''),
        'status'       => 'published',
    ];
}
