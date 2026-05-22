<?php

declare(strict_types=1);

final class DesimentorRepository
{
    private const ENTITY_TYPES = ['page', 'homepage', 'service_landing', 'service', 'blog_post'];

    public function __construct(private PDO $db) {}

    public function tableExists(): bool
    {
        $stmt = $this->db->query("SHOW TABLES LIKE 'desimentor_documents'");
        return (bool) $stmt->fetch();
    }

    public function getDocument(string $entityType, int $entityId, bool $includeDraft = true): ?array
    {
        if (!$this->tableExists()) {
            return null;
        }
        $this->assertEntityType($entityType);
        $where = 'entity_type = :t AND entity_id = :id';
        if (!$includeDraft) {
            $where .= " AND status = 'published'";
        }
        $stmt = $this->db->prepare("SELECT * FROM desimentor_documents WHERE {$where} LIMIT 1");
        $stmt->execute([':t' => $entityType, ':id' => $entityId]);
        $row = $stmt->fetch();
        return $row ? $this->mapDocument($row) : null;
    }

    public function saveDocument(string $entityType, int $entityId, array $content, string $status = 'draft'): array
    {
        if (!$this->tableExists()) {
            throw new RuntimeException('Desimentor tables not installed. Run migrate-007.php.');
        }
        $this->assertEntityType($entityType);
        if (!in_array($status, ['draft', 'published'], true)) {
            $status = 'draft';
        }
        $json = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        $existing = $this->getRawDocument($entityType, $entityId);
        if ($existing) {
            $rev = (int) $existing['revision'] + 1;
            $stmt = $this->db->prepare(
                'UPDATE desimentor_documents SET content_json = :c, status = :st, revision = :r WHERE id = :id'
            );
            $stmt->execute([':c' => $json, ':st' => $status, ':r' => $rev, ':id' => $existing['id']]);
        } else {
            $stmt = $this->db->prepare(
                'INSERT INTO desimentor_documents (entity_type, entity_id, content_json, status, revision)
                 VALUES (:t, :id, :c, :st, 1)'
            );
            $stmt->execute([':t' => $entityType, ':id' => $entityId, ':c' => $json, ':st' => $status]);
        }
        return $this->getDocument($entityType, $entityId, true) ?? [];
    }

    public function publish(string $entityType, int $entityId): array
    {
        $doc = $this->getDocument($entityType, $entityId, true);
        if (!$doc) {
            throw new RuntimeException('No document to publish.');
        }
        return $this->saveDocument($entityType, $entityId, $doc['content'], 'published');
    }

    public function ensureDocument(string $entityType, int $entityId): array
    {
        $existing = $this->getDocument($entityType, $entityId, true);
        if ($existing) {
            return $existing;
        }
        return $this->saveDocument($entityType, $entityId, $this->emptyDocument(), 'draft');
    }

    public function getAdminMeta(string $entityType, int $entityId): array
    {
        if (!$this->tableExists()) {
            return [
                'hasDocument'   => false,
                'status'        => null,
                'sectionCount'  => 0,
                'revision'      => 0,
            ];
        }
        $doc = $this->getDocument($entityType, $entityId, true);
        if (!$doc) {
            return [
                'hasDocument'   => false,
                'status'        => null,
                'sectionCount'  => 0,
                'revision'      => 0,
            ];
        }
        $sections = $doc['content']['sections'] ?? [];
        return [
            'hasDocument'   => true,
            'status'        => $doc['status'] ?? 'draft',
            'sectionCount'  => is_array($sections) ? count($sections) : 0,
            'revision'      => (int) ($doc['revision'] ?? 1),
        ];
    }

    public function listTemplates(string $category = 'all'): array
    {
        if (!$this->templatesTableExists()) {
            return [];
        }
        $where = "status = 'published'";
        $params = [];
        if ($category !== 'all' && in_array($category, ['section', 'page', 'widget'], true)) {
            $where .= ' AND category = :cat';
            $params[':cat'] = $category;
        }
        $stmt = $this->db->prepare(
            "SELECT id, name, slug, category, thumbnail_media_id, created_at, updated_at
             FROM desimentor_templates WHERE {$where} ORDER BY name ASC"
        );
        $stmt->execute($params);
        $items = [];
        while ($row = $stmt->fetch()) {
            $items[] = [
                'id'                => (int) $row['id'],
                'name'              => $row['name'],
                'slug'              => $row['slug'],
                'category'          => $row['category'],
                'thumbnailMediaId'  => $row['thumbnail_media_id'] ? (int) $row['thumbnail_media_id'] : null,
                'createdAt'         => $row['created_at'],
                'updatedAt'         => $row['updated_at'],
            ];
        }
        return $items;
    }

    public function getTemplate(int $id): ?array
    {
        if (!$this->templatesTableExists()) {
            return null;
        }
        $stmt = $this->db->prepare('SELECT * FROM desimentor_templates WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ? $this->mapTemplate($row) : null;
    }

    public function getTemplateBySlug(string $slug): ?array
    {
        if (!$this->templatesTableExists()) {
            return null;
        }
        $stmt = $this->db->prepare('SELECT * FROM desimentor_templates WHERE slug = :slug LIMIT 1');
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        return $row ? $this->mapTemplate($row) : null;
    }

    public function saveTemplate(array $data, ?int $id = null): array
    {
        if (!$this->templatesTableExists()) {
            throw new RuntimeException('Desimentor templates table not installed.');
        }
        $name = trim((string) ($data['name'] ?? 'Template'));
        $slug = $this->uniqueTemplateSlug((string) ($data['slug'] ?? $name), $id);
        $category = (string) ($data['category'] ?? 'section');
        if (!in_array($category, ['section', 'page', 'widget'], true)) {
            $category = 'section';
        }
        $content = $data['content'] ?? ['version' => 1, 'sections' => []];
        $json = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        $thumb = isset($data['thumbnailMediaId']) ? (int) $data['thumbnailMediaId'] : null;
        $status = ($data['status'] ?? 'published') === 'draft' ? 'draft' : 'published';

        if ($id) {
            $stmt = $this->db->prepare(
                'UPDATE desimentor_templates SET name = :n, slug = :s, category = :c,
                 content_json = :j, thumbnail_media_id = :thumb, status = :st WHERE id = :id'
            );
            $stmt->execute([
                ':n' => $name, ':s' => $slug, ':c' => $category, ':j' => $json,
                ':thumb' => $thumb ?: null, ':st' => $status, ':id' => $id,
            ]);
        } else {
            $stmt = $this->db->prepare(
                'INSERT INTO desimentor_templates (name, slug, category, content_json, thumbnail_media_id, status)
                 VALUES (:n, :s, :c, :j, :thumb, :st)'
            );
            $stmt->execute([
                ':n' => $name, ':s' => $slug, ':c' => $category, ':j' => $json,
                ':thumb' => $thumb ?: null, ':st' => $status,
            ]);
            $id = (int) $this->db->lastInsertId();
        }
        return $this->getTemplate($id) ?? [];
    }

    public function deleteTemplate(int $id): void
    {
        $this->db->prepare('DELETE FROM desimentor_templates WHERE id = :id')->execute([':id' => $id]);
    }

    public function emptyDocument(): array
    {
        return ['version' => 1, 'sections' => []];
    }

    public function createPreviewToken(string $entityType, int $entityId): string
    {
        $secret = (string) cws_config('preview_secret', 'cws-desimentor-preview');
        $exp = time() + 3600;
        $payload = $entityType . '|' . $entityId . '|' . $exp;
        $sig = hash_hmac('sha256', $payload, $secret);
        return base64_encode($payload . '|' . $sig);
    }

    public function verifyPreviewToken(string $token): ?array
    {
        $decoded = base64_decode($token, true);
        if (!$decoded) {
            return null;
        }
        $parts = explode('|', $decoded);
        if (count($parts) !== 4) {
            return null;
        }
        [$entityType, $entityId, $exp, $sig] = $parts;
        $secret = (string) cws_config('preview_secret', 'cws-desimentor-preview');
        $payload = $entityType . '|' . $entityId . '|' . $exp;
        if (!hash_equals(hash_hmac('sha256', $payload, $secret), $sig)) {
            return null;
        }
        if ((int) $exp < time()) {
            return null;
        }
        if (!in_array($entityType, self::ENTITY_TYPES, true)) {
            return null;
        }
        return ['entityType' => $entityType, 'entityId' => (int) $entityId];
    }

    /** @return array<string, mixed>|null */
    private function getRawDocument(string $entityType, int $entityId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM desimentor_documents WHERE entity_type = :t AND entity_id = :id LIMIT 1'
        );
        $stmt->execute([':t' => $entityType, ':id' => $entityId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    private function mapDocument(array $row): array
    {
        $content = json_decode((string) $row['content_json'], true);
        if (!is_array($content)) {
            $content = $this->emptyDocument();
        }
        return [
            'id'         => (int) $row['id'],
            'entityType' => $row['entity_type'],
            'entityId'   => (int) $row['entity_id'],
            'content'    => $content,
            'status'     => $row['status'],
            'revision'   => (int) $row['revision'],
            'updatedAt'  => $row['updated_at'],
        ];
    }

    private function mapTemplate(array $row): array
    {
        $content = json_decode((string) $row['content_json'], true);
        if (!is_array($content)) {
            $content = $this->emptyDocument();
        }
        return [
            'id'               => (int) $row['id'],
            'name'             => $row['name'],
            'slug'             => $row['slug'],
            'category'         => $row['category'],
            'content'          => $content,
            'thumbnailMediaId' => $row['thumbnail_media_id'] ? (int) $row['thumbnail_media_id'] : null,
            'status'           => $row['status'],
            'createdAt'        => $row['created_at'],
            'updatedAt'        => $row['updated_at'],
        ];
    }

    private function uniqueTemplateSlug(string $slug, ?int $excludeId): string
    {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $slug) ?? 'template');
        $slug = trim($slug, '-') ?: 'template';
        $base = $slug;
        $n = 1;
        while (true) {
            $stmt = $this->db->prepare('SELECT id FROM desimentor_templates WHERE slug = :s LIMIT 1');
            $stmt->execute([':s' => $slug]);
            $row = $stmt->fetch();
            if (!$row || ($excludeId && (int) $row['id'] === $excludeId)) {
                return $slug;
            }
            $slug = $base . '-' . $n++;
        }
    }

    private function templatesTableExists(): bool
    {
        $stmt = $this->db->query("SHOW TABLES LIKE 'desimentor_templates'");
        return (bool) $stmt->fetch();
    }

    private function assertEntityType(string $entityType): void
    {
        if (!in_array($entityType, self::ENTITY_TYPES, true)) {
            throw new InvalidArgumentException('Invalid entity type.');
        }
    }
}

function cws_desimentor(): DesimentorRepository
{
    static $repo = null;
    if (!$repo) {
        $repo = new DesimentorRepository(cws_db());
    }
    return $repo;
}
