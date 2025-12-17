<?php

namespace App\Domains\Core\Services;

use App\Domains\Core\Exceptions\ExternalServiceException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $apiUrl;

    protected string $accessToken;

    public function __construct()
    {
        $this->apiUrl = config('services.whatsapp.api_url', 'https://graph.facebook.com/v18.0');
        $this->accessToken = config('services.whatsapp.access_token', '');
    }

    /**
     * Envia uma mensagem de texto via WhatsApp.
     *
     * @param string $to      o número de telefone do destinatário
     * @param string $message o texto da mensagem
     *
     * @return array<string, mixed> a resposta da API do WhatsApp
     *
     * @throws ExternalServiceException se a chamada à API falhar
     */
    public function sendTextMessage(string $to, string $message): array
    {
        $response = Http::withToken($this->accessToken)
            ->post("{$this->apiUrl}/messages", [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'text',
                'text' => ['body' => $message],
            ]);

        if ($response->failed()) {
            Log::error("Falha ao enviar mensagem WhatsApp para {$to}: " . $response->body());
            throw new ExternalServiceException("Falha ao enviar mensagem WhatsApp: " . $response->json('error.message', 'Erro desconhecido'));
        }

        Log::info("Mensagem WhatsApp enviada para {$to}. Resposta: " . $response->body());
        return $response->json();
    }

    /**
     * Processa o payload de um webhook do WhatsApp.
     *
     * @param array<string, mixed> $payload o payload completo do webhook
     *
     * @return bool
     */
    public function processWebhookPayload(array $payload): bool
    {
        Log::info("Processando payload do webhook WhatsApp.", $payload);

        // Exemplo simplificado de processamento de mensagem de texto recebida
        if (isset($payload['entry'][0]['changes'][0]['value']['messages'][0])) {
            $message = $payload['entry'][0]['changes'][0]['value']['messages'][0];
            $from = $message['from']; // Número do remetente
            $type = $message['type']; // Tipo da mensagem (text, image, etc.)

            if ($type === 'text') {
                $text = $message['text']['body'];
                Log::info("Mensagem recebida de {$from}: {$text}");
                // Aqui você pode disparar um evento, chamar um serviço de chat, etc.
                // event(new WhatsAppMessageReceived($from, $text));
            }
        }

        return true;
    }
}
