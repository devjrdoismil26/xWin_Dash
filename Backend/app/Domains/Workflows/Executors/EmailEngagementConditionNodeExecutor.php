<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log as LoggerFacade;

class EmailEngagementConditionNodeExecutor implements WorkflowNodeExecutor
{
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        LoggerFacade::info("Executing Email Engagement Condition Node for lead {$lead->id}");

        try {
            $campaignId = $node->configuration['campaign_id'] ?? null;
            $engagementType = $node->configuration['engagement_type'] ?? null; // 'opened' ou 'clicked'
            $threshold = $node->configuration['threshold'] ?? 1; // Número mínimo de engajamentos

            if (!$campaignId || !$engagementType) {
                LoggerFacade::warning("Email Engagement Condition Node for lead {$lead->id} has missing configuration (campaign_id or engagement_type).");
            $context->setData('email_engagement_condition_result', [
                'success' => false,
                'error' => 'Missing campaign_id or engagement_type configuration',
                'conditionMet' => false
            ]);
            return $context->getData();
            }

            // Verificar engajamento do lead na campanha
            $engagementCount = \App\Domains\EmailMarketing\Models\EmailLog::where('lead_id', $lead->id)
                ->where('campaign_id', $campaignId)
                ->where('event_type', $engagementType)
                ->count();

            $conditionMet = $engagementCount >= $threshold;

            // Log da execução
            LoggerFacade::info("Email Engagement Condition result for lead {$lead->id}", [
                'campaign_id' => $campaignId,
                'engagement_type' => $engagementType,
                'threshold' => $threshold,
                'engagement_count' => $engagementCount,
                'condition_met' => $conditionMet
            ]);

            // Adicionar resultado ao contexto
            $context->setData('email_engagement_condition_result', [
                'success' => true,
                'conditionMet' => $conditionMet,
                'campaignId' => $campaignId,
                'engagementType' => $engagementType,
                'threshold' => $threshold,
                'engagementCount' => $engagementCount,
                'executedAt' => now()->toISOString()
            ]);

            return $context->getData();
        } catch (\Exception $e) {
            LoggerFacade::error("Error executing Email Engagement Condition Node", [
                'lead_id' => $lead->id,
                'node_id' => $node->id,
                'error' => $e->getMessage()
            ]);

            $context->setData('email_engagement_condition_result', [
                'success' => false,
                'error' => $e->getMessage(),
                'conditionMet' => false
            ]);
            return $context->getData();
        }
    }

    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $campaignId = $config['campaign_id'] ?? null;
        $engagementType = $config['engagement_type'] ?? null;
        $threshold = $config['threshold'] ?? 1;

        if (!$campaignId || !$engagementType) {
            LoggerFacade::warning("Email Engagement Condition Node for lead {$lead->id} has missing configuration.");
            return $config['false_node_id'] ?? null;
        }

        // Verificar engajamento do lead na campanha
        $engagementCount = \App\Domains\EmailMarketing\Models\EmailLog::where('lead_id', $lead->id)
            ->where('campaign_id', $campaignId)
            ->where('event_type', $engagementType)
            ->count();

        $conditionMet = $engagementCount >= $threshold;

        // Retornar próximo nó baseado na condição
        if ($conditionMet) {
            return $config['true_node_id'] ?? $config['next_node_id'] ?? $node->next_node_id ?? null;
        } else {
            return $config['false_node_id'] ?? null;
        }
    }
}
