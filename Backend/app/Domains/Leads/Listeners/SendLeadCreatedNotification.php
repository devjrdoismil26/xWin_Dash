<?php

namespace App\Domains\Leads\Listeners;

use App\Domains\Leads\Events\LeadCreated;
use App\Domains\Leads\Notifications\NewLeadNotification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue; // Supondo que esta notificação exista
use Illuminate\Support\Facades\Log;

// Supondo o model de usuário padrão do Laravel

class SendLeadCreatedNotification implements ShouldQueue
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
     * @param LeadCreated $event
     */
    public function handle(LeadCreated $event)
    {
        $lead = $event->lead;

        Log::info("Enviando notificação para novo Lead: {$lead->name} (ID: {$lead->id}).");

        // Exemplo: Notificar um usuário específico (ex: admin, ou o usuário responsável por novos leads)
        $adminUser = User::where('email', 'admin@example.com')->first(); // Buscar o admin ou usuário relevante

        if ($adminUser) {
            $adminUser->notify(new NewLeadNotification($lead));
            Log::info("Notificação de novo Lead enviada para {$adminUser->email}.");
        } else {
            Log::warning("Nenhum usuário administrador encontrado para notificar sobre o novo Lead.");
        }
    }
}
