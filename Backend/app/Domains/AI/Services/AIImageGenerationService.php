<?php

namespace App\Domains\AI\Services;

class AIImageGenerationService
{
    /**
     * @param string $prompt
     * @param array<string, mixed> $parameters
     * @param int|null $userId
     * @return string
     */
    public function generate(string $prompt, array $parameters = [], ?int $userId = null): string
    {
        // Stub returning image URL
        return 'https://via.placeholder.com/1024x1024?text=' . urlencode(substr($prompt, 0, 32));
    }

    /**
     * @param string $prompt
     * @param array<string, mixed> $parameters
     * @param int|null $userId
     * @return array<string, mixed>
     */
    public function generateWithMetadata(string $prompt, array $parameters = [], ?int $userId = null): array
    {
        return [
            'image_url' => $this->generate($prompt, $parameters, $userId),
            'parameters' => $parameters,
            'user_id' => $userId,
            'prompt' => $prompt,
            'created_at' => now()->toISOString(),
        ];
    }
}
