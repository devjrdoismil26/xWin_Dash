<?php

namespace App\Domains\Aura\Jobs;

use App\Domains\Aura\Services\AuraFlowService;
use App\Domains\Aura\Services\AuraAIService;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessWhatsAppMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private array $webhookPayload
    ) {}

    public function handle(AuraFlowService $flowService, AuraAIService $aiService): void
    {
        try {
            // Processar payload do webhook do WhatsApp
            $entries = $this->webhookPayload['entry'] ?? [];
            
            foreach ($entries as $entry) {
                $changes = $entry['changes'] ?? [];
                
                foreach ($changes as $change) {
                    $value = $change['value'] ?? [];
                    $messages = $value['messages'] ?? [];
                    
                    // Processar cada mensagem
                    foreach ($messages as $message) {
                        $this->processMessage($message, $value, $flowService, $aiService);
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Error processing WhatsApp webhook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $this->webhookPayload
            ]);
            throw $e;
        }
    }

    /**
     * Process individual message from webhook
     */
    protected function processMessage(array $message, array $value, AuraFlowService $flowService, AuraAIService $aiService): void
    {
        try {
            $from = $message['from'] ?? null;
            $messageId = $message['id'] ?? null;
            $messageType = $message['type'] ?? 'text';
            $timestamp = $message['timestamp'] ?? time();
            
            // Extrair conteúdo baseado no tipo
            $messageBody = $this->extractMessageContent($message, $messageType);
            
            // Buscar connection_id do metadata ou value
            $connectionId = $value['metadata']['phone_number_id'] ?? $value['metadata']['connection_id'] ?? null;
            
            if (!$connectionId || !$from) {
                Log::warning('WhatsApp message missing required fields', [
                    'message_id' => $messageId,
                    'from' => $from,
                    'connection_id' => $connectionId
                ]);
                return;
            }
            
            // Buscar ou criar chat
            $chat = AuraChatModel::firstOrCreate(
                ['connection_id' => $connectionId, 'contact_phone' => $from],
                ['status' => 'active', 'last_message_at' => now(), 'unread_count' => 0]
            );

            // Salvar mensagem recebida
            AuraMessageModel::create([
                'chat_id' => $chat->id,
                'direction' => 'inbound',
                'type' => $messageType,
                'content' => ['text' => $messageBody],
                'status' => 'received',
                'whatsapp_message_id' => $messageId,
                'metadata' => [
                    'timestamp' => $timestamp,
                    'raw_message' => $message
                ],
                'sent_at' => now(),
            ]);

            // Incrementar contador de não lidas
            $chat->increment('unread_count');

            // Processar com IA se habilitado
            $aiEnabled = $chat->contact_info['ai_enabled'] ?? false;
            if ($aiEnabled && $aiService) {
                $aiResponse = $aiService->processMessage($messageBody, $chat->id);
                if ($aiResponse['should_respond'] ?? false) {
                    dispatch(new SendAuraOutboundMessageJob(
                        $chat->id,
                        $aiResponse['response'] ?? ''
                    ));
                }
            }

            // Verificar flows ativos
            if ($flowService) {
                $connection = $chat->connection ?? null;
                if ($connection) {
                    $activeFlows = $connection->flows()->where('is_active', true)->get();
                    foreach ($activeFlows as $flow) {
                        if ($this->shouldTriggerFlow($flow, $messageBody)) {
                            $flowService->startFlow($flow->id, $from, ['message' => $messageBody]);
                        }
                    }
                }
            }

            $chat->update(['last_message_at' => now()]);
            
            Log::info('WhatsApp message processed successfully', [
                'message_id' => $messageId,
                'chat_id' => $chat->id,
                'from' => $from
            ]);
        } catch (\Exception $e) {
            Log::error('Error processing individual WhatsApp message', [
                'error' => $e->getMessage(),
                'message' => $message
            ]);
            // Não relançar exceção para não falhar todo o job
        }
    }

    /**
     * Extract message content based on type
     */
    protected function extractMessageContent(array $message, string $type): string
    {
        return match ($type) {
            'text' => $message['text']['body'] ?? '',
            'image', 'video', 'document' => $message[$type]['caption'] ?? '',
            'location' => "Location: {$message['location']['latitude']}, {$message['location']['longitude']}",
            'contacts' => 'Contact shared',
            default => json_encode($message)
        };
    }

    private function shouldTriggerFlow($flow, string $message): bool
    {
        $triggers = $flow->triggers ?? [];
        foreach ($triggers as $trigger) {
            if ($trigger['type'] === 'keyword' && str_contains(strtolower($message), strtolower($trigger['value']))) {
                return true;
            }
        }
        return false;
    }
}
