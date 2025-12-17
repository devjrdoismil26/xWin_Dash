<?php

namespace App\Domains\Workflows\Executors;

use App\Domains\Leads\Models\Lead;
use App\Domains\Workflows\Contracts\WorkflowNodeExecutor;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel;
use App\Domains\Workflows\ValueObjects\WorkflowExecutionContext;
use Illuminate\Support\Facades\Log as LoggerFacade;

// Usaremos este job para o próximo nó

class DelayNodeExecutor implements WorkflowNodeExecutor
{
    public function execute(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): mixed
    {
        LoggerFacade::info("Executando DelayNodeExecutor para node {$node->id} e lead {$lead->id}");

        $config = $node->configuration ?? [];
        $delayInSeconds = $config['delay_seconds'] ?? $config['delay'] ?? 0;

        if ($delayInSeconds <= 0) {
            LoggerFacade::warning("Delay inválido ou zero para lead {$lead->id}. Prosseguindo sem delay.");
            return $context->getData();
        }

        // O atraso real será aplicado ao despachar o próximo job
        LoggerFacade::info("Delay configurado para {$delayInSeconds} segundos para lead {$lead->id}.");

        // Adicionar informação de delay ao contexto
        $context->setData('delay_initiated', true);
        $context->setData('delay_seconds', $delayInSeconds);
        $context->setData('delay_scheduled_at', now()->addSeconds($delayInSeconds)->toIso8601String());

        return $context->getData();
    }

    public function getNextNodeId(WorkflowNodeModel $node, Lead $lead, WorkflowExecutionContext $context): ?string
    {
        // Para nós de delay, seguimos para o próximo nó configurado
        return $node->next_node_id ? (string) $node->next_node_id : null;
    }
}
