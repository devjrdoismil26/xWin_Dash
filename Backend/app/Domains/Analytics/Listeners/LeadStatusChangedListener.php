<?php

namespace App\Domains\Analytics\Listeners;

use App\Domains\Leads\Events\LeadStatusChanged; // Supondo que este evento exista no módulo Leads
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class LeadStatusChangedListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param LeadStatusChanged $event
     */
    public function handle(LeadStatusChanged $event)
    {
        Log::info("LeadStatusChangedListener acionado para o Lead ID: {$event->lead->id}. Novo status: {$event->lead->status}");

        // Lógica para atualizar dados analíticos aqui.
        // Por exemplo, incrementar um contador de leads em um determinado status,
        // ou registrar a transição de status para análise de funil.
        // $this->analyticsService->updateLeadStatusMetrics($event->lead->status);
    }
}
