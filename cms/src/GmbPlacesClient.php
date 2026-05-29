<?php

declare(strict_types=1);

/**
 * Fetches place rating & reviews via Google Places API (Place Details).
 * Requires Places API enabled and GOOGLE_PLACES_API_KEY in config.php.
 */
final class GmbPlacesClient
{
    public function __construct(private string $apiKey)
    {
        if ($this->apiKey === '') {
            throw new InvalidArgumentException('Google Places API key is not configured.');
        }
    }

    public static function fromConfig(): ?self
    {
        $key = (string) cws_config('google.places_api_key', '');
        if ($key === '') {
            return null;
        }

        return new self($key);
    }

    public function findPlaceId(string $textQuery): ?string
    {
        $url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?' . http_build_query([
            'input'     => $textQuery,
            'inputtype' => 'textquery',
            'fields'    => 'place_id',
            'key'       => $this->apiKey,
        ]);

        $data = $this->getJson($url);
        $candidates = $data['candidates'] ?? [];

        return isset($candidates[0]['place_id']) ? (string) $candidates[0]['place_id'] : null;
    }

    /**
     * @return array{
     *   placeId: string,
     *   name: string,
     *   rating: float,
     *   userRatingCount: int,
     *   reviews: list<array{author: string, rating: int, text: string, ago: string, time: int}>
     * }
     */
    public function getPlaceDetails(string $placeId): array
    {
        $url = 'https://maps.googleapis.com/maps/api/place/details/json?' . http_build_query([
            'place_id' => $placeId,
            'fields'   => 'place_id,name,rating,user_ratings_total,reviews,url',
            'reviews_sort' => 'newest',
            'key'      => $this->apiKey,
        ]);

        $data = $this->getJson($url);
        if (($data['status'] ?? '') !== 'OK') {
            $msg = (string) ($data['error_message'] ?? $data['status'] ?? 'Unknown error');
            throw new RuntimeException('Google Places API: ' . $msg);
        }

        $result = $data['result'] ?? [];
        $reviews = [];
        foreach ($result['reviews'] ?? [] as $r) {
            if (!is_array($r)) {
                continue;
            }
            $text = trim((string) ($r['text'] ?? ''));
            $author = trim((string) ($r['author_name'] ?? ''));
            if ($author === '' || $text === '') {
                continue;
            }
            $reviews[] = [
                'author' => $author,
                'rating' => (int) round((float) ($r['rating'] ?? 5)),
                'text'   => $text,
                'ago'    => (string) ($r['relative_time_description'] ?? ''),
                'time'   => (int) ($r['time'] ?? 0),
            ];
        }

        return [
            'placeId'         => (string) ($result['place_id'] ?? $placeId),
            'name'            => (string) ($result['name'] ?? ''),
            'rating'          => (float) ($result['rating'] ?? 0),
            'userRatingCount' => (int) ($result['user_ratings_total'] ?? 0),
            'mapsUrl'         => (string) ($result['url'] ?? ''),
            'reviews'         => $reviews,
        ];
    }

    /** @return array<string, mixed> */
    private function getJson(string $url): array
    {
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 15,
                'header'  => "Accept: application/json\r\n",
            ],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            throw new RuntimeException('Could not reach Google Places API.');
        }
        $decoded = json_decode($raw, true);

        return is_array($decoded) ? $decoded : [];
    }
}
