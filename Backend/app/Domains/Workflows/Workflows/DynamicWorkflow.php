<?php

namespace App\Domains\Workflows\Workflows;

use App\Domains\Workflows\Activities\ExecuteNodeActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class DynamicWorkflow extends Workflow
{
    /**
     * Orquestra a execução de um workflow definido dinamicamente (ex: por um construtor visual).
     *
     * @param array $workflowData deve conter 'definition' (array de nós do workflow) e 'context' (dados que fluem pelo workflow)
     *
     * @return \Generator<mixed, mixed, mixed, array> o contexto atualizado após a execução do workflow
     */
    public function definition(array $workflowData): \Generator
    {
        $workflowDefinition = $workflowData['definition'];
        $context = $workflowData['context'] ?? [];

        // Itera sobre os nós do workflow e executa cada um.
        // Em uma implementação real, isso envolveria um parser de grafo
        // para seguir as conexões e condições entre os nós.
        foreach ($workflowDefinition['nodes'] as $node) {
            $context = yield ActivityStub::make(ExecuteNodeActivity::class, [
                'node' => $node,
                'context' => $context,
            ]);
        }

        return $context;
    }
}
