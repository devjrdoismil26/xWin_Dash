<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\OpenAIApiException;
use App\Domains\AI\Services\FunctionCallingService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    protected ApiConfigurationService $apiConfigurationService;
    protected FunctionCallingService $functionCallingService;
    protected string $baseUrl;

    public function __construct(
        ApiConfigurationService $apiConfigurationService,
        FunctionCallingService $functionCallingService
    ) {
        $this->apiConfigurationService = $apiConfigurationService;
        $this->functionCallingService = $functionCallingService;
        $this->baseUrl = config('services.openai.base_url', 'https://api.openai.com/v1');
    }

    /**
     * Obtém a chave de API da OpenAI para o usuário.
     *
     * @param int $userId
     *
     * @return string
     *
     * @throws OpenAIApiException
     */
    protected function getApiKey(int $userId): string
    {
        $config = $this->apiConfigurationService->getConfigurationForUser($userId, 'openai');
        if (empty($config['api_key'])) {
            throw new OpenAIApiException('Chave de API da OpenAI não configurada para o usuário.');
        }
        return $config['api_key'];
    }

    /**
     * Envia uma mensagem de chat para a OpenAI.
     *
     * @param array<int, array<string, mixed>> $messages
     * @param string $model
     * @param int    $userId
     *
     * @return string
     *
     * @throws OpenAIApiException
     */
    public function chat(array $messages, string $model, int $userId): string
    {
        $apiKey = $this->getApiKey($userId);
        $endpoint = "{$this->baseUrl}/chat/completions";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post($endpoint, [
                'model' => $model,
                'messages' => $messages,
            ]);

            if ($response->failed()) {
                Log::error('OpenAI API Error', ['status' => $response->status(), 'body' => $response->body()]);
                throw new OpenAIApiException('Falha na comunicação com a API da OpenAI: ' . $response->body(), $response->status());
            }

            $responseData = $response->json();
            return $responseData['choices'][0]['message']['content'] ?? 'Não foi possível obter uma resposta.';
        } catch (\Exception $e) {
            throw new OpenAIApiException('Erro ao chamar a API da OpenAI: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Gera texto usando OpenAI com prompt simples.
     *
     * @param string $prompt
     * @param string $model
     * @param int|null $userId
     *
     * @return string
     *
     * @throws OpenAIApiException
     */
    public function generateText(string $prompt, string $model = 'gpt-3.5-turbo', ?int $userId = null): string
    {
        // Usar API key padrão se userId não fornecido
        $apiKey = $userId ? $this->getApiKey($userId) : config('services.openai.api_key');

        if (empty($apiKey)) {
            throw new OpenAIApiException('Chave de API da OpenAI não configurada.');
        }

        $messages = [
            ['role' => 'user', 'content' => $prompt]
        ];

        return $this->chat($messages, $model, $userId ?? 1);
    }

    /**
     * Verifica a conectividade com a API da OpenAI.
     *
     * @param int $userId
     *
     * @return bool
     */
    public function canConnect(int $userId): bool
    {
        try {
            $apiKey = $this->getApiKey($userId);
            $endpoint = "{$this->baseUrl}/models";
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->get($endpoint);
            return $response->successful();
        } catch (OpenAIApiException $e) {
            return false;
        }
    }

    /**
     * Envia uma mensagem de chat com suporte a function calling.
     */
    public function chatWithFunctions(array $messages, string $model, int $userId, bool $enableFunctions = true): array
    {
        $apiKey = $this->getApiKey($userId);

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => 0.7,
            'max_tokens' => 1000,
        ];

        // Adicionar funções se habilitado
        if ($enableFunctions) {
            $functions = $this->functionCallingService->getFunctionSchemasForProvider('openai');
            if (!empty($functions)) {
                $payload['tools'] = array_map(function ($func) {
                    return [
                        'type' => 'function',
                        'function' => $func
                    ];
                }, $functions);
                $payload['tool_choice'] = 'auto';
            }
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/chat/completions", $payload);

        if ($response->failed()) {
            Log::error('Falha na requisição para OpenAI com functions', [
                'status' => $response->status(),
                'body' => $response->body(),
                'payload' => $payload,
            ]);

            throw new OpenAIApiException('Falha na requisição para OpenAI: ' . $response->body());
        }

        $responseData = $response->json();

        // Processar function calls se existirem
        if ($enableFunctions) {
            $responseData = $this->functionCallingService->processAIResponse($responseData, 'openai');
        }

        return $responseData;
    }

    /**
     * Obtém funções disponíveis para function calling
     */
    public function getAvailableFunctions(): array
    {
        return $this->functionCallingService->getAvailableFunctions();
    }

    /**
     * Registra uma nova função para function calling
     */
    public function registerFunction(string $name, array $schema, callable $handler): void
    {
        $this->functionCallingService->registerFunction($name, $schema, $handler);
    }
}
