<?php

namespace App\Domains\Leads\Listeners;

use App\Domains\Core\Services\WhatsAppService;
use App\Domains\Leads\Events\LeadStatusChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class UpdateChatStatusListener implements ShouldQueue
{
    use InteractsWithQueue;

    protected WhatsAppService $whatsAppService; // Exemplo de serviço de comunicação

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
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

        Log::info("Atualizando status do chat para Lead {$lead->id} para: {$newStatus}.");

        // Lógica para atualizar o status do chat na plataforma de comunicação
        // Exemplo: Se o status do Lead for 'qualified', enviar uma mensagem de qualificação no chat
        if ($newStatus === 'qualified') {
            // Assumindo que o Lead tem um campo 'chat_id' ou 'whatsapp_number'
            if ($lead->whatsapp_number) {
                $this->whatsAppService->sendTextMessage(
                    $lead->whatsapp_number,
                    "Parabéns! Seu Lead foi qualificado. Um de nossos especialistas entrará em contato em breve.",
                );
                Log::info("Mensagem de qualificação enviada para o chat do Lead {$lead->id}.");
            }
        }

        // Outras lógicas para diferentes status
        // if ($newStatus === 'closed_won') {
        //     // Fechar o chat
        // }
    }
}
