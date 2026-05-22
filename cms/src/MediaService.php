<?php

declare(strict_types=1);

final class MediaService
{
    private const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
    private const MAX_VIDEO_BYTES = 80 * 1024 * 1024;
    private const MAX_AUDIO_BYTES = 30 * 1024 * 1024;
    private const MAX_DOC_BYTES = 25 * 1024 * 1024;

    /** @var array<string, array{ext: string[], type: string, max: int}> */
    private const ALLOWED = [
        'image/jpeg'      => ['ext' => ['jpg', 'jpeg'], 'type' => 'image', 'max' => self::MAX_IMAGE_BYTES],
        'image/png'       => ['ext' => ['png'], 'type' => 'image', 'max' => self::MAX_IMAGE_BYTES],
        'image/gif'       => ['ext' => ['gif'], 'type' => 'image', 'max' => self::MAX_IMAGE_BYTES],
        'image/webp'      => ['ext' => ['webp'], 'type' => 'image', 'max' => self::MAX_IMAGE_BYTES],
        'audio/mpeg'      => ['ext' => ['mp3'], 'type' => 'audio', 'max' => self::MAX_AUDIO_BYTES],
        'audio/mp4'       => ['ext' => ['m4a'], 'type' => 'audio', 'max' => self::MAX_AUDIO_BYTES],
        'audio/wav'       => ['ext' => ['wav'], 'type' => 'audio', 'max' => self::MAX_AUDIO_BYTES],
        'audio/x-wav'     => ['ext' => ['wav'], 'type' => 'audio', 'max' => self::MAX_AUDIO_BYTES],
        'audio/ogg'       => ['ext' => ['ogg'], 'type' => 'audio', 'max' => self::MAX_AUDIO_BYTES],
        'video/mp4'       => ['ext' => ['mp4'], 'type' => 'video', 'max' => self::MAX_VIDEO_BYTES],
        'video/webm'      => ['ext' => ['webm'], 'type' => 'video', 'max' => self::MAX_VIDEO_BYTES],
        'video/quicktime' => ['ext' => ['mov'], 'type' => 'video', 'max' => self::MAX_VIDEO_BYTES],
        'application/pdf' => ['ext' => ['pdf'], 'type' => 'document', 'max' => self::MAX_DOC_BYTES],
    ];

    public function __construct(private MediaRepository $repo) {}

    public static function publicUrl(int $id, string $variant = 'medium'): string
    {
        $base = rtrim((string) cws_config('cms_public_url', ''), '/');
        return $base . '/api/v1/media/' . $id . '/file?variant=' . rawurlencode($variant);
    }

    /** @param array{title?: string, alt_text?: string, altText?: string} $meta */
    public function upload(array $file, array $meta = []): array
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new RuntimeException('Upload failed or no file sent.');
        }
        $tmp = (string) ($file['tmp_name'] ?? '');
        if (!is_uploaded_file($tmp)) {
            throw new RuntimeException('Invalid upload.');
        }

        $originalName = $this->sanitizeFilename((string) ($file['name'] ?? 'file'));
        $size = (int) ($file['size'] ?? 0);
        $mime = $this->detectMime($tmp, $originalName);
        $rule = self::ALLOWED[$mime] ?? null;
        if (!$rule) {
            throw new RuntimeException('File type not allowed. Use images, audio, video, or PDF only.');
        }
        if ($size > $rule['max']) {
            throw new RuntimeException('File exceeds maximum allowed size.');
        }

        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        if (!in_array($ext, $rule['ext'], true)) {
            throw new RuntimeException('File extension does not match file type.');
        }

        $subdir = date('Y/m/d');
        $dir = $this->uploadRoot() . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $subdir);
        if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
            throw new RuntimeException('Cannot create upload directory.');
        }

        $defaultTitle = pathinfo($originalName, PATHINFO_FILENAME);
        $title = trim((string) ($meta['title'] ?? $defaultTitle));
        $alt = trim((string) ($meta['alt_text'] ?? $meta['altText'] ?? $title));
        if ($title === '') {
            $title = $defaultTitle;
        }
        if ($alt === '') {
            $alt = $title;
        }

        $stored = $this->seoStoredName($title, $alt, $originalName, $ext);
        $dest = $dir . '/' . $stored;
        if (!move_uploaded_file($tmp, $dest)) {
            throw new RuntimeException('Failed to store uploaded file.');
        }

        $relative = $subdir . '/' . $stored; // forward slashes in DB
        $width = null;
        $height = null;
        $thumb = null;
        $medium = null;
        $large = null;

        if ($rule['type'] === 'image') {
            [$width, $height] = $this->imageDimensions($dest);
            [$thumb, $medium, $large] = $this->generateImageVariants($dest, $dir, $stored, $ext);
        }

        $id = $this->repo->insert([
            'original_name' => $originalName,
            'stored_name'   => $stored,
            'mime_type'     => $mime,
            'media_type'    => $rule['type'],
            'file_size'     => $size,
            'width'         => $width,
            'height'        => $height,
            'alt_text'      => $alt,
            'title'         => $title,
            'caption'       => '',
            'description'   => '',
            'file_path'     => $relative,
            'thumb_path'    => $thumb,
            'medium_path'   => $medium,
            'large_path'    => $large,
        ]);

        $row = $this->repo->getById($id);
        if (!$row) {
            throw new RuntimeException('Failed to save media record.');
        }
        return $row;
    }

    public function updateMeta(int $id, array $body): array
    {
        $row = $this->repo->getById($id);
        if (!$row) {
            throw new RuntimeException('Media not found.');
        }
        $this->repo->updateMeta($id, [
            'alt_text'    => (string) ($body['altText'] ?? $body['alt_text'] ?? $row['altText']),
            'title'       => (string) ($body['title'] ?? $row['title']),
            'caption'     => (string) ($body['caption'] ?? $row['caption']),
            'description' => (string) ($body['description'] ?? $row['description']),
        ]);
        return $this->repo->getById($id) ?? $row;
    }

    public function crop(int $id, array $crop): array
    {
        $row = $this->repo->getRawById($id);
        if (!$row || ($row['media_type'] ?? '') !== 'image') {
            throw new RuntimeException('Image not found.');
        }
        $src = $this->absolutePath((string) $row['file_path']);
        if (!is_file($src)) {
            throw new RuntimeException('Original file missing.');
        }

        $x = max(0, (int) ($crop['x'] ?? 0));
        $y = max(0, (int) ($crop['y'] ?? 0));
        $w = max(1, (int) ($crop['width'] ?? 0));
        $h = max(1, (int) ($crop['height'] ?? 0));

        $img = $this->loadImage($src, (string) $row['mime_type']);
        if (!$img) {
            throw new RuntimeException('Cannot process image.');
        }
        $sw = imagesx($img);
        $sh = imagesy($img);
        $w = min($w, $sw - $x);
        $h = min($h, $sh - $y);
        $cropped = imagecrop($img, ['x' => $x, 'y' => $y, 'width' => $w, 'height' => $h]);
        imagedestroy($img);
        if ($cropped === false) {
            throw new RuntimeException('Crop failed.');
        }

        $dir = dirname($src);
        $ext = strtolower(pathinfo($src, PATHINFO_EXTENSION));
        $this->saveImageResource($cropped, $src, $ext);
        imagedestroy($cropped);

        [$width, $height] = $this->imageDimensions($src);
        $stored = basename($src);
        $this->removeVariants($row);
        [$thumb, $medium, $large] = $this->generateImageVariants($src, $dir, $stored, $ext);

        $this->repo->updateMeta($id, [
            'alt_text'    => $row['alt_text'] ?? '',
            'title'       => $row['title'] ?? '',
            'caption'     => $row['caption'] ?? '',
            'description' => $row['description'] ?? '',
            'file_path'   => $row['file_path'],
            'thumb_path'  => $thumb,
            'medium_path' => $medium,
            'large_path'  => $large,
            'width'       => $width,
            'height'      => $height,
            'file_size'   => filesize($src) ?: (int) ($row['file_size'] ?? 0),
        ]);

        return $this->repo->getById($id) ?? $row;
    }

    public function delete(int $id): void
    {
        $row = $this->repo->delete($id);
        if (!$row) {
            return;
        }
        foreach (['file_path', 'thumb_path', 'medium_path', 'large_path'] as $key) {
            $path = $row[$key] ?? null; // raw DB row from delete()
            if (!$path) {
                continue;
            }
            $abs = $this->absolutePath(is_string($path) ? $path : '');
            if (is_file($abs)) {
                @unlink($abs);
            }
        }
    }

    public function serve(int $id, string $variant): void
    {
        $row = $this->repo->getRawById($id);
        if (!$row) {
            http_response_code(404);
            exit;
        }
        $pathKey = match ($variant) {
            'thumb'    => 'thumb_path',
            'medium'   => 'medium_path',
            'large'    => 'large_path',
            'original' => 'file_path',
            default    => 'medium_path',
        };
        $rel = $row[$pathKey] ?? $row['file_path'] ?? null;
        if (!$rel) {
            $rel = $row['file_path'] ?? null;
        }
        if (!$rel) {
            http_response_code(404);
            exit;
        }
        $abs = $this->absolutePath((string) $rel);
        if (!is_file($abs)) {
            http_response_code(404);
            exit;
        }
        $mime = (string) ($row['mime_type'] ?? 'application/octet-stream');
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . (string) filesize($abs));
        header('Cache-Control: public, max-age=31536000, immutable');
        header('X-Content-Type-Options: nosniff');
        readfile($abs);
        exit;
    }

    private function uploadRoot(): string
    {
        $dir = (string) cws_config('upload_dir', CWS_CMS_ROOT . '/uploads');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    private function absolutePath(string $relative): string
    {
        return $this->uploadRoot() . '/' . ltrim(str_replace(['\\', '..'], ['/', ''], $relative), '/');
    }

    private function detectMime(string $tmp, string $name): string
    {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = $finfo ? (finfo_file($finfo, $tmp) ?: '') : '';
        if ($finfo) {
            finfo_close($finfo);
        }
        if ($mime && isset(self::ALLOWED[$mime])) {
            return $mime;
        }
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        foreach (self::ALLOWED as $m => $rule) {
            if (in_array($ext, $rule['ext'], true)) {
                return $m;
            }
        }
        return $mime ?: 'application/octet-stream';
    }

    private function sanitizeFilename(string $name): string
    {
        $name = basename(str_replace(["\0", '\\'], '', $name));
        $name = preg_replace('/[^a-zA-Z0-9._-]/', '-', $name) ?? 'file';
        return $name !== '' ? $name : 'file';
    }

    private function seoSlug(string $text): string
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
        $text = trim($text, '-');
        if ($text === '') {
            return 'media';
        }
        return substr($text, 0, 80);
    }

    private function seoStoredName(string $title, string $alt, string $originalName, string $ext): string
    {
        $base = $this->seoSlug($title);
        if ($base === 'media' || strlen($base) < 3) {
            $base = $this->seoSlug($alt);
        }
        if ($base === 'media' || strlen($base) < 3) {
            $base = $this->seoSlug(pathinfo($originalName, PATHINFO_FILENAME));
        }
        $suffix = substr(bin2hex(random_bytes(3)), 0, 6);
        return $base . '-' . $suffix . '.' . $ext;
    }

    /** @return array{0: ?int, 1: ?int} */
    private function imageDimensions(string $path): array
    {
        $info = @getimagesize($path);
        if (!$info) {
            return [null, null];
        }
        return [(int) $info[0], (int) $info[1]];
    }

    /** @return array{0: ?string, 1: ?string, 2: ?string} */
    private function generateImageVariants(string $src, string $dir, string $stored, string $ext): array
    {
        $base = pathinfo($stored, PATHINFO_FILENAME);
        $thumb = $base . '-thumb.' . $ext;
        $medium = $base . '-medium.' . $ext;
        $large = $base . '-large.' . $ext;
        $mime = $this->detectMime($src, $stored);
        $img = $this->loadImage($src, $mime);
        if (!$img) {
            return [null, null, null];
        }
        $this->resizeToMax($img, $dir . '/' . $thumb, $ext, 150, 150, true);
        $copy = $this->loadImage($src, $mime);
        if ($copy) {
            $this->resizeToMax($copy, $dir . '/' . $medium, $ext, 600, 600, false);
            imagedestroy($copy);
        }
        $copy2 = $this->loadImage($src, $mime);
        if ($copy2) {
            $this->resizeToMax($copy2, $dir . '/' . $large, $ext, 1920, 1920, false);
            imagedestroy($copy2);
        }
        imagedestroy($img);
        $subdir = $this->relativeDirFromAbsolute($dir);
        return [
            $subdir . '/' . $thumb,
            $subdir . '/' . $medium,
            $subdir . '/' . $large,
        ];
    }

    private function relativeDirFromAbsolute(string $dir): string
    {
        $root = str_replace('\\', '/', $this->uploadRoot());
        $abs = str_replace('\\', '/', $dir);
        if (str_starts_with($abs, $root)) {
            return trim(substr($abs, strlen($root)), '/');
        }
        return trim(str_replace('\\', '/', $dir), '/');
    }

    private function removeVariants(array $row): void
    {
        foreach (['thumb_path', 'medium_path', 'large_path'] as $k) {
            $p = $row[$k] ?? null;
            if (!$p || !is_string($p)) {
                continue;
            }
            $abs = $this->absolutePath($p);
            if (is_file($abs)) {
                @unlink($abs);
            }
        }
    }

    /** @param \GdImage $img */
    private function resizeToMax($img, string $dest, string $ext, int $maxW, int $maxH, bool $cover): void
    {
        $w = imagesx($img);
        $h = imagesy($img);
        if ($cover) {
            $ratio = max($maxW / $w, $maxH / $h);
            $nw = (int) ceil($w * $ratio);
            $nh = (int) ceil($h * $ratio);
            $tmp = imagecreatetruecolor($maxW, $maxH);
            imagealphablending($tmp, false);
            imagesavealpha($tmp, true);
            $dx = (int) (($maxW - $nw) / 2);
            $dy = (int) (($maxH - $nh) / 2);
            imagecopyresampled($tmp, $img, $dx, $dy, 0, 0, $nw, $nh, $w, $h);
            $this->saveImageResource($tmp, $dest, $ext);
            imagedestroy($tmp);
            return;
        }
        $ratio = min($maxW / $w, $maxH / $h, 1);
        $nw = max(1, (int) round($w * $ratio));
        $nh = max(1, (int) round($h * $ratio));
        $tmp = imagecreatetruecolor($nw, $nh);
        imagealphablending($tmp, false);
        imagesavealpha($tmp, true);
        imagecopyresampled($tmp, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
        $this->saveImageResource($tmp, $dest, $ext);
        imagedestroy($tmp);
    }

    /** @return \GdImage|null */
    private function loadImage(string $path, string $mime)
    {
        return match ($mime) {
            'image/jpeg' => @imagecreatefromjpeg($path) ?: null,
            'image/png'  => @imagecreatefrompng($path) ?: null,
            'image/gif'  => @imagecreatefromgif($path) ?: null,
            'image/webp' => function_exists('imagecreatefromwebp') ? (@imagecreatefromwebp($path) ?: null) : null,
            default      => null,
        };
    }

    /** @param \GdImage $img */
    private function saveImageResource($img, string $dest, string $ext): void
    {
        match ($ext) {
            'jpg', 'jpeg' => imagejpeg($img, $dest, 88),
            'png'         => imagepng($img, $dest, 6),
            'gif'         => imagegif($img, $dest),
            'webp'        => function_exists('imagewebp') ? imagewebp($img, $dest, 85) : imagejpeg($img, $dest, 88),
            default       => imagejpeg($img, $dest, 88),
        };
    }
}

function cws_media_repo(): MediaRepository
{
    static $repo = null;
    if (!$repo) {
        $repo = new MediaRepository(cws_db());
    }
    return $repo;
}

function cws_media(): MediaService
{
    static $svc = null;
    if (!$svc) {
        $svc = new MediaService(cws_media_repo());
    }
    return $svc;
}
