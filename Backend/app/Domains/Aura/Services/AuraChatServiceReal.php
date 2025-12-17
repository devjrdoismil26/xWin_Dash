<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionModel;
use App\Domains\Aura\Services\AuraChatService;
use App\Domains\Aura\Services\WhatsAppService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Aura Chat Service (Real Implementation)
 * 
 * Real implementation of the Aura chat service.
 * Integrates with AuraChatService and WhatsAppService for actual message handling.
 */
class AuraChatServiceReal
{
    protected AuraChatService $auraChatService;
    protected WhatsAppService $whatsAppService;

    public function __construct(
        AuraChatService $auraChatService,
        WhatsAppService $whatsAppService
    ) {
        $this->auraChatService = $auraChatService;
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Send a chat message.
     * 
     * @param string $connectionId
     * @param string $to
     * @param string $message
     * @param array $options
     * @return array
     */
    public function sendMessage(string $connectionId, string $to, string $message, array $options = []): array
    {
        try {
            Log::info("AuraChatServiceReal::sendMessage - starting", [
                'connection_id' => $connectionId,
                'to' => $to,
                'message_length' => strlen($message)
            ]);

            // Buscar ou criar chat
            $chat = $this->findOrCreateChat($connectionId, $to);

            // Enviar mensagem via WhatsApp
            $whatsappResult = $this->whatsAppService->sendTextMessage(
                $connectionId,
                $to,
                $message
            );

            if (!$whatsappResult['success']) {
                throw new \Exception($whatsappResult['message'] ?? 'Falha ao enviar mensagem via WhatsApp');
            }

            // Salvar mensagem no banco de dados
            $messageModel = AuraMessageModel::create([
                'chat_id' => $chat->id,
                'whatsapp_message_id' => $whatsappResult['message_id'] ?? null,
                'direction' => 'outbound',
                'type' => $options['message_type'] ?? 'text',
                'content' => ['text' => $message],
                'status' => 'sent',
                'metadata' => array_merge($options['metadata'] ?? [], [
                    'whatsapp_message_id' => $whatsappResult['message_id'] ?? null,
                    'sent_at' => now()->toIso8601String()
                ]),
                'sent_at' => now(),
            ]);

            // Atualizar último contato do chat
            $chat->update([
                'last_message_at' => now(),
                'unread_count' => 0
            ]);

            Log::info("AuraChatServiceReal::sendMessage - success", [
                'message_id' => $messageModel->id,
                'whatsapp_message_id' => $whatsappResult['message_id'] ?? null
            ]);

            return [
                'success' => true,
                'message_id' => $messageModel->id,
                'whatsapp_message_id' => $whatsappResult['message_id'] ?? null,
                'chat_id' => $chat->id,
                'message' => 'Mensagem enviada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error("AuraChatServiceReal::sendMessage - error", [
                'connection_id' => $connectionId,
                'to' => $to,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao enviar mensagem: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Receive a chat message.
     * 
     * @param string $connectionId
     * @param array $messageData
     * @return array
     */
    public function receiveMessage(string $connectionId, array $messageData): array
    {
        try {
            Log::info("AuraChatServiceReal::receiveMessage - starting", [
                'connection_id' => $connectionId,
                'message_data' => $messageData
            ]);

            // Extrair dados da mensagem
            $from = $messageData['from'] ?? $messageData['phone_number'] ?? null;
            $messageContent = $messageData['text'] ?? $messageData['body'] ?? $messageData['message'] ?? '';
            $messageType = $messageData['type'] ?? 'text';
            $whatsappMessageId = $messageData['id'] ?? $messageData['message_id'] ?? null;

            if (!$from) {
                throw new \Exception('Número de origem não fornecido');
            }

            // Buscar ou criar chat
            $chat = $this->findOrCreateChat($connectionId, $from);

            // Salvar mensagem recebida
            $messageModel = AuraMessageModel::create([
                'chat_id' => $chat->id,
                'whatsapp_message_id' => $whatsappMessageId,
                'direction' => 'inbound',
                'type' => $messageType,
                'content' => ['text' => $messageContent],
                'status' => 'received',
                'metadata' => array_merge($messageData['metadata'] ?? [], [
                    'received_at' => now()->toIso8601String(),
                    'raw_data' => $messageData
                ]),
            ]);

            // Atualizar chat
            $chat->update([
                'last_message_at' => now(),
                'unread_count' => DB::raw('unread_count + 1'),
                'status' => 'active'
            ]);

            Log::info("AuraChatServiceReal::receiveMessage - success", [
                'message_id' => $messageModel->id,
                'chat_id' => $chat->id
            ]);

            return [
                'success' => true,
                'message_id' => $messageModel->id,
                'chat_id' => $chat->id,
                'message' => 'Mensagem recebida e processada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error("AuraChatServiceReal::receiveMessage - error", [
                'connection_id' => $connectionId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao processar mensagem recebida: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Find or create a chat for a contact.
     * 
     * @param string $connectionId
     * @param string $contactPhone
     * @return AuraChatModel
     */
    protected function findOrCreateChat(string $connectionId, string $contactPhone): AuraChatModel
    {
        $chat = AuraChatModel::where('connection_id', $connectionId)
            ->where('contact_phone', $contactPhone)
            ->first();

        if (!$chat) {
            $connection = AuraConnectionModel::findOrFail($connectionId);
            
            $chat = AuraChatModel::create([
                'connection_id' => $connectionId,
                'contact_phone' => $contactPhone,
                'status' => 'active',
                'last_message_at' => now(),
                'unread_count' => 0,
                'project_id' => $connection->project_id,
            ]);
        }

        return $chat;
    }
}
