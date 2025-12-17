<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\ClaudeApiException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ClaudeService
{
    protected ApiConfigurationService $apiConfigurationService;

    protected string $baseUrl;

    public function __construct(ApiConfigurationService $apiConfigurationService)
    {
        $this->apiConfigurationService = $apiConfigurationService;
        $this->baseUrl = config('services.claude.base_url', 'https://api.anthropic.com/v1');
    }

    /**
     * Obtém a chave de API do Claude para o usuário.
     *
     * @param int $userId
     *
     * @return string
     *
     * @throws ClaudeApiException
     */
    protected function getApiKey(int $userId): string
    {
        $config = $this->apiConfigurationService->getConfigurationForUser($userId, 'claude');
        if (empty($config['api_key'])) {
            throw new ClaudeApiException('Chave de API do Claude não configurada para o usuário.');
        }
        return $config['api_key'];
    }

    /**
     * Envia uma mensagem de chat para o Claude.
     *
     * @param array<int, array<string, mixed>> $messages
     * @param string $model
     * @param int    $userId
     *
     * @return string
     *
     * @throws ClaudeApiException
     */
    public function chat(array $messages, string $model, int $userId): string
    {
        $apiKey = $this->getApiKey($userId);
        $endpoint = "{$this->baseUrl}/messages";

        try {
            $response = Http::withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type' => 'application/json',
            ])->post($endpoint, [
                'model' => $model,
                'messages' => $messages,
                'max_tokens' => 1024, // Exemplo
            ]);

            if ($response->failed()) {
                Log::error('Claude API Error', ['status' => $response->status(), 'body' => $response->body()]);
                throw new ClaudeApiException('Falha na comunicação com a API do Claude: ' . $response->body(), $response->status());
            }

            $responseData = $response->json();
            return $responseData['content'][0]['text'] ?? 'Não foi possível obter uma resposta.';
        } catch (\Exception $e) {
            throw new ClaudeApiException('Erro ao chamar a API do Claude: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Gera texto usando Claude com prompt simples.
     *
     * @param string $prompt
     * @param string $model
     * @param int|null $userId
     *
     * @return string
     *
     * @throws ClaudeApiException
     */
    public function generateText(string $prompt, string $model = 'claude-3-sonnet-20240229', ?int $userId = null): string
    {
        // Usar API key padrão se userId não fornecido
        $apiKey = $userId ? $this->getApiKey($userId) : config('services.anthropic.api_key');

        if (empty($apiKey)) {
            throw new ClaudeApiException('Chave de API do Claude não configurada.');
        }

        $messages = [
            ['role' => 'user', 'content' => $prompt]
        ];

        return $this->chat($messages, $model, $userId ?? 1);
    }

    /**
     * Verifica a conectividade com a API do Claude.
     *
     * @param int $userId
     *
     * @return bool
     */
    public function canConnect(int $userId): bool
    {
        try {
            $apiKey = $this->getApiKey($userId);
            $endpoint = "{$this->baseUrl}/models"; // Endpoint para listar modelos
            $response = Http::withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
            ])->get($endpoint);
            return $response->successful();
        } catch (ClaudeApiException $e) {
            return false;
        }
    }
}
