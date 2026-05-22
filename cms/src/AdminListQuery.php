<?php

declare(strict_types=1);

/** Shared search/sort helpers for admin list endpoints. */
final class AdminListQuery
{
    /** @return array{search: string, sort: string, order: string} */
    public static function fromRequest(): array
    {
        return [
            'search' => trim((string) ($_GET['search'] ?? '')),
            'sort'   => (string) ($_GET['sort'] ?? ''),
            'order'  => strtolower((string) ($_GET['order'] ?? 'desc')) === 'asc' ? 'asc' : 'desc',
        ];
    }

    public static function orderSql(string $order): string
    {
        return $order === 'asc' ? 'ASC' : 'DESC';
    }

    public static function sortColumn(string $sort, array $allowed, string $default): string
    {
        return in_array($sort, $allowed, true) ? $sort : $default;
    }

    /**
     * @param list<string> $columns
     * @param array<string, mixed> $params
     */
    public static function searchWhere(array $columns, string $search, array &$params, string $paramKey = ':adm_search'): string
    {
        if ($search === '') {
            return '';
        }
        $parts = [];
        foreach ($columns as $col) {
            $parts[] = "{$col} LIKE {$paramKey}";
        }
        $params[$paramKey] = '%' . $search . '%';

        return ' AND (' . implode(' OR ', $parts) . ')';
    }
}
