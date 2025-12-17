<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\ADSCampaignModel;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Exceptions\WorkflowExecutionException;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log;

class AdjustBudgetNodeExecutor implements WorkflowNodeExecutor
{
    /**
     * Execute the action of the workflow node.
     *
     * @param WorkflowNodeModel        $node    the node to be executed
     * @param Lead                     $lead    the lead being processed
     * @param WorkflowExecutionContext $context the execution context
     *
     * @return array<string, mixed> o payload atualizado após o ajuste do orçamento
     *
     * @throws WorkflowExecutionException se a configuração for inválida ou o ajuste falhar
     */
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): array
    {
        Log::info("Executando AdjustBudgetNodeExecutor para node {$node->id}.");

        $config = $node->configuration ?? [];
        $campaignId = $config['campaign_id'] ?? null;
        $budgetAmount = $config['budget_amount'] ?? null;
        $budgetType = $config['budget_type'] ?? 'daily'; // 'daily', 'lifetime'

        if (!$campaignId || $budgetAmount === null) {
            throw new WorkflowExecutionException("Nó de ajuste de orçamento inválido: 'campaign_id' e 'budget_amount' são obrigatórios.");
        }

        try {
            // Construir payload para substituição de placeholders
            $payload = [
                'lead_id' => $lead->id,
                'lead_name' => $lead->name ?? '',
                ...$context->getData()
            ];

            // Substituir placeholders com valores do contexto
            $finalCampaignId = $this->replacePlaceholder($campaignId, $payload);
            $finalBudgetAmount = $this->replacePlaceholder($budgetAmount, $payload);

            // Converter para tipos corretos
            $finalCampaignId = is_numeric($finalCampaignId) ? (int) $finalCampaignId : $finalCampaignId;
            $finalBudgetAmount = is_numeric($finalBudgetAmount) ? (float) $finalBudgetAmount : $finalBudgetAmount;

            if (!is_numeric($finalBudgetAmount) || $finalBudgetAmount <= 0) {
                throw new WorkflowExecutionException("Valor de orçamento inválido: deve ser um número positivo.");
            }

            // Buscar campanha
            $campaign = ADSCampaignModel::find($finalCampaignId);

            if (!$campaign) {
                throw new WorkflowExecutionException("Campanha não encontrada: ID {$finalCampaignId}.");
            }

            // Atualizar orçamento
            $oldBudget = $campaign->daily_budget ?? $campaign->lifetime_budget ?? 0;
            
            if ($budgetType === 'daily') {
                $campaign->daily_budget = $finalBudgetAmount;
            } else {
                $campaign->lifetime_budget = $finalBudgetAmount;
            }

            $campaign->save();

            // Adicionar resultado ao contexto
            $context->setData('adjusted_budget_campaign', [
                'success' => true,
                'campaign_id' => $campaign->id,
                'old_budget' => $oldBudget,
                'new_budget' => $finalBudgetAmount,
                'budget_type' => $budgetType,
                'adjusted_at' => now()->toIso8601String()
            ]);

            Log::info("Orçamento da campanha ID: {$finalCampaignId} ajustado para {$finalBudgetAmount} ({$budgetType}).");

            return $context->getData();
        } catch (\Exception $e) {
            Log::error("Falha ao ajustar orçamento da campanha ID: {$campaignId}: " . $e->getMessage());
            throw new WorkflowExecutionException("Falha no ajuste de orçamento da campanha: " . $e->getMessage());
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
        $result = $context->getData('adjusted_budget_campaign');

        // Se ajuste foi bem-sucedido, seguir para próximo nó
        if ($result && isset($result['success']) && $result['success']) {
            return $config['next_node_id'] ?? $node->next_node_id ?? null;
        }

        // Se falhou, seguir para nó de erro (se configurado)
        return $config['error_node_id'] ?? null;
    }

    /**
     * Substitui um placeholder no texto com um valor do payload.
     *
     * @param string|null $text    o texto com placeholder (ex: "{{ campaign_id }}")
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
