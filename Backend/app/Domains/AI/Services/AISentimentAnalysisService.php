<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\GeminiApiException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * 🎭 AI Sentiment Analysis Service
 *
 * Serviço especializado para análise de sentimento
 * Responsável por analisar sentimentos em textos
 */
class AISentimentAnalysisService
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Analisar sentimento do texto
     */
    public function analyzeSentiment(string $text, string $language = 'pt', ?int $userId = null): array
    {
        try {
            $cacheKey = 'sentiment_analysis_' . md5($text . $language);

            return Cache::remember($cacheKey, 3600, function () use ($text, $language, $userId) {
                return $this->performSentimentAnalysis($text, $language, $userId);
            });
        } catch (\Exception $e) {
            Log::error('Erro na análise de sentimento: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Realizar análise de sentimento
     */
    private function performSentimentAnalysis(string $text, string $language, ?int $userId): array
    {
        try {
            $prompt = $this->buildSentimentPrompt($text, $language);
            $response = $this->geminiService->generateText($prompt, [
                'temperature' => 0.1,
                'max_tokens' => 500
            ]);

            return $this->parseSentimentResponse($response, $text);
        } catch (GeminiApiException $e) {
            Log::error('Erro na API Gemini para análise de sentimento: ' . $e->getMessage());
            return $this->getFallbackSentimentAnalysis($text);
        }
    }

    /**
     * Construir prompt para análise de sentimento
     */
    private function buildSentimentPrompt(string $text, string $language): string
    {
        $languageMap = [
            'pt' => 'português',
            'en' => 'inglês',
            'es' => 'espanhol',
            'fr' => 'francês'
        ];

        $lang = $languageMap[$language] ?? 'português';

        return "Analise o sentimento do seguinte texto em {$lang} e retorne um JSON com:
        - sentiment: 'positive', 'negative' ou 'neutral'
        - confidence: número de 0 a 1
        - emotions: array com emoções detectadas
        - intensity: 'low', 'medium' ou 'high'
        
        Texto: {$text}";
    }

    /**
     * Parsear resposta de sentimento
     */
    private function parseSentimentResponse(string $response, string $text): array
    {
        try {
            $data = json_decode($response, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Resposta inválida do modelo');
            }

            return [
                'sentiment' => $data['sentiment'] ?? 'neutral',
                'confidence' => floatval($data['confidence'] ?? 0.5),
                'emotions' => $data['emotions'] ?? [],
                'intensity' => $data['intensity'] ?? 'medium',
                'text' => $text,
                'timestamp' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::warning('Erro ao parsear resposta de sentimento: ' . $e->getMessage());
            return $this->getFallbackSentimentAnalysis($text);
        }
    }

    /**
     * Análise de sentimento fallback
     */
    private function getFallbackSentimentAnalysis(string $text): array
    {
        // Análise básica baseada em palavras-chave
        $positiveWords = ['bom', 'ótimo', 'excelente', 'maravilhoso', 'perfeito', 'incrível'];
        $negativeWords = ['ruim', 'terrível', 'horrível', 'péssimo', 'decepcionante', 'frustrante'];

        $textLower = strtolower($text);
        $positiveCount = 0;
        $negativeCount = 0;

        foreach ($positiveWords as $word) {
            $positiveCount += substr_count($textLower, $word);
        }

        foreach ($negativeWords as $word) {
            $negativeCount += substr_count($textLower, $word);
        }

        if ($positiveCount > $negativeCount) {
            $sentiment = 'positive';
            $confidence = min(0.8, 0.5 + ($positiveCount * 0.1));
        } elseif ($negativeCount > $positiveCount) {
            $sentiment = 'negative';
            $confidence = min(0.8, 0.5 + ($negativeCount * 0.1));
        } else {
            $sentiment = 'neutral';
            $confidence = 0.5;
        }

        return [
            'sentiment' => $sentiment,
            'confidence' => $confidence,
            'emotions' => [],
            'intensity' => 'medium',
            'text' => $text,
            'timestamp' => now()->toISOString(),
            'fallback' => true
        ];
    }

    /**
     * Analisar sentimento em lote
     */
    public function analyzeBatchSentiment(array $texts, string $language = 'pt', ?int $userId = null): array
    {
        $results = [];

        foreach ($texts as $index => $text) {
            try {
                $results[$index] = $this->analyzeSentiment($text, $language, $userId);
            } catch (\Exception $e) {
                Log::error("Erro na análise de sentimento do texto {$index}: " . $e->getMessage());
                $results[$index] = [
                    'error' => $e->getMessage(),
                    'text' => $text
                ];
            }
        }

        return $results;
    }

    /**
     * Obter estatísticas de sentimento
     */
    public function getSentimentStats(array $sentiments): array
    {
        $total = count($sentiments);
        $positive = 0;
        $negative = 0;
        $neutral = 0;
        $totalConfidence = 0;

        foreach ($sentiments as $sentiment) {
            if (isset($sentiment['sentiment'])) {
                switch ($sentiment['sentiment']) {
                    case 'positive':
                        $positive++;
                        break;
                    case 'negative':
                        $negative++;
                        break;
                    case 'neutral':
                        $neutral++;
                        break;
                }

                if (isset($sentiment['confidence'])) {
                    $totalConfidence += $sentiment['confidence'];
                }
            }
        }

        return [
            'total' => $total,
            'positive' => $positive,
            'negative' => $negative,
            'neutral' => $neutral,
            'positive_percentage' => $total > 0 ? round(($positive / $total) * 100, 2) : 0,
            'negative_percentage' => $total > 0 ? round(($negative / $total) * 100, 2) : 0,
            'neutral_percentage' => $total > 0 ? round(($neutral / $total) * 100, 2) : 0,
            'average_confidence' => $total > 0 ? round($totalConfidence / $total, 3) : 0
        ];
    }
}
