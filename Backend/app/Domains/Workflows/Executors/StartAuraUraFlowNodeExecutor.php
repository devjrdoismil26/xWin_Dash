<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Aura\Services\AuraUraSessionService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class StartAuraUraFlowNodeExecutor implements WorkflowNodeExecutor
{
    protected AuraUraSessionService $auraUraSessionService;

    public function __construct(AuraUraSessionService $auraUraSessionService)
    {
        $this->auraUraSessionService = $auraUraSessionService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após o início do fluxo URA
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o início do fluxo falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando StartAuraUraFlowNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $connectionId = $config['connection_id'] ?? null;
        $contactId = $config['contact_id'] ?? $config['phone_number'] ?? $lead->phone ?? null;
        $flowId = $config['flow_id'] ?? null;
        $initialMessage = $config['initial_message'] ?? null;

        if (!$connectionId || !$contactId) {
            throw new WorkflowExecutionException("Nó de início de fluxo URA do Aura inválido: 'connection_id' e 'contact_id' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                'lead_phone' => $lead->phone ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders com valores do contexto
            $finalConnectionId = $this->replacePlaceholder($connectionId, $payload);
            $finalContactId = $this->replacePlaceholder($contactId, $payload);
            $finalFlowId = $flowId ? $this->replacePlaceholder($flowId, $payload) : null;

            // Preparar contexto inicial
            $initialContext = [
                'flow_id' => $finalFlowId,
                'initial_message' => $initialMessage,
                'workflow_id' => $context->getData('workflow_id'),
                'lead_id' => $lead->id
            ];

            // Criar sessão URA
            $sessionResult = $this->auraUraSessionService->createSession(
                $finalConnectionId,
                $finalContactId,
                $initialContext
            );

            if (!$sessionResult['success']) {
                throw new WorkflowExecutionException("Falha ao criar sessão URA: " . ($sessionResult['message'] ?? 'Erro desconhecido'));
            }

            // Adicionar resultado ao contexto
            $context->setData('aura_ura_session', [
                'success' => true,
                'session_id' => $sessionResult['session_id'],
                'connection_id' => $finalConnectionId,
                'contact_id' => $finalContactId,
                'flow_id' => $finalFlowId,
                'started_at' => now()->toIso8601String()
            ]);

            Log::info("Fluxo URA do Aura iniciado para {$finalContactId} com sucesso. Sessão ID: {$sessionResult['session_id']}.");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao iniciar fluxo URA do Aura: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha ao iniciar fluxo URA do Aura: " . $e->getMessage());
        }
    }

    /**
     * Determine the ID of the next node to be executed.
     *
     * @param WorkflowNodeModel        $node    the current node
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return string|null the ID of the next node, or null if it's the end of the path
     */
    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $result = $context->getData('aura_ura_session');

        // Se sessão foi criada com sucesso, seguir para próximo nó
        if ($result && isset($result['success']) && $result['success']) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ contact_id }}")
     * @param array       $payload o payload do workflow
     *
     * @return string|null o texto com placeholder substituído ou null
     */
    protected function replacePlaceholder(?string $text, array $payload): ?string
    {
        if ($text === null) {
            return null;
        }
        return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
            $key = $matches[1];
            return $payload[$key] ?? $matches[0];
        }, $text);
    }
}
