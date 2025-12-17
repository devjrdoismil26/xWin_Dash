<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraUraSessionModel;
use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Aura URA Session Service
 * 
 * Service for managing URA (Unified Response Automation) sessions.
 * Handles session lifecycle and interaction management.
 */
class AuraUraSessionService
{
    /**
     * Create a new URA session.
     * 
     * @param string $connectionId
     * @param string $contactId
     * @param array $initialContext
     * @return array
     */
    public function createSession(string $connectionId, string $contactId, array $initialContext = []): array
    {
        try {
            Log::info("AuraUraSessionService::createSession - starting", [
                'connection_id' => $connectionId,
                'contact_id' => $contactId
            ]);

            // Buscar ou criar chat
            $chat = AuraChatModel::where('connection_id', $connectionId)
                ->where('contact_phone', $contactId)
                ->first();

            if (!$chat) {
                throw new \Exception("Chat não encontrado para connection_id: {$connectionId}, contact_id: {$contactId}");
            }

            // Verificar se já existe sessão ativa
            $existingSession = AuraUraSessionModel::where('chat_id', $chat->id)
                ->where('status', 'active')
                ->first();

            if ($existingSession) {
                Log::info("Sessão URA já existe e está ativa", [
                    'session_id' => $existingSession->id
                ]);
                return [
                    'success' => true,
                    'session_id' => $existingSession->id,
                    'message' => 'Sessão já existe e está ativa'
                ];
            }

            // Criar nova sessão
            $session = AuraUraSessionModel::create([
                'chat_id' => $chat->id,
                'session_id' => Str::uuid()->toString(),
                'context' => array_merge($initialContext, [
                    'started_at' => now()->toIso8601String(),
                    'connection_id' => $connectionId,
                    'contact_id' => $contactId
                ]),
                'history' => [],
                'status' => 'active',
                'started_at' => now(),
            ]);

            Log::info("AuraUraSessionService::createSession - success", [
                'session_id' => $session->id
            ]);

            return [
                'success' => true,
                'session_id' => $session->id,
                'message' => 'Sessão URA criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error("AuraUraSessionService::createSession - error", [
                'connection_id' => $connectionId,
                'contact_id' => $contactId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'session_id' => null,
                'message' => 'Erro ao criar sessão: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Process a session interaction.
     * 
     * @param string $sessionId
     * @param array $interaction
     * @return array
     */
    public function processInteraction(string $sessionId, array $interaction): array
    {
        try {
            Log::info("AuraUraSessionService::processInteraction - starting", [
                'session_id' => $sessionId,
                'interaction_type' => $interaction['type'] ?? 'unknown'
            ]);

            $session = AuraUraSessionModel::findOrFail($sessionId);

            if ($session->status !== 'active') {
                throw new \Exception("Sessão não está ativa. Status atual: {$session->status}");
            }

            // Adicionar interação ao histórico
            $history = $session->history ?? [];
            $history[] = [
                'type' => $interaction['type'] ?? 'message',
                'data' => $interaction['data'] ?? $interaction,
                'timestamp' => now()->toIso8601String(),
                'processed' => false
            ];

            // Atualizar contexto se necessário
            $context = $session->context ?? [];
            if (isset($interaction['update_context'])) {
                $context = array_merge($context, $interaction['update_context']);
            }

            // Processar interação baseado no tipo
            $result = $this->handleInteractionType($session, $interaction);

            // Marcar última interação como processada
            if (!empty($history)) {
                $history[count($history) - 1]['processed'] = true;
                $history[count($history) - 1]['result'] = $result;
            }

            // Atualizar sessão
            $session->update([
                'context' => $context,
                'history' => $history,
            ]);

            Log::info("AuraUraSessionService::processInteraction - success", [
                'session_id' => $sessionId
            ]);

            return [
                'success' => true,
                'result' => $result,
                'message' => 'Interação processada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error("AuraUraSessionService::processInteraction - error", [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao processar interação: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Handle different interaction types.
     * 
     * @param AuraUraSessionModel $session
     * @param array $interaction
     * @return array
     */
    protected function handleInteractionType(AuraUraSessionModel $session, array $interaction): array
    {
        $type = $interaction['type'] ?? 'message';

        switch ($type) {
            case 'message':
                return $this->handleMessageInteraction($session, $interaction);
            case 'menu_selection':
                return $this->handleMenuSelection($session, $interaction);
            case 'input_collection':
                return $this->handleInputCollection($session, $interaction);
            case 'flow_trigger':
                return $this->handleFlowTrigger($session, $interaction);
            default:
                Log::warning("Tipo de interação não reconhecido", [
                    'type' => $type,
                    'session_id' => $session->id
                ]);
                return ['handled' => false, 'message' => 'Tipo de interação não suportado'];
        }
    }

    /**
     * Handle message interaction.
     */
    protected function handleMessageInteraction(AuraUraSessionModel $session, array $interaction): array
    {
        // Processar mensagem recebida
        return [
            'handled' => true,
            'action' => 'message_received',
            'next_step' => $this->determineNextStep($session, $interaction)
        ];
    }

    /**
     * Handle menu selection.
     */
    protected function handleMenuSelection(AuraUraSessionModel $session, array $interaction): array
    {
        $selectedOption = $interaction['data']['option'] ?? null;
        
        // Atualizar contexto com seleção
        $context = $session->context ?? [];
        $context['last_menu_selection'] = $selectedOption;
        $session->update(['context' => $context]);

        return [
            'handled' => true,
            'action' => 'menu_selected',
            'selected_option' => $selectedOption
        ];
    }

    /**
     * Handle input collection.
     */
    protected function handleInputCollection(AuraUraSessionModel $session, array $interaction): array
    {
        $field = $interaction['data']['field'] ?? null;
        $value = $interaction['data']['value'] ?? null;

        if ($field && $value) {
            $context = $session->context ?? [];
            $context['collected_data'][$field] = $value;
            $session->update(['context' => $context]);

            return [
                'handled' => true,
                'action' => 'input_collected',
                'field' => $field,
                'value' => $value
            ];
        }

        return ['handled' => false, 'message' => 'Campo ou valor não fornecido'];
    }

    /**
     * Handle flow trigger.
     */
    protected function handleFlowTrigger(AuraUraSessionModel $session, array $interaction): array
    {
        $flowId = $interaction['data']['flow_id'] ?? null;
        
        if ($flowId) {
            // Integrar com AuraFlowService para iniciar fluxo
            $flowService = app(\App\Domains\Aura\Services\AuraFlowService::class);
            $chat = $session->chat;
            
            $result = $flowService->startFlow(
                $flowId,
                $chat->contact_phone ?? '',
                $session->context ?? []
            );

            return [
                'handled' => true,
                'action' => 'flow_triggered',
                'flow_result' => $result
            ];
        }

        return ['handled' => false, 'message' => 'Flow ID não fornecido'];
    }

    /**
     * Determine next step based on session context.
     */
    protected function determineNextStep(AuraUraSessionModel $session, array $interaction): ?string
    {
        // Lógica para determinar próximo passo baseado no contexto
        $context = $session->context ?? [];
        $history = $session->history ?? [];

        // Exemplo: se é primeira interação, mostrar menu
        if (count($history) <= 1) {
            return 'show_menu';
        }

        // Exemplo: se coletou dados suficientes, finalizar
        if (isset($context['collected_data']) && count($context['collected_data']) >= 3) {
            return 'finalize';
        }

        return 'continue';
    }

    /**
     * End a URA session.
     * 
     * @param string $sessionId
     * @return bool
     */
    public function endSession(string $sessionId): bool
    {
        try {
            $session = AuraUraSessionModel::findOrFail($sessionId);

            if ($session->status === 'ended') {
                Log::info("Sessão já foi finalizada", ['session_id' => $sessionId]);
                return true;
            }

            $context = $session->context ?? [];
            $context['ended_at'] = now()->toIso8601String();
            $context['ended_reason'] = 'manual' ?? $context['ended_reason'];

            $session->update([
                'status' => 'ended',
                'context' => $context,
                'ended_at' => now(),
            ]);

            Log::info("AuraUraSessionService::endSession - success", [
                'session_id' => $sessionId
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("AuraUraSessionService::endSession - error", [
                'session_id' => $sessionId,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }
}
