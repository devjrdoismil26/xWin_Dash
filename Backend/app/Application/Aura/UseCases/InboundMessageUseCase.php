<?php

namespace App\Application\Aura\UseCases;

use App\Domains\Aura\Services\AuraChatService; // Supondo que este serviço exista
use App\Domains\Aura\Services\AuraFlowService; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class InboundMessageUseCase
{
    protected AuraChatService $auraChatService;

    protected AuraFlowService $auraFlowService;

    public function __construct(AuraChatService $auraChatService, AuraFlowService $auraFlowService)
    {
        $this->auraChatService = $auraChatService;
        $this->auraFlowService = $auraFlowService;
    }

    /**
     * Executa o caso de uso para processar uma mensagem de entrada.
     *
     * @param array $messageData os dados da mensagem de entrada (ex: de um webhook)
     *
     * @return mixed o resultado do processamento (ex: o chat atualizado ou a resposta)
     */
    public function execute(array $messageData)
    {
        Log::info("Processando mensagem de entrada: ", $messageData);

        // Exemplo simplificado: identificar o remetente e o chat
        $senderId = $messageData['from'] ?? null;
        $messageContent = $messageData['text'] ?? null;

        if (!$senderId || !$messageContent) {
            Log::warning("Dados de mensagem de entrada incompletos.");
            return false;
        }

        // Tenta encontrar um chat existente para o remetente
        $chat = $this->auraChatService->findChatByParticipant($senderId);

        if (!$chat) {
            // Se não houver chat, cria um novo
            $chat = $this->auraChatService->createChat($senderId, 'whatsapp', $messageContent);
            Log::info("Novo chat criado para {$senderId}");
        }

        // Adiciona a mensagem ao chat
        $this->auraChatService->addMessageToChat($chat->id, 'user', $messageContent);

        // Inicia ou continua um fluxo de conversa
        $response = $this->auraFlowService->processMessageInFlow($chat->id, $messageContent);

        // Envia a resposta de volta ao usuário (se houver)
        if ($response) {
            $this->auraChatService->sendMessageToParticipant($senderId, $response);
        }

        return $chat;
    }
}
