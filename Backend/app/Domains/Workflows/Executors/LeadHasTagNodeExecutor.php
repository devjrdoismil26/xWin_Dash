<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log as LoggerFacade;

class LeadHasTagNodeExecutor implements WorkflowNodeExecutor
{
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        LoggerFacade::info("Executing Lead Has Tag Node for lead {$lead->id}");

        try {
            $tagName = $node->configuration['tag_name'] ?? null;

            if (!$tagName) {
                LoggerFacade::warning("Lead Has Tag Node for lead {$lead->id} has no tag name configured.");
                return [
                    'success' => false,
                    'error' => 'No tag name configured',
                    'hasTag' => false
                ];
            }

            // Verificar se o lead tem a tag
            $hasTag = $lead->tags()->where('name', $tagName)->exists();

            // Log da execução
            LoggerFacade::info("Lead {$lead->id} tag check result", [
                'tag_name' => $tagName,
                'has_tag' => $hasTag
            ]);

            return [
                'success' => true,
                'hasTag' => $hasTag,
                'tagName' => $tagName,
                'leadId' => $lead->id,
                'executedAt' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            LoggerFacade::error("Error executing Lead Has Tag Node", [
                'lead_id' => $lead->id,
                'node_id' => $node->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'hasTag' => false
            ];
        }
    }

    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        $config = $node->configuration ?? [];
        $tagName = $config['tag_name'] ?? null;

        if (!$tagName) {
            LoggerFacade::warning("Lead Has Tag Node for lead {$lead->id} has no tag name configured.");
            return null;
        }

        // Verificar se o lead tem a tag
        $hasTag = $lead->tags()->where('name', $tagName)->exists();

        // Retornar próximo nó baseado na condição
        if ($hasTag) {
            return $config['true_node_id'] ?? $config['next_node_id'] ?? $node->next_node_id ?? null;
        } else {
            return $config['false_node_id'] ?? null;
        }
    }
}
