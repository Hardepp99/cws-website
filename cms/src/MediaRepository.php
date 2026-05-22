<?php

declare(strict_types=1);

final class MediaRepository
{
    public function __construct(private PDO $db) {}

    public function listMedia(
        int $page = 1,
        int $perPage = 24,
        string $type = 'all',
        string $search = '',
        string $sort = '',
        string $order = 'desc'
    ): array {
        $where = 'WHERE 1=1';
        $params = [];
        if ($type !== 'all' && in_array($type, ['image', 'audio', 'video', 'document'], true)) {
            $where .= ' AND media_type = :type';
            $params[':type'] = $type;
        }
        $where .= AdminListQuery::searchWhere(
            ['original_name', 'title', 'alt_text', 'caption', 'description', 'mime_type'],
            $search,
            $params,
            ':adm_search'
        );
        $sortCol = AdminListQuery::sortColumn(
            $sort,
            ['created_at', 'title', 'original_name', 'file_size', 'media_type'],
            'created_at'
        );
        $orderSql = AdminListQuery::orderSql($order);

        $countStmt = $this->db->prepare("SELECT COUNT(*) AS c FROM media {$where}");
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetch()['c'] ?? 0);

        $offset = max(0, ($page - 1) * $perPage);
        $stmt = $this->db->prepare(
            "SELECT * FROM media {$where} ORDER BY {$sortCol} {$orderSql} LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':lim', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $items = [];
        while ($row = $stmt->fetch()) {
            $items[] = $this->rowToArray($row);
        }

        return ['items' => $items, 'total' => $total, 'page' => $page, 'perPage' => $perPage];
    }

    public function getById(int $id): ?array
    {
        $row = $this->getRawById($id);
        return $row ? $this->rowToArray($row) : null;
    }

    /** @return array<string, mixed>|null Raw DB row (snake_case paths). */
    public function getRawById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM media WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function insert(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO media (
                original_name, stored_name, mime_type, media_type, file_size,
                width, height, alt_text, title, caption, description,
                file_path, thumb_path, medium_path, large_path
            ) VALUES (
                :on, :sn, :mime, :mt, :size,
                :w, :h, :alt, :title, :cap, :desc,
                :fp, :tp, :mp, :lp
            )'
        );
        $stmt->execute([
            ':on'    => $data['original_name'],
            ':sn'    => $data['stored_name'],
            ':mime'  => $data['mime_type'],
            ':mt'    => $data['media_type'],
            ':size'  => $data['file_size'],
            ':w'     => $data['width'] ?? null,
            ':h'     => $data['height'] ?? null,
            ':alt'   => $data['alt_text'] ?? '',
            ':title' => $data['title'] ?? '',
            ':cap'   => $data['caption'] ?? '',
            ':desc'  => $data['description'] ?? '',
            ':fp'    => $data['file_path'],
            ':tp'    => $data['thumb_path'] ?? null,
            ':mp'    => $data['medium_path'] ?? null,
            ':lp'    => $data['large_path'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function updateMeta(int $id, array $meta): void
    {
        $stmt = $this->db->prepare(
            'UPDATE media SET
                alt_text = :alt, title = :title, caption = :cap, description = :desc,
                file_path = COALESCE(:fp, file_path),
                thumb_path = COALESCE(:tp, thumb_path),
                medium_path = COALESCE(:mp, medium_path),
                large_path = COALESCE(:lp, large_path),
                width = COALESCE(:w, width),
                height = COALESCE(:h, height),
                file_size = COALESCE(:size, file_size)
             WHERE id = :id'
        );
        $stmt->execute([
            ':alt'   => $meta['alt_text'] ?? '',
            ':title' => $meta['title'] ?? '',
            ':cap'   => $meta['caption'] ?? '',
            ':desc'  => $meta['description'] ?? '',
            ':fp'    => $meta['file_path'] ?? null,
            ':tp'    => $meta['thumb_path'] ?? null,
            ':mp'    => $meta['medium_path'] ?? null,
            ':lp'    => $meta['large_path'] ?? null,
            ':w'     => $meta['width'] ?? null,
            ':h'     => $meta['height'] ?? null,
            ':size'  => $meta['file_size'] ?? null,
            ':id'    => $id,
        ]);
    }

    public function delete(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM media WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $this->db->prepare('DELETE FROM media WHERE id = :id')->execute([':id' => $id]);
        return $row;
    }

    private function rowToArray(array $row): array
    {
        $id = (int) $row['id'];
        return [
            'id'            => $id,
            'originalName'  => $row['original_name'],
            'storedName'    => $row['stored_name'],
            'mimeType'      => $row['mime_type'],
            'mediaType'     => $row['media_type'],
            'fileSize'      => (int) $row['file_size'],
            'width'         => $row['width'] !== null ? (int) $row['width'] : null,
            'height'        => $row['height'] !== null ? (int) $row['height'] : null,
            'altText'       => $row['alt_text'],
            'title'         => $row['title'],
            'caption'       => $row['caption'],
            'description'   => $row['description'],
            'url'           => MediaService::publicUrl($id, 'medium'),
            'thumbUrl'      => MediaService::publicUrl($id, 'thumb'),
            'largeUrl'      => MediaService::publicUrl($id, 'large'),
            'originalUrl'   => MediaService::publicUrl($id, 'original'),
            'createdAt'     => $row['created_at'],
        ];
    }
}
