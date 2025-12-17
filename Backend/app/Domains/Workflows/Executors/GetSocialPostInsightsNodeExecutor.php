<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\SocialBuffer\Services\SocialInsightsService;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class GetSocialPostInsightsNodeExecutor implements WorkflowNodeExecutor
{
    protected SocialInsightsService $socialInsightsService;

    public function __construct(SocialInsightsService $socialInsightsService)
    {
        $this->socialInsightsService = $socialInsightsService;
    }

    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado com os insights do post
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou a obtenção falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando GetSocialPostInsightsNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $postId = $config['post_id'] ?? null;
        $outputField = $config['output_field'] ?? 'social_post_insights';

        if (!$postId) {
            throw new WorkflowExecutionException("Nó de insights de post social inválido: 'post_id' é obrigatório.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders no post_id com valores do contexto
            $finalPostId = $this->replacePlaceholder($postId, $payload);

            // Converter para inteiro se necessário
            $finalPostId = is_numeric($finalPostId) ? (int) $finalPostId : $finalPostId;

            if (!is_int($finalPostId)) {
                throw new WorkflowExecutionException("Post ID inválido: deve ser um número inteiro.");
            }

            $insights = $this->socialInsightsService->getPostPerformanceSummary($finalPostId);

            // Adicionar insights ao contexto
            $context->setData($outputField, $insights ? [
                'post_id' => $finalPostId,
                'views' => $insights->views ?? 0,
                'likes' => $insights->likes ?? 0,
                'comments' => $insights->comments ?? 0,
                'shares' => $insights->shares ?? 0,
                'clicks' => $insights->clicks ?? 0,
                'engagement_rate' => $this->socialInsightsService->calculateEngagementRate($finalPostId),
            ] : null);

            Log::info("Insights do post ID: {$finalPostId} obtidos e adicionados ao contexto no campo '{$outputField}'.");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao obter insights do post ID: {$postId}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha ao obter insights de post social: " . $e->getMessage());
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
        $outputField = $config['output_field'] ?? 'social_post_insights';
        $insights = $context->getData($outputField);

        // Se insights foram obtidos com sucesso, seguir para próximo nó
        if ($insights !== null) {
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
            return $payload[$key] ?? $matches[0]; // Retorna o placeholder original se a chave não existir
        }, $text);
    }
}
