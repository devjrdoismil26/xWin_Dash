<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\Models\AuraFlow;

class AuraFlowTriggerService
{
    /**
     * Verifica se uma mensagem corresponde aos gatilhos de um fluxo.
     *
     * @param AuraFlow $flow    o fluxo a ser verificado
     * @param string   $message a mensagem recebida
     *
     * @return bool true se a mensagem corresponde a algum gatilho do fluxo, false caso contrário
     */
    public function matchesMessage(AuraFlow $flow, string $message): bool
    {
        if (empty($flow->trigger_keywords)) {
            return false;
        }

        $message = strtolower(trim($message));

        foreach ($flow->trigger_keywords as $keyword) {
            if (strpos($message, strtolower($keyword)) !== false) {
                return true;
            }
        }

        return false;
    }

    // [Melhoria Futura] Adicionar outros métodos para diferentes tipos de gatilhos (ex: regex, NLU).
    // Isso dependerá da complexidade desejada para o roteamento de mensagens e da integração com serviços de processamento de linguagem natural.
}
