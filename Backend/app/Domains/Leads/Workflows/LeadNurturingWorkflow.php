<?php

namespace App\Domains\Leads\Workflows;

use App\Domains\Leads\Domain\Lead; // Supondo que a entidade de domínio exista
use Illuminate\Support\Facades\Log;

class LeadNurturingWorkflow
{
    protected Lead $lead;

    protected string $currentState;

    public function __construct(Lead $lead)
    {
        $this->lead = $lead;
        // Carregar o estado atual do workflow para este Lead (ex: do banco de dados)
        $this->currentState = $lead->customFields['nurturing_workflow_state'] ?? 'start';
    }

    /**
     * Inicia o workflow de nutrição.
     *
     * @param array $initialData dados iniciais para o workflow
     */
    public function start(array $initialData = []): void
    {
        Log::info("Iniciando LeadNurturingWorkflow para Lead ID: {$this->lead->id}. Estado inicial: {$this->currentState}.");
        // Lógica para o estado inicial
        $this->transitionTo('welcome_email_sent');
    }

    /**
     * Avalia o workflow com base em um evento e avança o estado.
     *
     * @param string $triggerEvent o evento que disparou a avaliação
     * @param array  $eventData    dados do evento
     *
     * @return bool true se o workflow avançou de estado
     */
    public function evaluate(string $triggerEvent, array $eventData = []): bool
    {
        Log::info("Avaliando LeadNurturingWorkflow para Lead ID: {$this->lead->id}. Evento: {$triggerEvent}, Estado atual: {$this->currentState}.");
        $stateChanged = false;

        switch ($this->currentState) {
            case 'start':
                // Já tratado no método start()
                break;
            case 'welcome_email_sent':
                if ($triggerEvent === 'email_opened' && $eventData['email_type'] === 'welcome') {
                    $this->transitionTo('follow_up_scheduled');
                    $stateChanged = true;
                }
                break;
            case 'follow_up_scheduled':
                if ($triggerEvent === 'follow_up_completed') {
                    $this->transitionTo('qualified_check');
                    $stateChanged = true;
                }
                break;
            case 'qualified_check':
                if ($this->lead->status === 'qualified') {
                    $this->transitionTo('sales_handover');
                    $stateChanged = true;
                } elseif ($triggerEvent === 'no_engagement') {
                    $this->transitionTo('re_engagement_campaign');
                    $stateChanged = true;
                }
                break;
            case 'sales_handover':
                // Workflow concluído ou transferido para outro processo
                break;
            case 're_engagement_campaign':
                // Lógica para campanha de reengajamento
                break;
            default:
                Log::warning("Estado de workflow desconhecido: {$this->currentState}");
                break;
        }

        return $stateChanged;
    }

    /**
     * Transiciona o workflow para um novo estado.
     *
     * @param string $newState o novo estado
     */
    protected function transitionTo(string $newState): void
    {
        Log::info("LeadNurturingWorkflow para Lead ID: {$this->lead->id} transicionando de {$this->currentState} para {$newState}.");
        $this->currentState = $newState;
        // Salvar o novo estado no Lead (ex: em um campo personalizado)
        $this->lead->customFields['nurturing_workflow_state'] = $newState;
        // $this->lead->save(); // Persistir a mudança

        // Disparar ações associadas à transição de estado
        $this->executeStateActions($newState);
    }

    /**
     * Executa as ações associadas a um novo estado.
     *
     * @param string $state o estado atual
     */
    protected function executeStateActions(string $state): void
    {
        switch ($state) {
            case 'welcome_email_sent':
                // Disparar job para enviar e-mail de boas-vindas
                // SendWelcomeEmailJob::dispatch($this->lead);
                break;
            case 'follow_up_scheduled':
                // Agendar tarefa de follow-up
                // ScheduleFollowUpTaskJob::dispatch($this->lead);
                break;
            case 'sales_handover':
                // Notificar equipe de vendas
                // NotifySalesTeamJob::dispatch($this->lead);
                break;
                // ... outras ações para outros estados
        }
    }
}
