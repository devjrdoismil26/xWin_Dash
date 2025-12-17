<?php

namespace App\Domains\Workflows\Workflows;

use App\Domains\Workflows\Activities\AuraNodeActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class AuraFlowWorkflow extends Workflow
{
    /**
     * Orquestra a execução de um fluxo de chatbot (URA) do módulo Aura.
     *
     * @param array<string, mixed> $flowData deve conter 'definition' (array de nós do fluxo) e 'context' (contexto da conversa)
     *
     * @return \Generator<mixed, mixed, mixed, array<string, mixed>> o contexto atualizado da conversa após a execução do fluxo
     */
    /**
     * @param array<string, mixed> $flowData
     * @return \Generator<mixed, mixed, mixed, array<string, mixed>>
     */
    public function definition(array $flowData): \Generator
    {
        $flowDefinition = $flowData['definition'];
        $context = $flowData['context'] ?? [];

        // Itera sobre os nós do fluxo Aura e executa cada um.
        // A lógica de navegação entre nós (condições, branches) deve ser tratada dentro da AuraNodeActivity
        // ou por um mecanismo mais avançado de workflow dinâmico.
        foreach ($flowDefinition['nodes'] as $node) {
            $context = yield ActivityStub::make(AuraNodeActivity::class, [
                'node' => $node,
                'context' => $context,
            ]);
        }

        return $context;
    }
}
