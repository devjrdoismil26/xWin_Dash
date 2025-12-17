<?php

namespace App\Domains\Projects\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendLeadToWebhook implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected array $leadData;

    protected string $webhookUrl;

    /**
     * Create a new job instance.
     *
     * @param array  $leadData   os dados do Lead a serem enviados
     * @param string $webhookUrl a URL do webhook de destino
     */
    public function __construct(array $leadData, string $webhookUrl)
    {
        $this->leadData = $leadData;
        $this->webhookUrl = $webhookUrl;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        Log::info("Enviando dados do Lead para o webhook: {$this->webhookUrl}");

        try {
            $response = Http::post($this->webhookUrl, $this->leadData);

            if ($response->successful()) {
                Log::info("Dados do Lead enviados com sucesso para o webhook: {$this->webhookUrl}");
            } else {
                Log::error("Falha ao enviar dados do Lead para o webhook: {$this->webhookUrl}. Status: {$response->status()}, Resposta: {$response->body()}");
                // Aqui você pode adicionar lógica de retentativa ou notificação de erro
            }
        } catch (\Exception $e) {
            Log::error("Erro ao conectar ou enviar dados para o webhook: {$this->webhookUrl}. Erro: " . $e->getMessage());
            // Aqui você pode adicionar lógica de retentativa ou notificação de erro
        }
    }
}
