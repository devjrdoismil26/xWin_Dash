<?php

namespace App\Domains\Core\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CallWebhookJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected string $url;

    protected array $payload;

    protected array $headers;

    /**
     * Create a new job instance.
     *
     * @param string $url     o URL do webhook
     * @param array  $payload o payload a ser enviado
     * @param array  $headers cabeçalhos HTTP adicionais
     */
    public function __construct(string $url, array $payload = [], array $headers = [])
    {
        $this->url = $url;
        $this->payload = $payload;
        $this->headers = $headers;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        try {
            $response = Http::withHeaders($this->headers)->post($this->url, $this->payload);

            if ($response->successful()) {
                Log::info("Webhook para {$this->url} chamado com sucesso. Resposta: " . $response->body());
            } else {
                Log::error("Falha ao chamar webhook para {$this->url}. Status: {$response->status()}, Resposta: " . $response->body());
                // Lógica para re-tentar ou lidar com a falha
            }
        } catch (\Exception $e) {
            Log::error("Exceção ao chamar webhook para {$this->url}: " . $e->getMessage());
            // Lógica para re-tentar ou lidar com a exceção
        }
    }
}
