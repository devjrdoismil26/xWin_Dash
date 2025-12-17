<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\GeminiApiException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * 📝 AI Text Analysis Service
 *
 * Serviço principal para análise de texto
 * Orquestra os serviços especializados de sentimento e entidades
 */
class AITextAnalysisService
{
    protected AISentimentAnalysisService $sentimentService;
    protected AIEntityExtractionService $entityService;
    protected GeminiService $geminiService;

    public function __construct(
        AISentimentAnalysisService $sentimentService,
        AIEntityExtractionService $entityService,
        GeminiService $geminiService
    ) {
        $this->sentimentService = $sentimentService;
        $this->entityService = $entityService;
        $this->geminiService = $geminiService;
    }

    /**
     * Realiza análise avançada de texto
     */
    public function advancedTextAnalysis(string $text, array $options = [], ?int $userId = null): array
    {
        try {
            $analysisType = $options['analysis_type'] ?? 'comprehensive';
            $language = $options['language'] ?? 'pt';
            $includeSentiment = $options['include_sentiment'] ?? true;
            $includeEntities = $options['include_entities'] ?? true;
            $includeKeywords = $options['include_keywords'] ?? true;
            $includeSummary = $options['include_summary'] ?? true;
            $includeInsights = $options['include_insights'] ?? true;

            $results = [];

            // 1. Análise de sentimento
            if ($includeSentiment) {
                $results['sentiment'] = $this->sentimentService->analyzeSentiment($text, $language, $userId);
            }

            // 2. Extração de entidades
            if ($includeEntities) {
                $results['entities'] = $this->entityService->extractEntities($text, $language, $userId);
            }

            // 3. Extração de palavras-chave
            if ($includeKeywords) {
                $results['keywords'] = $this->extractKeywords($text, $language, $userId);
            }

            // 4. Geração de resumo
            if ($includeSummary) {
                $results['summary'] = $this->generateSummary($text, $language, $userId);
            }

            // 5. Geração de insights
            if ($includeInsights) {
                $results['insights'] = $this->generateInsights($text, $language, $userId);
            }

            // 6. Análise de qualidade
            $results['quality'] = $this->assessTextQuality($text);

            // 7. Análise de legibilidade
            $results['readability'] = $this->assessReadability($text, $language);

            $results['analysis_type'] = $analysisType;
            $results['language'] = $language;
            $results['timestamp'] = now()->toISOString();

            return $results;
        } catch (\Exception $e) {
            Log::error('Erro na análise avançada de texto: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Analisar sentimento do texto
     */
    public function analyzeSentiment(string $text, string $language = 'pt', ?int $userId = null): array
    {
        return $this->sentimentService->analyzeSentiment($text, $language, $userId);
    }

    /**
     * Extrair entidades do texto
     */
    public function extractEntities(string $text, string $language = 'pt', ?int $userId = null): array
    {
        return $this->entityService->extractEntities($text, $language, $userId);
    }

    /**
     * Extrair palavras-chave do texto
     */
    public function extractKeywords(string $text, string $language = 'pt', ?int $userId = null): array
    {
        try {
            $cacheKey = 'keywords_extraction_' . md5($text . $language);

            return Cache::remember($cacheKey, 3600, function () use ($text, $language, $userId) {
                return $this->performKeywordExtraction($text, $language, $userId);
            });
        } catch (\Exception $e) {
            Log::error('Erro na extração de palavras-chave: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Realizar extração de palavras-chave
     */
    private function performKeywordExtraction(string $text, string $language, ?int $userId): array
    {
        try {
            $prompt = $this->buildKeywordExtractionPrompt($text, $language);
            $response = $this->geminiService->generateText($prompt, [
                'temperature' => 0.1,
                'max_tokens' => 500
            ]);

            return $this->parseKeywordResponse($response, $text);
        } catch (GeminiApiException $e) {
            Log::error('Erro na API Gemini para extração de palavras-chave: ' . $e->getMessage());
            return $this->getFallbackKeywordExtraction($text);
        }
    }

    /**
     * Construir prompt para extração de palavras-chave
     */
    private function buildKeywordExtractionPrompt(string $text, string $language): string
    {
        $languageMap = [
            'pt' => 'português',
            'en' => 'inglês',
            'es' => 'espanhol',
            'fr' => 'francês'
        ];

        $lang = $languageMap[$language] ?? 'português';

        return "Extraia as 10 palavras-chave mais importantes do seguinte texto em {$lang} e retorne um JSON com:
        - keywords: array de palavras-chave com relevância
        - categories: array de categorias temáticas
        - topics: array de tópicos principais
        
        Texto: {$text}";
    }

    /**
     * Parsear resposta de palavras-chave
     */
    private function parseKeywordResponse(string $response, string $text): array
    {
        try {
            $data = json_decode($response, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Resposta inválida do modelo');
            }

            return [
                'keywords' => $data['keywords'] ?? [],
                'categories' => $data['categories'] ?? [],
                'topics' => $data['topics'] ?? [],
                'text' => $text,
                'timestamp' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::warning('Erro ao parsear resposta de palavras-chave: ' . $e->getMessage());
            return $this->getFallbackKeywordExtraction($text);
        }
    }

    /**
     * Extração de palavras-chave fallback
     */
    private function getFallbackKeywordExtraction(string $text): array
    {
        // Extração básica baseada em frequência
        $words = str_word_count(strtolower($text), 1);
        $stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'sem', 'sobre', 'entre', 'até', 'desde', 'durante', 'mediante', 'conforme', 'segundo', 'consoante', 'que', 'quando', 'onde', 'como', 'porque', 'se', 'mas', 'porém', 'contudo', 'todavia', 'entretanto', 'logo', 'portanto', 'assim', 'então', 'aqui', 'ali', 'lá', 'aí', 'agora', 'hoje', 'ontem', 'amanhã', 'sempre', 'nunca', 'jamais', 'também', 'ainda', 'já', 'só', 'apenas', 'muito', 'pouco', 'mais', 'menos', 'bem', 'mal', 'melhor', 'pior', 'grande', 'pequeno', 'novo', 'velho', 'bom', 'ruim', 'certo', 'errado', 'verdadeiro', 'falso', 'sim', 'não', 'talvez', 'pode', 'deve', 'precisa', 'quer', 'gosta', 'ama', 'odeia', 'tem', 'tem', 'é', 'são', 'foi', 'foram', 'será', 'serão', 'está', 'estão', 'estava', 'estavam', 'estará', 'estarão', 'ter', 'ser', 'estar', 'fazer', 'dizer', 'ir', 'vir', 'ver', 'saber', 'poder', 'querer', 'gostar', 'amar', 'odiar', 'precisar', 'dever', 'poder', 'querer', 'gostar', 'amar', 'odiar', 'precisar', 'dever'];

        $filteredWords = array_filter($words, function ($word) use ($stopWords) {
            return !in_array($word, $stopWords) && strlen($word) > 3;
        });

        $wordCount = array_count_values($filteredWords);
        arsort($wordCount);

        $keywords = array_slice(array_keys($wordCount), 0, 10);

        return [
            'keywords' => $keywords,
            'categories' => [],
            'topics' => [],
            'text' => $text,
            'timestamp' => now()->toISOString(),
            'fallback' => true
        ];
    }

    /**
     * Gerar resumo do texto
     */
    public function generateSummary(string $text, string $language = 'pt', ?int $userId = null): array
    {
        try {
            $cacheKey = 'text_summary_' . md5($text . $language);

            return Cache::remember($cacheKey, 3600, function () use ($text, $language, $userId) {
                return $this->performSummaryGeneration($text, $language, $userId);
            });
        } catch (\Exception $e) {
            Log::error('Erro na geração de resumo: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Realizar geração de resumo
     */
    private function performSummaryGeneration(string $text, string $language, ?int $userId): array
    {
        try {
            $prompt = $this->buildSummaryPrompt($text, $language);
            $response = $this->geminiService->generateText($prompt, [
                'temperature' => 0.3,
                'max_tokens' => 300
            ]);

            return [
                'summary' => $response,
                'text' => $text,
                'timestamp' => now()->toISOString()
            ];
        } catch (GeminiApiException $e) {
            Log::error('Erro na API Gemini para geração de resumo: ' . $e->getMessage());
            return $this->getFallbackSummary($text);
        }
    }

    /**
     * Construir prompt para geração de resumo
     */
    private function buildSummaryPrompt(string $text, string $language): string
    {
        $languageMap = [
            'pt' => 'português',
            'en' => 'inglês',
            'es' => 'espanhol',
            'fr' => 'francês'
        ];

        $lang = $languageMap[$language] ?? 'português';

        return "Gere um resumo conciso do seguinte texto em {$lang}, destacando os pontos principais:
        
        Texto: {$text}";
    }

    /**
     * Resumo fallback
     */
    private function getFallbackSummary(string $text): array
    {
        $sentences = preg_split('/[.!?]+/', $text);
        $sentences = array_filter($sentences, function ($s) {
            return trim($s) !== '';
        });

        $summary = '';
        if (count($sentences) > 0) {
            $summary = trim($sentences[0]);
            if (count($sentences) > 1) {
                $summary .= ' ' . trim($sentences[1]);
            }
        }

        return [
            'summary' => $summary,
            'text' => $text,
            'timestamp' => now()->toISOString(),
            'fallback' => true
        ];
    }

    /**
     * Gerar insights do texto
     */
    public function generateInsights(string $text, string $language = 'pt', ?int $userId = null): array
    {
        try {
            $cacheKey = 'text_insights_' . md5($text . $language);

            return Cache::remember($cacheKey, 3600, function () use ($text, $language, $userId) {
                return $this->performInsightGeneration($text, $language, $userId);
            });
        } catch (\Exception $e) {
            Log::error('Erro na geração de insights: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Realizar geração de insights
     */
    private function performInsightGeneration(string $text, string $language, ?int $userId): array
    {
        try {
            $prompt = $this->buildInsightPrompt($text, $language);
            $response = $this->geminiService->generateText($prompt, [
                'temperature' => 0.4,
                'max_tokens' => 500
            ]);

            return [
                'insights' => $response,
                'text' => $text,
                'timestamp' => now()->toISOString()
            ];
        } catch (GeminiApiException $e) {
            Log::error('Erro na API Gemini para geração de insights: ' . $e->getMessage());
            return $this->getFallbackInsights($text);
        }
    }

    /**
     * Construir prompt para geração de insights
     */
    private function buildInsightPrompt(string $text, string $language): string
    {
        $languageMap = [
            'pt' => 'português',
            'en' => 'inglês',
            'es' => 'espanhol',
            'fr' => 'francês'
        ];

        $lang = $languageMap[$language] ?? 'português';

        return "Analise o seguinte texto em {$lang} e gere insights sobre:
        - Tema principal
        - Tom e estilo
        - Público-alvo
        - Pontos fortes e fracos
        - Sugestões de melhoria
        
        Texto: {$text}";
    }

    /**
     * Insights fallback
     */
    private function getFallbackInsights(string $text): array
    {
        $wordCount = str_word_count($text);
        $sentenceCount = count(preg_split('/[.!?]+/', $text));
        $avgWordsPerSentence = $sentenceCount > 0 ? round($wordCount / $sentenceCount, 2) : 0;

        return [
            'insights' => "Texto com {$wordCount} palavras e {$sentenceCount} frases. Média de {$avgWordsPerSentence} palavras por frase.",
            'text' => $text,
            'timestamp' => now()->toISOString(),
            'fallback' => true
        ];
    }

    /**
     * Avaliar qualidade do texto
     */
    public function assessTextQuality(string $text): array
    {
        $wordCount = str_word_count($text);
        $sentenceCount = count(preg_split('/[.!?]+/', $text));
        $avgWordsPerSentence = $sentenceCount > 0 ? round($wordCount / $sentenceCount, 2) : 0;

        $quality = 'good';
        if ($avgWordsPerSentence < 10) {
            $quality = 'poor';
        } elseif ($avgWordsPerSentence > 25) {
            $quality = 'fair';
        }

        return [
            'quality' => $quality,
            'word_count' => $wordCount,
            'sentence_count' => $sentenceCount,
            'avg_words_per_sentence' => $avgWordsPerSentence,
            'timestamp' => now()->toISOString()
        ];
    }

    /**
     * Avaliar legibilidade do texto
     */
    public function assessReadability(string $text, string $language = 'pt'): array
    {
        $syllables = $this->estimateSyllables($text);
        $words = str_word_count($text);
        $sentences = count(preg_split('/[.!?]+/', $text));

        $avgSyllablesPerWord = $words > 0 ? round($syllables / $words, 2) : 0;
        $avgWordsPerSentence = $sentences > 0 ? round($words / $sentences, 2) : 0;

        $readability = 'medium';
        if ($avgSyllablesPerWord < 2 && $avgWordsPerSentence < 15) {
            $readability = 'easy';
        } elseif ($avgSyllablesPerWord > 3 || $avgWordsPerSentence > 25) {
            $readability = 'difficult';
        }

        return [
            'readability' => $readability,
            'syllables' => $syllables,
            'avg_syllables_per_word' => $avgSyllablesPerWord,
            'avg_words_per_sentence' => $avgWordsPerSentence,
            'timestamp' => now()->toISOString()
        ];
    }

    /**
     * Estimar número de sílabas
     */
    private function estimateSyllables(string $text): int
    {
        $words = str_word_count($text, 1);
        $totalSyllables = 0;

        foreach ($words as $word) {
            $totalSyllables += $this->countSyllables($word);
        }

        return $totalSyllables;
    }

    /**
     * Contar sílabas de uma palavra
     */
    private function countSyllables(string $word): int
    {
        $word = strtolower($word);
        $vowels = 'aeiouáéíóúàèìòùâêîôûãõ';
        $syllables = 0;
        $prevChar = '';

        for ($i = 0; $i < strlen($word); $i++) {
            $char = $word[$i];
            if (strpos($vowels, $char) !== false) {
                if ($prevChar === '' || strpos($vowels, $prevChar) === false) {
                    $syllables++;
                }
            }
            $prevChar = $char;
        }

        return max(1, $syllables);
    }
}
