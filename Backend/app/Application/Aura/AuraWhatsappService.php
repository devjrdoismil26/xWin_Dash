<?php

namespace App\Application\Aura;

use App\Domains\Aura\Services\WhatsAppService; // Supondo que este serviço exista no domínio Aura
use Illuminate\Support\Facades\Log;

class AuraWhatsappService
{
    protected WhatsAppService $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Envia uma mensagem de texto via WhatsApp.
     *
     * @param string $to      número de telefone do destinatário
     * @param string $message o texto da mensagem
     *
     * @return bool
     */
    public function sendTextMessage(string $to, string $message): bool
    {
        Log::info("AuraWhatsappService: Enviando mensagem para {$to}: {$message}");
        try {
            return $this->whatsAppService->sendMessage($to, $message);
        } catch (\Exception $e) {
            Log::error("AuraWhatsappService: Falha ao enviar mensagem para {$to}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Processa uma mensagem de entrada do WhatsApp.
     *
     * @param array $payload o payload do webhook do WhatsApp
     *
     * @return bool
     */
    public function processInboundMessage(array $payload): bool
    {
        Log::info("AuraWhatsappService: Processando mensagem de entrada do WhatsApp.", $payload);
        try {
            // Lógica para extrair informações relevantes do payload e encaminhar para o AuraChatService
            // return $this->whatsAppService->processWebhookPayload($payload);
            return true; // Simulação de sucesso
        } catch (\Exception $e) {
            Log::error("AuraWhatsappService: Falha ao processar mensagem de entrada: " . $e->getMessage());
            return false;
        }
    }
}
