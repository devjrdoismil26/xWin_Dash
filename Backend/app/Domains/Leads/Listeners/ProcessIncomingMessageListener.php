<?php

namespace App\Domains\Leads\Listeners;

use App\Domains\Core\Events\IncomingMessageEvent; // Supondo que este evento exista no módulo Core
use App\Domains\Leads\Services\LeadHistoryService;
use App\Domains\Leads\Services\LeadService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class ProcessIncomingMessageListener implements ShouldQueue
{
    use InteractsWithQueue;

    protected LeadService $leadService;

    protected LeadHistoryService $leadHistoryService;

    public function __construct(LeadService $leadService, LeadHistoryService $leadHistoryService)
    {
        $this->leadService = $leadService;
        $this->leadHistoryService = $leadHistoryService;
    }

    /**
     * Handle the event.
     *
     * @param IncomingMessageEvent $event
     */
    public function handle(IncomingMessageEvent $event)
    {
        $senderIdentifier = $event->senderIdentifier; // Ex: email, phone, social_id
        $messageContent = $event->messageContent;
        $channel = $event->channel; // Ex: 'email', 'whatsapp', 'facebook_messenger'

        Log::info("Processando mensagem de entrada do canal {$channel} de {$senderIdentifier}.");

        // Tentar encontrar o Lead pelo identificador do remetente
        $lead = $this->leadService->findLeadByEmailOrPhone($senderIdentifier); // Supondo um método de busca

        if ($lead) {
            // Registrar a mensagem no histórico do Lead
            $this->leadHistoryService->recordActivity(
                $lead->id,
                "Mensagem Recebida ({$channel})",
                $messageContent,
                ['channel' => $channel, 'sender' => $senderIdentifier],
            );
            Log::info("Mensagem registrada no histórico do Lead ID: {$lead->id}.");

            // Aqui você pode disparar workflows, atualizar status, etc.
            // ProcessLeadWorkflows::dispatch($lead, 'incoming_message');
        } else {
            Log::info("Nenhum Lead encontrado para o identificador {$senderIdentifier}. Criando novo Lead.");
            // Criar um novo Lead se não for encontrado
            $newLead = $this->leadService->createLead([
                'email' => ($channel === 'email') ? $senderIdentifier : null,
                'phone' => ($channel === 'whatsapp') ? $senderIdentifier : null,
                'name' => "Lead from {$channel}",
                'source' => $channel,
                'status' => 'new',
            ]);
            $this->leadHistoryService->recordActivity(
                $newLead->id,
                "Mensagem Recebida ({$channel})",
                $messageContent,
                ['channel' => $channel, 'sender' => $senderIdentifier],
            );
        }
    }
}
