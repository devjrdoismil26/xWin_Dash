<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\Lead; // Supondo que a entidade de domínio exista
use App\Domains\Leads\Notifications\NurturingNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class NurturingRuleService
{
    /**
     * Avalia as regras de nutrição para um Lead e dispara ações.
     *
     * @param Lead $lead o Lead a ser avaliado
     *
     * @return bool true se alguma regra foi aplicada
     */
    public function evaluateNurturingRules(Lead $lead): bool
    {
        Log::info("Avaliando regras de nutrição para o Lead ID: {$lead->id}.");
        $ruleApplied = false;

        // Exemplo de regra: Se o Lead está no status 'new' e tem score > 50, enviar e-mail de boas-vindas
        if ($lead->status === 'new' && $lead->score > 50) {
            Log::info("Regra de nutrição: Lead ID {$lead->id} qualificado para e-mail de boas-vindas.");
            // Disparar um evento ou job para enviar o e-mail de boas-vindas
            // event(new SendWelcomeEmail($lead));

            // Enviar notificação para o usuário
            if (Auth::check()) {
                $user = Auth::user();
                $user->notify(new NurturingNotification($lead, 'welcome_email_sent', [
                    'message' => 'Email de boas-vindas enviado para o lead',
                    'campaign_name' => 'Welcome Series',
                    'campaign_type' => 'email'
                ]));
            }

            $ruleApplied = true;
        }

        // Exemplo de outra regra: Se o Lead clicou em 3 e-mails, mudar status para 'engaged'
        // if ($this->hasClickedMultipleEmails($lead, 3)) {
        //     $this->leadService->updateLeadStatus($lead->id, 'engaged');
        //     $ruleApplied = true;
        // }

        return $ruleApplied;
    }

    /**
     * Adiciona uma nova regra de nutrição.
     *
     * @param array $ruleData dados da regra (condições, ações)
     *
     * @return bool
     */
    public function addNurturingRule(array $ruleData): bool
    {
        // Em um cenário real, isso persistiria a regra em um banco de dados.
        Log::info("Nova regra de nutrição adicionada.", $ruleData);
        return true; // Simulação de sucesso
    }
}
