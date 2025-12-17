<?php

namespace App\Domains\Core\Services;

class ApiConfigurationService
{
    public function get(string $provider, ?int $userId = null): array
    {
        // Simple pass-through to services.php until per-user configs are implemented
        return match ($provider) {
            'whatsapp' => config('services.whatsapp'),
            'facebook_ads' => config('services.facebook_ads'),
            'google_ads' => config('services.google_ads'),
            default => [],
        };
    }
}
