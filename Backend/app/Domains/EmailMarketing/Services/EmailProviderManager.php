<?php

namespace App\Domains\EmailMarketing\Services;

use App\Domains\EmailMarketing\Exceptions\EmailProviderException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EmailProviderManager
{
    /**
     * Envia email usando o provider configurado.
     *
     * @param string $to
     * @param string $subject
     * @param string $body
     * @param array $options
     * @return array
     */
    public function sendEmail(string $to, string $subject, string $body, array $options = []): array
    {
        $provider = config('mail.default', 'smtp');

        Log::info("Enviando email via {$provider} para: {$to}");

        try {
            switch ($provider) {
                case 'mailgun':
                    return $this->sendViaMailgun($to, $subject, $body, $options);

                case 'sendgrid':
                    return $this->sendViaSendGrid($to, $subject, $body, $options);

                case 'ses':
                    return $this->sendViaSES($to, $subject, $body, $options);

                default:
                    return $this->sendViaLaravel($to, $subject, $body, $options);
            }
        } catch (\Exception $e) {
            Log::error("Falha ao enviar email via {$provider}: " . $e->getMessage());
            throw new EmailProviderException("Falha no envio: " . $e->getMessage());
        }
    }

    /**
     * Envia email via Mailgun API.
     */
    protected function sendViaMailgun(string $to, string $subject, string $body, array $options = []): array
    {
        $domain = config('services.mailgun.domain');
        $secret = config('services.mailgun.secret');
        $from = $options['from'] ?? config('mail.from.address');

        if (!$domain || !$secret) {
            throw new EmailProviderException('Mailgun não configurado corretamente.');
        }

        $response = Http::withBasicAuth('api', $secret)
            ->asForm()
            ->post("https://api.mailgun.net/v3/{$domain}/messages", [
                'from' => $from,
                'to' => $to,
                'subject' => $subject,
                'html' => $body,
                'text' => strip_tags($body),
            ]);

        if ($response->successful()) {
            $result = $response->json();
            Log::info("Email enviado via Mailgun: " . $result['id']);
            return [
                'success' => true,
                'message_id' => $result['id'],
                'provider' => 'mailgun'
            ];
        } else {
            throw new EmailProviderException('Mailgun API Error: ' . $response->body());
        }
    }

    /**
     * Envia email via SendGrid API.
     */
    protected function sendViaSendGrid(string $to, string $subject, string $body, array $options = []): array
    {
        $apiKey = config('services.sendgrid.api_key');
        $from = $options['from'] ?? config('mail.from.address');

        if (!$apiKey) {
            throw new EmailProviderException('SendGrid não configurado corretamente.');
        }

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.sendgrid.com/v3/mail/send', [
            'personalizations' => [
                [
                    'to' => [['email' => $to]],
                    'subject' => $subject,
                ]
            ],
            'from' => ['email' => $from],
            'content' => [
                [
                    'type' => 'text/html',
                    'value' => $body
                ]
            ]
        ]);

        if ($response->successful()) {
            $messageId = $response->header('X-Message-Id');
            Log::info("Email enviado via SendGrid: " . $messageId);
            return [
                'success' => true,
                'message_id' => $messageId,
                'provider' => 'sendgrid'
            ];
        } else {
            throw new EmailProviderException('SendGrid API Error: ' . $response->body());
        }
    }

    /**
     * Envia email via Amazon SES.
     */
    protected function sendViaSES(string $to, string $subject, string $body, array $options = []): array
    {
        // SES é melhor manejado pelo Laravel Mail nativo
        return $this->sendViaLaravel($to, $subject, $body, $options);
    }

    /**
     * Envia email via Laravel Mail (SMTP/SES configurado).
     */
    protected function sendViaLaravel(string $to, string $subject, string $body, array $options = []): array
    {
        $from = $options['from'] ?? config('mail.from.address');

        Mail::html($body, function ($message) use ($to, $subject, $from) {
            $message->to($to)
                    ->subject($subject)
                    ->from($from);
        });

        Log::info("Email enviado via Laravel Mail para: {$to}");
        return [
            'success' => true,
            'message_id' => uniqid('laravel_mail_'),
            'provider' => 'laravel'
        ];
    }

    /**
     * Verifica se o provider está configurado corretamente.
     */
    public function testConnection(string $provider = null): bool
    {
        $provider = $provider ?? config('mail.default');

        try {
            switch ($provider) {
                case 'mailgun':
                    $domain = config('services.mailgun.domain');
                    $secret = config('services.mailgun.secret');
                    return !empty($domain) && !empty($secret);

                case 'sendgrid':
                    return !empty(config('services.sendgrid.api_key'));

                case 'ses':
                    return !empty(config('services.ses.key')) && !empty(config('services.ses.secret'));

                default:
                    return true; // SMTP sempre disponível
            }
        } catch (\Exception $e) {
            Log::error("Erro ao testar conexão {$provider}: " . $e->getMessage());
            return false;
        }
    }
}
