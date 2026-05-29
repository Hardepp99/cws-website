<?php

declare(strict_types=1);

/**
 * Split page HTML into structured blocks for Desimentor section builders.
 *
 * @return list<array<string, mixed>>
 */
function cws_dsmt_parse_html_blocks(string $html): array
{
    $html = trim($html);
    if ($html === '') {
        return [];
    }

    $pathwayCards = cws_dsmt_extract_pathway_cards($html);
    if ($pathwayCards !== []) {
        $html = (string) preg_replace('/<div class="seo-pathways">.*?<\/div>\s*/is', '<!--PATHWAYS-->', $html, 1);
    }

    $chunks = preg_split('/<h2[^>]*>/i', $html) ?: [];
    $blocks = [];

    $intro = trim((string) ($chunks[0] ?? ''));
    $intro = str_replace('<!--PATHWAYS-->', '', $intro);
    $introParts = cws_dsmt_extract_paragraphs_html($intro);
    if ($introParts !== []) {
        $blocks[] = ['kind' => 'intro', 'html' => implode("\n", $introParts)];
    }

    $pathwaysUsed = false;
    for ($i = 1, $n = count($chunks); $i < $n; $i++) {
        $chunk = (string) $chunks[$i];
        if (!preg_match('/^([^<]*)<\/h2>\s*(.*)/is', $chunk, $m)) {
            continue;
        }
        $title = trim(html_entity_decode(strip_tags($m[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $body = (string) $m[2];

        if (!$pathwaysUsed && ($pathwayCards !== []) && str_contains($body, '<!--PATHWAYS-->')) {
            $blocks[] = ['kind' => 'pathways', 'title' => $title, 'cards' => $pathwayCards];
            $pathwaysUsed = true;
            $body = str_replace('<!--PATHWAYS-->', '', $body);
        }

        $listItems = cws_dsmt_extract_list_items($body, 'ul');
        $orderedItems = cws_dsmt_extract_list_items($body, 'ol');
        $paragraphs = cws_dsmt_extract_paragraphs_html($body);

        $blocks[] = [
            'kind'          => 'section',
            'title'         => $title,
            'paragraphs'    => $paragraphs,
            'listItems'     => $listItems,
            'orderedItems'  => $orderedItems,
        ];
    }

    if (!$pathwaysUsed && $pathwayCards !== []) {
        $blocks[] = ['kind' => 'pathways', 'title' => 'Our service areas', 'cards' => $pathwayCards];
    }

    return $blocks;
}

/** @return list<array{title: string, description: string}> */
function cws_dsmt_extract_pathway_cards(string $html): array
{
    if (!preg_match('/<div class="seo-pathways">(.*?)<\/div>\s*/is', $html, $wrap)) {
        return [];
    }
    $cards = [];
    if (!preg_match_all('/<div class="seo-pathway-card">(.*?)<\/div>/is', $wrap[1], $matches)) {
        return [];
    }
    foreach ($matches[1] as $card) {
        $title = '';
        $desc = '';
        if (preg_match('/<h4[^>]*>(.*?)<\/h4>/is', $card, $h)) {
            $title = trim(html_entity_decode(strip_tags($h[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }
        if (preg_match('/<p[^>]*>(.*?)<\/p>/is', $card, $p)) {
            $desc = trim(html_entity_decode(strip_tags($p[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }
        if ($title !== '') {
            $cards[] = ['title' => $title, 'description' => $desc];
        }
    }
    return $cards;
}

/**
 * @return list<array{title: string, description: string}>
 */
function cws_dsmt_extract_list_items(string $html, string $tag): array
{
    $items = [];
    if (!preg_match('/<' . $tag . '[^>]*>(.*?)<\/' . $tag . '>/is', $html, $m)) {
        return [];
    }
    if (!preg_match_all('/<li[^>]*>(.*?)<\/li>/is', $m[1], $lis)) {
        return [];
    }
    foreach ($lis[1] as $li) {
        $li = trim($li);
        if ($li === '') {
            continue;
        }
        if (preg_match('/<strong[^>]*>(.*?)<\/strong>\s*:?\s*(.*)/is', $li, $parts)) {
            $items[] = [
                'title'       => trim(strip_tags($parts[1])),
                'description' => trim(strip_tags($parts[2])),
            ];
        } else {
            $items[] = [
                'title'       => '',
                'description' => trim(strip_tags($li)),
            ];
        }
    }
    return $items;
}

/** @return list<string> */
function cws_dsmt_extract_paragraphs_html(string $html): array
{
    $html = (string) preg_replace('/<ul[^>]*>.*?<\/ul>/is', '', $html);
    $html = (string) preg_replace('/<ol[^>]*>.*?<\/ol>/is', '', $html);
    $out = [];
    if (preg_match_all('/<p[^>]*>.*?<\/p>/is', $html, $ps)) {
        foreach ($ps[0] as $p) {
            $t = trim($p);
            if ($t !== '') {
                $out[] = $t;
            }
        }
    }
    return $out;
}
