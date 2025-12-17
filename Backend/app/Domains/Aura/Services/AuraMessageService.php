<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Aura\Jobs\SendAuraOutboundMessageJob;
use Illuminate\Support\Collection;

class AuraMessageService
{
    public function sendMessage(string $chatId, string $content, string $type = 'text', array $metadata = []): array
    {
        $chat = AuraChatModel::findOrFail($chatId);
        
        dispatch(new SendAuraOutboundMessageJob($chatId, $content, $type, $metadata));

        return [
            'success' => true,
            'message' => 'Message queued for sending',
            'chat_id' => $chatId,
        ];
    }

    public function getMessages(string $chatId, int $limit = 50): Collection
    {
        return AuraMessageModel::where('chat_id', $chatId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function markAsRead(string $messageId): bool
    {
        $message = AuraMessageModel::findOrFail($messageId);
        return $message->update(['read_at' => now()]);
    }

    public function deleteMessage(string $messageId): bool
    {
        return AuraMessageModel::findOrFail($messageId)->delete();
    }

    public function scheduleMessage(string $chatId, string $content, \DateTime $scheduledAt, array $metadata = []): array
    {
        $message = AuraMessageModel::create([
            'chat_id' => $chatId,
            'direction' => 'outbound',
            'content' => $content,
            'status' => 'scheduled',
            'scheduled_at' => $scheduledAt,
            'metadata' => $metadata,
        ]);

        dispatch(new \App\Domains\Aura\Jobs\SendScheduledWhatsAppMessageJob($message->id))
            ->delay($scheduledAt);

        return [
            'success' => true,
            'message_id' => $message->id,
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
        ];
    }
}
