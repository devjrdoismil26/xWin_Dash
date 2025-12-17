<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Jobs\ProcessWhatsAppMessage;
use Illuminate\Support\Facades\Log;

class WebhookService
{
    public function handleWhatsAppWebhook(array $payload): array
    {
        try {
            $entry = $payload['entry'][0] ?? null;
            if (!$entry) {
                return ['success' => false, 'error' => 'Invalid payload'];
            }

            $changes = $entry['changes'][0] ?? null;
            if (!$changes || $changes['field'] !== 'messages') {
                return ['success' => true, 'message' => 'Not a message event'];
            }

            $value = $changes['value'];
            $messages = $value['messages'] ?? [];

            foreach ($messages as $message) {
                $this->processIncomingMessage($message, $value['metadata'] ?? []);
            }

            return ['success' => true, 'processed' => count($messages)];

        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'error' => $e->getMessage(),
                'payload' => $payload,
            ]);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function processIncomingMessage(array $message, array $metadata): void
    {
        $connectionId = $metadata['phone_number_id'] ?? null;
        $from = $message['from'] ?? null;
        $messageBody = $message['text']['body'] ?? $message['caption'] ?? '';

        if (!$connectionId || !$from) {
            return;
        }

        dispatch(new ProcessWhatsAppMessage(
            $connectionId,
            $from,
            $messageBody,
            [
                'message_id' => $message['id'] ?? null,
                'type' => $message['type'] ?? 'text',
                'timestamp' => $message['timestamp'] ?? null,
            ]
        ));
    }

    public function verifyWebhook(string $mode, string $token, string $challenge, string $verifyToken): ?string
    {
        if ($mode === 'subscribe' && $token === $verifyToken) {
            Log::info('Webhook verified successfully');
            return $challenge;
        }

        Log::warning('Webhook verification failed', compact('mode', 'token'));
        return null;
    }
}
