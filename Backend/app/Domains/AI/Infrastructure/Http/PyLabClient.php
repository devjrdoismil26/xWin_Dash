<?php

namespace App\Domains\AI\Infrastructure\Http;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Domains\AI\Exceptions\PyLabException;

class PyLabClient
{
    private string $baseUrl;
    private int $timeout;
    private int $retryAttempts;
    private int $retryDelay;

    public function __construct()
    {
        $this->baseUrl = config('pylab.url', 'http://localhost:8000');
        $this->timeout = config('pylab.timeout', 300);
        $this->retryAttempts = config('pylab.retry_attempts', 3);
        $this->retryDelay = config('pylab.retry_delay', 1000);
    }

    /**
     * Verificar se PyLab está disponível
     */
    public function isAvailable(): bool
    {
        try {
            $response = Http::timeout(5)->get($this->baseUrl . '/');
            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('PyLab não está disponível', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Gerar vídeo via PyLab
     */
    public function generateVideo(array $params): array
    {
        $this->validateVideoParams($params);

        $payload = [
            'prompt' => $params['prompt'],
            'duration' => $params['duration'] ?? config('pylab.media.video.default_duration'),
            'fps' => $params['fps'] ?? config('pylab.media.video.default_fps'),
            'quality' => $params['quality'] ?? config('pylab.media.video.default_quality'),
            'negative_prompt' => $params['negative_prompt'] ?? '',
            'seed' => $params['seed'] ?? null,
        ];

        return $this->makeRequest('POST', '/generate/video', $payload);
    }

    /**
     * Processar mensagem de chat via PyLab
     */
    public function processChat(array $params): array
    {
        $this->validateChatParams($params);

        $payload = [
            'message' => $params['message'],
            'context' => $params['context'] ?? [],
            'model' => $params['model'] ?? config('pylab.chat.default_model'),
            'temperature' => $params['temperature'] ?? config('pylab.chat.temperature'),
            'max_tokens' => $params['max_tokens'] ?? config('pylab.chat.max_tokens'),
        ];

        return $this->makeRequest('POST', '/analyze/text/business', $payload);
    }

    /**
     * Obter status de geração
     */
    public function getGenerationStatus(string $jobId): array
    {
        return $this->makeRequest('GET', "/status/generation/{$jobId}");
    }

    /**
     * Fazer requisição HTTP com retry
     */
    private function makeRequest(string $method, string $endpoint, array $data = []): array
    {
        $url = $this->baseUrl . $endpoint;
        $attempt = 0;

        while ($attempt < $this->retryAttempts) {
            try {
                Log::info('PyLab Request', [
                    'method' => $method,
                    'url' => $url,
                    'attempt' => $attempt + 1,
                    'data_size' => strlen(json_encode($data))
                ]);

                $response = Http::timeout($this->timeout)
                    ->retry($this->retryAttempts, $this->retryDelay * 1000)
                    ->when($method === 'POST', function ($http) use ($data) {
                        return $http->post($url, $data);
                    })
                    ->when($method === 'GET', function ($http) {
                        return $http->get($url);
                    });

                if ($response->successful()) {
                    $result = $response->json();

                    Log::info('PyLab Response Success', [
                        'url' => $url,
                        'status' => $response->status(),
                        'response_size' => strlen($response->body())
                    ]);

                    return $result;
                }

                Log::warning('PyLab Response Error', [
                    'url' => $url,
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                throw new PyLabException(
                    "PyLab request failed: {$response->status()} - {$response->body()}",
                    $response->status()
                );
            } catch (\Exception $e) {
                $attempt++;

                Log::error('PyLab Request Failed', [
                    'url' => $url,
                    'attempt' => $attempt,
                    'error' => $e->getMessage()
                ]);

                if ($attempt >= $this->retryAttempts) {
                    throw new PyLabException(
                        "PyLab request failed after {$this->retryAttempts} attempts: {$e->getMessage()}",
                        0,
                        $e
                    );
                }

                sleep($this->retryDelay);
            }
        }

        throw new PyLabException("Unexpected error in PyLab request");
    }

    /**
     * Validar parâmetros de vídeo
     */
    private function validateVideoParams(array $params): void
    {
        if (empty($params['prompt'])) {
            throw new PyLabException('Prompt é obrigatório para geração de vídeo');
        }

        if (isset($params['duration'])) {
            $maxDuration = config('pylab.media.video.max_duration');
            if ($params['duration'] > $maxDuration) {
                throw new PyLabException("Duração máxima permitida: {$maxDuration} segundos");
            }
        }

        if (isset($params['quality'])) {
            $supportedQualities = ['sd', 'hd', '4k'];
            if (!in_array($params['quality'], $supportedQualities)) {
                throw new PyLabException('Qualidade deve ser: ' . implode(', ', $supportedQualities));
            }
        }
    }

    /**
     * Validar parâmetros de chat
     */
    private function validateChatParams(array $params): void
    {
        if (empty($params['message'])) {
            throw new PyLabException('Mensagem é obrigatória para chat');
        }

        $maxLength = config('pylab.chat.max_message_length');
        if (strlen($params['message']) > $maxLength) {
            throw new PyLabException("Mensagem muito longa. Máximo: {$maxLength} caracteres");
        }
    }

    /**
     * Obter estatísticas do PyLab
     */
    public function getStats(): array
    {
        try {
            return $this->makeRequest('GET', '/status/detailed');
        } catch (\Exception $e) {
            Log::error('Erro ao obter stats do PyLab', ['error' => $e->getMessage()]);
            return [
                'available' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
