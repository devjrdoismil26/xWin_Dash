<?php

namespace App\Domains\Aura\Contracts;

use App\Domains\Aura\Models\AuraFlowNode;
use App\Domains\Aura\Models\AuraUraSession;

interface NodeExecutorInterface
{
    /**
     * Executa a lógica de um nó de fluxo.
     *
     * @param AuraFlowNode   $node    o nó a ser executado
     * @param AuraUraSession $session a sessão atual da URA
     * @param array<string, mixed>          $input   o input do usuário (ex: mensagem de texto)
     *
     * @return array<string, mixed> o resultado da execução, contendo a próxima ação
     */
    public function execute(AuraFlowNode $node, AuraUraSession $session, array $input): array;
}
