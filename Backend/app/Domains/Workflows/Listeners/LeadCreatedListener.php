<?php

namespace App\Domains\Workflows\Listeners;

use App\Domains\Leads\Events\LeadCreated; // Supondo que este evento exista no módulo Leads
use App\Domains\Workflows\Services\WorkflowTriggerService; // Supondo que este serviço exista
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class LeadCreatedListener implements ShouldQueue
{
    use InteractsWithQueue;

    protected WorkflowTriggerService $workflowTriggerService;

    public function __construct(WorkflowTriggerService $workflowTriggerService)
    {
        $this->workflowTriggerService = $workflowTriggerService;
    }

    /**
     * Handle the LeadCreated event.
     *
     * @param LeadCreated $event
     */
    public function handle(LeadCreated $event): void
    {
        $lead = $event->lead;

        Log::info("Lead criado: {$lead->email} (ID: {$lead->id}). Verificando workflows para disparar.");

        try {
            // Exemplo: Disparar um workflow de boas-vindas para o novo Lead
            // Você pode ter uma lógica para identificar qual workflow disparar
            $workflowId = config('workflows.default_lead_creation_workflow_id'); // Supondo uma configuração

            if ($workflowId) {
                $this->workflowTriggerService->startWorkflow($workflowId, ['lead_id' => $lead->id, 'lead_data' => $lead->toArray()]);
                Log::info("Workflow ID: {$workflowId} disparado para o novo Lead ID: {$lead->id}.");
            } else {
                Log::warning("Nenhum workflow configurado para ser disparado na criação de Leads.");
            }
        } catch (\Exception $e) {
            Log::error("Falha ao disparar workflow na criação do Lead ID: {$lead->id}. Erro: " . $e->getMessage());
        }
    }
}
