<?php

namespace App\Domains\Leads\Listeners;

use App\Domains\Leads\Events\LeadStatusChanged;
use App\Domains\Leads\Notifications\NewQualifiedLead;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue; // Supondo que esta notificação exista
use Illuminate\Support\Facades\Log;

// Supondo o model de usuário padrão do Laravel

class SendLeadStatusUpdatedNotification implements ShouldQueue
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
        $lead = $event->lead;
        $newStatus = $event->newStatus;

        Log::info("Enviando notificação para mudança de status do Lead: {$lead->name} para {$newStatus}.");

        // Exemplo: Notificar o proprietário do Lead ou a equipe de vendas
        // Assumindo que o Lead tem um owner_id ou que há uma lógica para determinar o destinatário
        $leadOwner = User::find($lead->user_id); // Supondo que o Lead tem um user_id como proprietário

        if ($leadOwner) {
            $leadOwner->notify(new NewQualifiedLead($lead, $newStatus));
            Log::info("Notificação de status do Lead enviada para {$leadOwner->email}.");
        } else {
            Log::warning("Nenhum proprietário de Lead encontrado para notificar sobre a mudança de status.");
        }
    }
}
