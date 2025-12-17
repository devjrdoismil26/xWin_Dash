<?php

namespace App\Domains\Workflows\Workflows;

use App\Domains\Workflows\Activities\ExecuteNodeActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class LeadWorkflow extends Workflow
{
    /**
     * Orquestra a execução de um workflow dinâmico focado em Leads.
     *
     * @param array<string, mixed> $data deve conter 'definition' (array de nós do workflow) e 'lead_id'
     *
     * @return \Generator<mixed, mixed, mixed, array<string, mixed>> o contexto atualizado após a execução do workflow
     */
    public function definition(array $data): \Generator
    {
        $workflowDefinition = $data['definition'] ?? [];
        $leadId = $data['lead_id'] ?? null;
        $context = $data['context'] ?? [];

        // Adicionar o lead_id ao contexto para todas as activities
        $context['lead_id'] = $leadId;

        // Itera sobre os nós do workflow e executa cada um.
        // Em uma implementação real, isso envolveria um parser de grafo
        // para seguir as conexões e condições entre os nós.
        foreach ($workflowDefinition['nodes'] ?? [] as $node) {
            $context = yield ActivityStub::make(ExecuteNodeActivity::class, [
                'node' => $node,
                'context' => $context,
                'workflow_id' => $data['workflow_id'] ?? null, // Passa o ID do workflow para o log
            ]);
        }

        return $context;
    }
}
