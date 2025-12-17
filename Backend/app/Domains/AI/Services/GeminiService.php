<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\GeminiApiException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected ApiConfigurationService $apiConfigurationService;

    protected string $baseUrl;

    public function __construct(ApiConfigurationService $apiConfigurationService)
    {
        $this->apiConfigurationService = $apiConfigurationService;
        // Usar AI Studio API em vez de GCP API
        $this->baseUrl = config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
    }

    /**
     * Obtém a chave de API do Gemini para o usuário.
     *
     * @param int $userId
     *
     * @return string
     *
     * @throws GeminiApiException
     */
    protected function getApiKey(int $userId): string
    {
        $config = $this->apiConfigurationService->getConfigurationForUser($userId, 'gemini');
        if (empty($config['api_key'])) {
            throw new GeminiApiException('Chave de API do Gemini não configurada para o usuário.');
        }
        return $config['api_key'];
    }

    /**
     * Envia uma mensagem de chat para o Gemini.
     *
     * @param string $message
     * @param array<int, array<string, mixed>> $history
     * @param int    $userId
     *
     * @return array<string, mixed>
     *
     * @throws GeminiApiException
     */
    public function chat(string $message, array $history, int $userId): array
    {
        $apiKey = $this->getApiKey($userId);
        $endpoint = "{$this->baseUrl}/models/gemini-pro:generateContent?key={$apiKey}";

        $contents = [];
        foreach ($history as $item) {
            $contents[] = ['role' => $item['role'], 'parts' => [['text' => $item['content']]]];
        }
        $contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

        try {
            $response = Http::post($endpoint, [
                'contents' => $contents,
            ]);

            if ($response->failed()) {
                Log::error('Gemini API Error', ['status' => $response->status(), 'body' => $response->body()]);
                throw new GeminiApiException('Falha na comunicação com a API do Gemini: ' . $response->body(), $response->status());
            }

            $responseData = $response->json();
            return $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'Não foi possível obter uma resposta.';
        } catch (\Exception $e) {
            throw new GeminiApiException('Erro ao chamar a API do Gemini: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Gera texto usando Gemini com prompt simples.
     *
     * @param string $prompt
     * @param string $model
     * @param int|null $userId
     *
     * @return string
     *
     * @throws GeminiApiException
     */
    public function generateText(string $prompt, string $model = 'gemini-pro', ?int $userId = null): string
    {
        // Usar API key padrão se userId não fornecido
        $apiKey = $userId ? $this->getApiKey($userId) : config('services.gemini.api_key');

        if (empty($apiKey)) {
            throw new GeminiApiException('Chave de API do Gemini não configurada.');
        }

        return $this->chat($prompt, [], $userId ?? 1);
    }

    /**
     * Gera vídeo usando Veo2 (Gemini AI Studio)
     *
     * @param string $prompt
     * @param array $options
     * @param int|null $userId
     * @return array
     * @throws GeminiApiException
     */
    public function generateVideo(string $prompt, array $options = [], ?int $userId = null): array
    {
        $apiKey = $userId ? $this->getApiKey($userId) : config('services.gemini.api_key');

        if (empty($apiKey)) {
            throw new GeminiApiException('Chave de API do Gemini não configurada.');
        }

        $endpoint = "{$this->baseUrl}/models/gemini-2.0-flash-exp:generateContent?key={$apiKey}";

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        [
                            'text' => "Gere um vídeo baseado no prompt: {$prompt}",
                            'video_generation' => [
                                'duration' => $options['duration'] ?? 10,
                                'quality' => $options['quality'] ?? 'hd',
                                'style' => $options['style'] ?? 'realistic',
                                'aspect_ratio' => $options['aspect_ratio'] ?? '16:9'
                            ]
                        ]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => $options['temperature'] ?? 0.7,
                'maxOutputTokens' => $options['max_tokens'] ?? 8192,
            ]
        ];

        try {
            $response = Http::timeout(300)->post($endpoint, $payload);

            if ($response->failed()) {
                Log::error('Gemini Veo2 API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new GeminiApiException('Falha na geração de vídeo: ' . $response->body(), $response->status());
            }

            $responseData = $response->json();
            return [
                'success' => true,
                'video_url' => $responseData['candidates'][0]['content']['parts'][0]['video_url'] ?? null,
                'job_id' => $responseData['job_id'] ?? null,
                'status' => 'generating'
            ];
        } catch (\Exception $e) {
            throw new GeminiApiException('Erro ao gerar vídeo com Veo2: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Gera imagem usando Gemini
     *
     * @param string $prompt
     * @param array $options
     * @param int|null $userId
     * @return array
     * @throws GeminiApiException
     */
    public function generateImage(string $prompt, array $options = [], ?int $userId = null): array
    {
        $apiKey = $userId ? $this->getApiKey($userId) : config('services.gemini.api_key');

        if (empty($apiKey)) {
            throw new GeminiApiException('Chave de API do Gemini não configurada.');
        }

        $endpoint = "{$this->baseUrl}/models/gemini-2.0-flash-exp:generateContent?key={$apiKey}";

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        [
                            'text' => "Gere uma imagem baseada no prompt: {$prompt}",
                            'image_generation' => [
                                'width' => $options['width'] ?? 1024,
                                'height' => $options['height'] ?? 1024,
                                'style' => $options['style'] ?? 'photographic',
                                'quality' => $options['quality'] ?? 'hd'
                            ]
                        ]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => $options['temperature'] ?? 0.7,
                'maxOutputTokens' => $options['max_tokens'] ?? 4096,
            ]
        ];

        try {
            $response = Http::timeout(120)->post($endpoint, $payload);

            if ($response->failed()) {
                Log::error('Gemini Image API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new GeminiApiException('Falha na geração de imagem: ' . $response->body(), $response->status());
            }

            $responseData = $response->json();
            return [
                'success' => true,
                'image_url' => $responseData['candidates'][0]['content']['parts'][0]['image_url'] ?? null,
                'job_id' => $responseData['job_id'] ?? null,
                'status' => 'completed'
            ];
        } catch (\Exception $e) {
            throw new GeminiApiException('Erro ao gerar imagem: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Análise de sentimento usando Gemini
     *
     * @param string $text
     * @param int|null $userId
     * @return array
     * @throws GeminiApiException
     */
    public function analyzeSentiment(string $text, ?int $userId = null): array
    {
        $prompt = "Analise o sentimento do seguinte texto e retorne apenas um JSON com as chaves: sentiment (positive, negative, neutral), confidence (0-1), emotions (array de emoções detectadas), summary (resumo em português). Texto: {$text}";

        try {
            $response = $this->generateText($prompt, 'gemini-1.5-pro', $userId);

            // Tentar extrair JSON da resposta
            if (preg_match('/\{.*\}/', $response, $matches)) {
                $result = json_decode($matches[0], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    return $result;
                }
            }

            // Fallback se não conseguir extrair JSON
            return [
                'sentiment' => 'neutral',
                'confidence' => 0.5,
                'emotions' => [],
                'summary' => $response
            ];
        } catch (\Exception $e) {
            throw new GeminiApiException('Erro na análise de sentimento: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Tradução de texto usando Gemini
     *
     * @param string $text
     * @param string $targetLanguage
     * @param string $sourceLanguage
     * @param int|null $userId
     * @return string
     * @throws GeminiApiException
     */
    public function translateText(string $text, string $targetLanguage = 'pt', string $sourceLanguage = 'auto', ?int $userId = null): string
    {
        $prompt = "Traduza o seguinte texto de {$sourceLanguage} para {$targetLanguage}. Mantenha o tom e contexto original. Texto: {$text}";

        return $this->generateText($prompt, 'gemini-1.5-pro', $userId);
    }

    /**
     * Resumo de texto usando Gemini
     *
     * @param string $text
     * @param int $maxLength
     * @param int|null $userId
     * @return string
     * @throws GeminiApiException
     */
    public function summarizeText(string $text, int $maxLength = 200, ?int $userId = null): string
    {
        $prompt = "Faça um resumo conciso do seguinte texto em no máximo {$maxLength} caracteres, mantendo os pontos principais. Texto: {$text}";

        return $this->generateText($prompt, 'gemini-1.5-pro', $userId);
    }

    /**
     * Verifica a conectividade com a API do Gemini.
     *
     * @param int $userId
     *
     * @return bool
     */
    public function canConnect(int $userId): bool
    {
        try {
            $apiKey = $this->getApiKey($userId);
            $endpoint = "{$this->baseUrl}/models/gemini-pro:generateContent?key={$apiKey}";
            $response = Http::post($endpoint, [
                'contents' => [['role' => 'user', 'parts' => [['text' => 'hello']]]],
            ]);
            return $response->successful();
        } catch (GeminiApiException $e) {
            return false;
        }
    }

    /**
     * Lista modelos disponíveis
     *
     * @param int|null $userId
     * @return array
     * @throws GeminiApiException
     */
    public function listModels(?int $userId = null): array
    {
        $apiKey = $userId ? $this->getApiKey($userId) : config('services.gemini.api_key');

        if (empty($apiKey)) {
            throw new GeminiApiException('Chave de API do Gemini não configurada.');
        }

        $endpoint = "{$this->baseUrl}/models?key={$apiKey}";

        try {
            $response = Http::get($endpoint);

            if ($response->failed()) {
                throw new GeminiApiException('Falha ao listar modelos: ' . $response->body(), $response->status());
            }

            $responseData = $response->json();
            return $responseData['models'] ?? [];
        } catch (\Exception $e) {
            throw new GeminiApiException('Erro ao listar modelos: ' . $e->getMessage(), $e->getCode(), $e);
        }
    }
}
