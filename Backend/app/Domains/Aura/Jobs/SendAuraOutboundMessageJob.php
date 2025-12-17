<?php

namespace App\Domains\Aura\Jobs;

use App\Domains\Aura\Services\WhatsAppMessageService;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendAuraOutboundMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    public function __construct(
        private string $chatId,
        private string $content,
        private string $type = 'text',
        private array $metadata = []
    ) {}

    public function handle(WhatsAppMessageService $messageService): void
    {
        try {
            $chat = AuraChatModel::findOrFail($this->chatId);
            
            // Criar registro da mensagem
            $message = AuraMessageModel::create([
                'chat_id' => $this->chatId,
                'direction' => 'outbound',
                'content' => $this->content,
                'type' => $this->type,
                'status' => 'pending',
                'metadata' => $this->metadata,
                'sent_by' => auth()->id(),
            ]);

            // Enviar via WhatsApp
            $result = $messageService->sendMessage(
                $chat->connection_id,
                $chat->contact_phone,
                $this->content,
                $this->type,
                $this->metadata
            );

            // Atualizar status
            $message->update([
                'status' => $result['success'] ? 'sent' : 'failed',
                'whatsapp_message_id' => $result['message_id'] ?? null,
                'error_message' => $result['error'] ?? null,
                'sent_at' => $result['success'] ? now() : null,
            ]);

            $chat->update(['last_message_at' => now()]);

        } catch (\Exception $e) {
            Log::error('Error sending outbound message', [
                'chat_id' => $this->chatId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
