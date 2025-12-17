<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Aura\Services\AuraChatService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class CloseAuraChatNodeExecutor implements WorkflowNodeExecutor
{
    protected AuraChatService $auraChatService;

    public function __construct(AuraChatService $auraChatService)
    {
        $this->auraChatService = $auraChatService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após o fechamento do chat
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o fechamento falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando CloseAuraChatNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $chatId = $config['chat_id'] ?? null;
        $resolutionNotes = $config['resolution_notes'] ?? null;

        if (!$chatId) {
            throw new WorkflowExecutionException("Nó de fechamento de chat do Aura inválido: 'chat_id' é obrigatório.");
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
            $finalResolutionNotes = $resolutionNotes ? $this->replacePlaceholder($resolutionNotes, $payload) : null;

            // Converter para inteiro se necessário
            $finalChatId = is_numeric($finalChatId) ? (int) $finalChatId : $finalChatId;

            if (!is_int($finalChatId)) {
                throw new WorkflowExecutionException("Chat ID inválido: deve ser um número inteiro.");
            }

            // Fechar chat
            $result = $this->auraChatService->closeChat((string) $finalChatId);

            if (!$result) {
                throw new WorkflowExecutionException("Falha ao fechar chat ID: {$finalChatId}.");
            }

            // Adicionar resultado ao contexto
            $context->setData('aura_chat_close_result', [
                'success' => true,
                'chat_id' => $finalChatId,
                'status' => 'closed',
                'resolution_notes' => $finalResolutionNotes,
                'closed_at' => now()->toIso8601String()
            ]);

            Log::info("Chat ID: {$finalChatId} fechado com sucesso.");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao fechar chat ID: {$chatId}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha ao fechar chat do Aura: " . $e->getMessage());
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
        $result = $context->getData('aura_chat_close_result');

        // Se fechamento foi bem-sucedido, seguir para próximo nó
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
            return $payload[$key] ?? $matches[0];
        }, $text);
    }
}
