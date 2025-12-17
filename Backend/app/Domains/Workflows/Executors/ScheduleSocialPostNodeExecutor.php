<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\SocialBuffer\Services\PostService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ScheduleSocialPostNodeExecutor implements WorkflowNodeExecutor
{
    protected PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após o agendamento
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o agendamento falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando ScheduleSocialPostNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $postId = $config['post_id'] ?? null;
        $scheduledAt = $config['scheduled_at'] ?? null;

        if (!$postId || !$scheduledAt) {
            throw new WorkflowExecutionException("Nó de agendamento de post social inválido: 'post_id' e 'scheduled_at' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders com valores do contexto
            $finalPostId = $this->replacePlaceholder($postId, $payload);
            $finalScheduledAt = $this->replacePlaceholder($scheduledAt, $payload);

            // Converter para inteiro se necessário
            $finalPostId = is_numeric($finalPostId) ? (int) $finalPostId : $finalPostId;

            if (!is_int($finalPostId)) {
                throw new WorkflowExecutionException("Post ID inválido: deve ser um número inteiro.");
            }

            // Converter scheduled_at para DateTime
            try {
                $scheduledDateTime = Carbon::parse($finalScheduledAt);
            } catch (\Exception $e) {
                throw new WorkflowExecutionException("Data de agendamento inválida: {$finalScheduledAt}.");
            }

            // Verificar se a data é no futuro
            if ($scheduledDateTime->isPast()) {
                throw new WorkflowExecutionException("Data de agendamento deve ser no futuro: {$finalScheduledAt}.");
            }

            // Agendar post
            $success = $this->postService->schedule($finalPostId, $scheduledDateTime);

            if (!$success) {
                throw new WorkflowExecutionException("Falha ao agendar post ID: {$finalPostId}.");
            }

            // Adicionar resultado ao contexto
            $context->setData('scheduled_post_result', [
                'success' => true,
                'post_id' => $finalPostId,
                'scheduled_at' => $scheduledDateTime->toIso8601String(),
                'status' => 'scheduled'
            ]);

            Log::info("Post ID: {$finalPostId} agendado com sucesso para {$scheduledDateTime->toIso8601String()}.");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao agendar post ID: {$postId}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha no agendamento de post social: " . $e->getMessage());
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
        $result = $context->getData('scheduled_post_result');

        // Se agendamento foi bem-sucedido, seguir para próximo nó
        if ($result && isset($result['success']) && $result['success']) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ post_id }}")
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
