<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\Veo3ApiException;
use Illuminate\Support\Facades\Http;

// Supondo que esta exceção exista

class Veo3Service
{
    protected string $baseUrl;

    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.veo3.base_url', 'https://api.veo3.com');
        $this->apiKey = config('services.veo3.api_key');

        if (empty($this->apiKey)) {
            throw new Veo3ApiException('API Key do Veo3 não configurada.');
        }
    }

    /**
     * Inicia um job de geração de vídeo.
     *
     * @param string $prompt  o prompt para a geração do vídeo
     * @param array<string, mixed> $options Opções adicionais (duração, estilo, etc.).
     *
     * @return string o ID do job de geração de vídeo
     *
     * @throws Veo3ApiException
     */
    public function startGenerationJob(string $prompt, array $options = []): string
    {
        $endpoint = "{$this->baseUrl}/video/generate";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($endpoint, [
                'prompt' => $prompt,
                'options' => $options,
            ]);

            if ($response->failed()) {
                throw new Veo3ApiException('Falha ao iniciar job de geração de vídeo no Veo3: ' . $response->body(), $response->status());
            }

            $responseData = $response->json();
            return $responseData['job_id'] ?? throw new Veo3ApiException('Job ID não retornado pela API do Veo3.');
        } catch (\Exception $e) {
            throw new Veo3ApiException('Erro ao chamar a API do Veo3: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Obtém o status de um job de geração de vídeo.
     *
     * @param string $jobId
     *
     * @return array<string, mixed>
     *
     * @throws Veo3ApiException
     */
    public function getJobStatus(string $jobId): array
    {
        $endpoint = "{$this->baseUrl}/video/status/{$jobId}";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($endpoint);

            if ($response->failed()) {
                throw new Veo3ApiException('Falha ao obter status do job no Veo3: ' . $response->body(), $response->status());
            }

            return $response->json();
        } catch (\Exception $e) {
            throw new Veo3ApiException('Erro ao chamar a API do Veo3: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }
}
