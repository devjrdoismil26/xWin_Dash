<?php

namespace App\Domains\AI\Services;

class ApiConfigurationService
{
    /**
     * @param int $userId
     * @param string $provider
     * @return array<string, mixed>
     */
    public function getConfigurationForUser(int $userId, string $provider): array
    {
        // Minimal fallback to .env/services.php values
        return match ($provider) {
            'gemini' => [
                'api_key' => config('services.gemini.api_key'),
                'model' => config('services.gemini.model'),
                'base_url' => config('services.gemini.base_url'),
            ],
            'openai' => [
                'api_key' => config('services.openai.api_key'),
                'model' => config('services.openai.model'),
                'base_url' => config('services.openai.base_url'),
            ],
            default => [],
        };
    }
}
