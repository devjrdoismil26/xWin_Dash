<?php

namespace App\Domains\SocialBuffer\Services;

use App\Domains\SocialBuffer\Models\ShortenedLink;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Illuminate\Support\Str;

class LinkShortenerService
{
    public function shortenUrl(string $longUrl): ShortenedLink
    {
        $shortCode = $this->generateUniqueShortCode();
        $shortenedLink = ShortenedLink::create([
            'short_code' => $shortCode,
            'long_url' => $longUrl,
        ]);

        LoggerFacade::info("URL shortened", ["long_url" => $longUrl, "short_url" => $shortenedLink->short_url]);
        return $shortenedLink;
    }

    private function generateUniqueShortCode(): string
    {
        $shortCode = Str::random(6);
        while (ShortenedLink::where('short_code', $shortCode)->exists()) {
            $shortCode = Str::random(6);
        }
        return $shortCode;
    }

    public function getLongUrl(string $shortCode): ?string
    {
        $shortenedLink = ShortenedLink::where('short_code', $shortCode)->first();

        if ($shortenedLink) {
            LoggerFacade::info("Retrieved long URL", ["short_code" => $shortCode, "long_url" => $shortenedLink->long_url]);
            return $shortenedLink->long_url;
        }
        LoggerFacade::warning("Short code not found: " . $shortCode);
        return null;
    }

    public function incrementClicks(string $shortCode): void
    {
        ShortenedLink::where('short_code', $shortCode)->increment('clicks');
    }

    public function getAllShortenedUrls(int $perPage = 15): LengthAwarePaginator
    {
        $shortenedLinks = ShortenedLink::paginate($perPage);
        LoggerFacade::info("Retrieving all shortened URLs");
        return $shortenedLinks;
    }

    public function deleteShortenedUrl(string $id): bool
    {
        $deleted = ShortenedLink::destroy($id);
        if ($deleted) {
            LoggerFacade::info("Deleted shortened URL: " . $id);
            return true;
        }
        LoggerFacade::warning("Shortened URL not found for deletion: " . $id);
        return false;
    }
}
