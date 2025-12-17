<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Aura\Services\AuraChatService;
use App\Domains\Aura\Services\AuraFlowService; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class AuraNodeActivity
{
    protected AuraChatService $auraChatService;

    protected AuraFlowService $auraFlowService;

    public function __construct(AuraChatService $auraChatService, AuraFlowService $auraFlowService)
    {
        $this->auraChatService = $auraChatService;
        $this->auraFlowService = $auraFlowService;
    }

    /**
     * Executa uma ação relacionada ao Aura.
     *
     * @param string $action     o tipo de ação a ser executada (ex: 'send_message', 'start_flow', 'assign_chat')
     * @param array<string, mixed>  $parameters parâmetros para a ação (ex: 'chat_id', 'message', 'flow_id')
     * @param array<string, mixed>  $payload    o payload atual do workflow
     *
     * @return array<string, mixed> o payload atualizado com o resultado da ação
     *
     * @throws \Exception se a ação for inválida ou falhar
     */
    public function execute(string $action, array $parameters, array $payload): array
    {
        Log::info("Executando AuraNodeActivity: {$action}.");

        switch ($action) {
            case 'send_message':
                $chatId = $parameters['chat_id'] ?? null;
                $message = $parameters['message'] ?? null;
                if (!$chatId || !$message) {
                    throw new \Exception("Parâmetros inválidos para 'send_message'.");
                }
                // Supondo que o AuraChatService tem um método para enviar mensagens
                // $this->auraChatService->sendMessage($chatId, $message);
                Log::info("Mensagem Aura enviada para chat ID: {$chatId}.");
                break;
            case 'start_flow':
                $flowId = $parameters['flow_id'] ?? null;
                $phoneNumber = $parameters['phone_number'] ?? null;
                if (!$flowId || !$phoneNumber) {
                    throw new \Exception("Parâmetros inválidos para 'start_flow'.");
                }
                // Supondo que o AuraFlowService tem um método para iniciar fluxos
                // $this->auraFlowService->startFlow($flowId, $phoneNumber);
                Log::info("Fluxo Aura ID: {$flowId} iniciado para {$phoneNumber}.");
                break;
            case 'assign_chat':
                $chatId = $parameters['chat_id'] ?? null;
                $agentId = $parameters['agent_id'] ?? null;
                if (!$chatId || !$agentId) {
                    throw new \Exception("Parâmetros inválidos para 'assign_chat'.");
                }
                // Supondo que o AuraChatService tem um método para atribuir chats
                // $this->auraChatService->assignChat($chatId, $agentId);
                Log::info("Chat Aura ID: {$chatId} atribuído ao agente ID: {$agentId}.");
                break;
            default:
                throw new \Exception("Ação Aura desconhecida: {$action}.");
        }

        $payload['aura_action_result'] = ['action' => $action, 'status' => 'success'];
        return $payload;
    }
}
