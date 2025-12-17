<?php

namespace App\Domains\Leads\Listeners;

use App\Domains\Leads\Events\LeadStatusChanged;
use App\Domains\Leads\Services\LeadHistoryService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class RecordLeadStatusChange implements ShouldQueue
{
    use InteractsWithQueue;

    protected LeadHistoryService $leadHistoryService;

    public function __construct(LeadHistoryService $leadHistoryService)
    {
        $this->leadHistoryService = $leadHistoryService;
    }

    /**
     * Handle the event.
     *
     * @param LeadStatusChanged $event
     */
    public function handle(LeadStatusChanged $event)
    {
        $lead = $event->lead;
        $oldStatus = $lead->status; // Assumindo que o Lead ainda tem o status antigo antes da atualização
        $newStatus = $event->newStatus;

        Log::info("Registrando mudança de status para Lead {$lead->id}: de {$oldStatus} para {$newStatus}.");

        $this->leadHistoryService->recordActivity(
            $lead->id,
            'status_change',
            "Status do Lead alterado de '{$oldStatus}' para '{$newStatus}'.",
            ['old_status' => $oldStatus, 'new_status' => $newStatus],
        );
    }
}
