<?php

namespace App\Domains\Aura\Infrastructure\Services;

use Illuminate\Support\Facades\Http;

class MetaWhatsAppService
{
    public function __construct(
        private readonly string $accessToken,
        private readonly string $phoneNumberId
    ) {
    }

    /**
     * @param array<string, mixed> $message
     * @return array<string, mixed>
     */
    public function sendMessage(string $to, array $message): array
    {
        $response = Http::withToken($this->accessToken)
            ->post("https://graph.facebook.com/v18.0/{$this->phoneNumberId}/messages", [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => $message['type'] ?? 'text',
                $message['type'] ?? 'text' => $message['content'] ?? [],
            ]);

        return [
            'success' => $response->successful(),
            'data' => $response->json(),
            'status' => $response->status(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function uploadMedia(string $filePath, string $type): array
    {
        $contents = file_get_contents($filePath);
        if ($contents === false) {
            throw new \RuntimeException('Failed to read file: ' . $filePath);
        }

        $response = Http::withToken($this->accessToken)
            ->attach('file', $contents)
            ->post("https://graph.facebook.com/v18.0/{$this->phoneNumberId}/media", [
                'messaging_product' => 'whatsapp',
                'type' => $type,
            ]);

        return [
            'success' => $response->successful(),
            'data' => $response->json(),
            'status' => $response->status(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function getMedia(string $mediaId): array
    {
        $response = Http::withToken($this->accessToken)
            ->get("https://graph.facebook.com/v18.0/{$mediaId}");

        return [
            'success' => $response->successful(),
            'data' => $response->json(),
            'status' => $response->status(),
        ];
    }
}
