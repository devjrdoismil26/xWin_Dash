<?php

namespace App\Infrastructure\Monitoring;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AlertingService
{
    /**
     * Envia um alerta por e-mail.
     *
     * @param string $subject    o assunto do e-mail
     * @param string $message    o corpo da mensagem
     * @param array  $recipients uma lista de endereços de e-mail
     *
     * @return bool
     */
    public function sendEmailAlert(string $subject, string $message, array $recipients): bool
    {
        Log::info("Enviando alerta por e-mail para: " . implode(', ', $recipients) . ". Assunto: {$subject}.");
        try {
            Mail::raw($message, function ($mail) use ($subject, $recipients) {
                $mail->to($recipients)->subject($subject);
            });
            return true;
        } catch (\Exception $e) {
            Log::error("Falha ao enviar alerta por e-mail: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Envia um alerta para o Slack via webhook.
     *
     * @param string $message    a mensagem a ser enviada
     * @param string $webhookUrl a URL do webhook do Slack
     *
     * @return bool
     */
    public function sendSlackAlert(string $message, string $webhookUrl): bool
    {
        Log::info("Enviando alerta para o Slack.");
        try {
            $response = Http::post($webhookUrl, [
                'text' => $message,
            ]);
            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Falha ao enviar alerta para o Slack: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Envia um alerta genérico (pode ser estendido para outros canais).
     *
     * @param string $type    o tipo de alerta (ex: 'critical', 'warning')
     * @param string $message a mensagem do alerta
     * @param array  $context dados adicionais do contexto
     */
    public function sendAlert(string $type, string $message, array $context = []): void
    {
        Log::{$type}("ALERTA [{$type}]: {$message}. Contexto: " . json_encode($context));

        // Exemplo de lógica para decidir onde enviar o alerta
        if ($type === 'critical') {
            $this->sendEmailAlert("ALERTA CRÍTICO: {$message}", $message . "\nContexto: " . json_encode($context), [config('app.admin_email')]);
            // $this->sendSlackAlert($message, config('services.slack.webhook_url'));
        }
    }
}
