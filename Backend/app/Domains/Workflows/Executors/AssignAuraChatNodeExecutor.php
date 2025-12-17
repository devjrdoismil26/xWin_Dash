<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatModel;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class AssignAuraChatNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após a atribuição do chat
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a atribuição falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando AssignAuraChatNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $chatId = $config['chat_id'] ?? null;
        $agentId = $config['agent_id'] ?? $config['assigned_to_user_id'] ?? null;
        $agentName = $config['agent_name'] ?? null;

        if (!$chatId) {
            throw new WorkflowExecutionException("Nó de atribuição de chat do Aura inválido: 'chat_id' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders com valores do contexto
            $finalChatId = $this->replacePlaceholder($chatId, $payload);
            $finalAgentId = $agentId ? $this->replacePlaceholder($agentId, $payload) : null;
            $finalAgentName = $agentName ? $this->replacePlaceholder($agentName, $payload) : null;

            // Converter para inteiro se necessário
            $finalChatId = is_numeric($finalChatId) ? (int) $finalChatId : $finalChatId;
            $finalAgentId = $finalAgentId && is_numeric($finalAgentId) ? (int) $finalAgentId : $finalAgentId;

            if (!is_int($finalChatId)) {
                throw new WorkflowExecutionException("Chat ID inválido: deve ser um número inteiro.");
            }

            // Buscar chat
            $chat = AuraChatModel::find($finalChatId);

            if (!$chat) {
                throw new WorkflowExecutionException("Chat não encontrado: ID {$finalChatId}.");
            }

            // Atribuir chat ao agente
            if ($finalAgentId) {
                $chat->update([
                    'assigned_to_user_id' => $finalAgentId,
                    'assigned_agent' => $finalAgentName ?? "Agent {$finalAgentId}",
                    'status' => 'assigned'
                ]);
            } else {
                // Se não há agent_id, apenas atualizar status
                $chat->update([
                    'status' => 'assigned'
                ]);
            }

            // Adicionar resultado ao contexto
            $context->setData('aura_chat_assignment_result', [
                'success' => true,
                'chat_id' => $chat->id,
                'assigned_to_user_id' => $chat->assigned_to_user_id,
                'assigned_agent' => $chat->assigned_agent,
                'status' => $chat->status,
                'assigned_at' => $chat->updated_at?->toIso8601String()
            ]);

            Log::info("Chat ID: {$finalChatId} atribuído com sucesso ao agente {$finalAgentId}.");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao atribuir chat ID: {$chatId}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha ao atribuir chat do Aura: " . $e->getMessage());
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
        $result = $context->getData('aura_chat_assignment_result');

        // Se atribuição foi bem-sucedida, seguir para próximo nó
        if ($result && isset($result['success']) && $result['success']) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ chat_id }}")
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
            return $payload[$key] ?? $matches[0]; // Retorna o placeholder original se a chave não existir
        }, $text);
    }
}
