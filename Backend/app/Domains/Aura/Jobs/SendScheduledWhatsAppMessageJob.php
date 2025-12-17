<?php

namespace App\Domains\Aura\Jobs;

use App\Domains\Aura\Services\WhatsAppMessageService;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendScheduledWhatsAppMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private string $messageId) {}

    public function handle(WhatsAppMessageService $messageService): void
    {
        $message = AuraMessageModel::findOrFail($this->messageId);
        
        if ($message->status !== 'scheduled') {
            return;
        }

        $chat = $message->chat;
        $result = $messageService->sendMessage(
            $chat->connection_id,
            $chat->contact_phone,
            $message->content,
            $message->type ?? 'text',
            $message->metadata ?? []
        );

        $message->update([
            'status' => $result['success'] ? 'sent' : 'failed',
            'whatsapp_message_id' => $result['message_id'] ?? null,
            'error_message' => $result['error'] ?? null,
            'sent_at' => now(),
        ]);
    }
}
