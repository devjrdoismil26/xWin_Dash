<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\Lead; // Supondo que a entidade de domínio exista
use App\Domains\Leads\Workflows\LeadNurturingWorkflow; // Supondo que este workflow exista
use Illuminate\Support\Facades\Log;

class WorkflowService
{
    /**
     * Inicia um workflow para um Lead específico.
     *
     * @param Lead   $lead         o Lead para iniciar o workflow
     * @param string $workflowType o tipo de workflow a ser iniciado (ex: 'welcome_workflow', 'nurturing_workflow')
     * @param array  $initialData  dados iniciais para o workflow
     *
     * @return bool
     */
    public function startWorkflowForLead(Lead $lead, string $workflowType, array $initialData = []): bool
    {
        Log::info("Iniciando workflow '{$workflowType}' para Lead ID: {$lead->id}.");

        switch ($workflowType) {
            case 'welcome_workflow':
                // Exemplo: Disparar um job ou evento para o workflow de boas-vindas
                // WelcomeWorkflowJob::dispatch($lead, $initialData);
                Log::info("Workflow de boas-vindas iniciado para Lead ID: {$lead->id}.");
                return true;
            case 'nurturing_workflow':
                // Iniciar o workflow de nutrição
                $nurturingWorkflow = new LeadNurturingWorkflow($lead);
                $nurturingWorkflow->start($initialData);
                Log::info("Workflow de nutrição iniciado para Lead ID: {$lead->id}.");
                return true;
            default:
                Log::warning("Tipo de workflow desconhecido: {$workflowType}");
                return false;
        }
    }

    /**
     * Avalia e avança um Lead em seus workflows ativos.
     *
     * @param Lead   $lead         o Lead a ser avaliado
     * @param string $triggerEvent o evento que disparou a avaliação (ex: 'status_change', 'score_update')
     * @param array  $eventData    dados do evento
     *
     * @return bool
     */
    public function evaluateWorkflowsForLead(Lead $lead, string $triggerEvent, array $eventData = []): bool
    {
        Log::info("Avaliando workflows para Lead ID: {$lead->id} devido ao evento: {$triggerEvent}.");
        $workflowProgressed = false;

        // Exemplo: Avaliar o workflow de nutrição
        $nurturingWorkflow = new LeadNurturingWorkflow($lead);
        if ($nurturingWorkflow->evaluate($triggerEvent, $eventData)) {
            $workflowProgressed = true;
            Log::info("Workflow de nutrição avançou para Lead ID: {$lead->id}.");
        }

        // Adicionar avaliação para outros workflows ativos do Lead

        return $workflowProgressed;
    }
}
