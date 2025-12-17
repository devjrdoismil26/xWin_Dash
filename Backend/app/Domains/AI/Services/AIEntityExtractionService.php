<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\GeminiApiException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * 🏷️ AI Entity Extraction Service
 *
 * Serviço especializado para extração de entidades
 * Responsável por extrair entidades nomeadas de textos
 */
class AIEntityExtractionService
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Extrair entidades do texto
     */
    public function extractEntities(string $text, string $language = 'pt', ?int $userId = null): array
    {
        try {
            $cacheKey = 'entity_extraction_' . md5($text . $language);

            return Cache::remember($cacheKey, 3600, function () use ($text, $language, $userId) {
                return $this->performEntityExtraction($text, $language, $userId);
            });
        } catch (\Exception $e) {
            Log::error('Erro na extração de entidades: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Realizar extração de entidades
     */
    private function performEntityExtraction(string $text, string $language, ?int $userId): array
    {
        try {
            $prompt = $this->buildEntityExtractionPrompt($text, $language);
            $response = $this->geminiService->generateText($prompt, [
                'temperature' => 0.1,
                'max_tokens' => 1000
            ]);

            return $this->parseEntityResponse($response, $text);
        } catch (GeminiApiException $e) {
            Log::error('Erro na API Gemini para extração de entidades: ' . $e->getMessage());
            return $this->getFallbackEntityExtraction($text);
        }
    }

    /**
     * Construir prompt para extração de entidades
     */
    private function buildEntityExtractionPrompt(string $text, string $language): string
    {
        $languageMap = [
            'pt' => 'português',
            'en' => 'inglês',
            'es' => 'espanhol',
            'fr' => 'francês'
        ];

        $lang = $languageMap[$language] ?? 'português';

        return "Extraia entidades nomeadas do seguinte texto em {$lang} e retorne um JSON com:
        - persons: array de pessoas mencionadas
        - organizations: array de organizações mencionadas
        - locations: array de locais mencionados
        - dates: array de datas mencionadas
        - products: array de produtos mencionados
        - events: array de eventos mencionados
        - concepts: array de conceitos importantes
        
        Texto: {$text}";
    }

    /**
     * Parsear resposta de entidades
     */
    private function parseEntityResponse(string $response, string $text): array
    {
        try {
            $data = json_decode($response, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Resposta inválida do modelo');
            }

            return [
                'persons' => $data['persons'] ?? [],
                'organizations' => $data['organizations'] ?? [],
                'locations' => $data['locations'] ?? [],
                'dates' => $data['dates'] ?? [],
                'products' => $data['products'] ?? [],
                'events' => $data['events'] ?? [],
                'concepts' => $data['concepts'] ?? [],
                'text' => $text,
                'timestamp' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::warning('Erro ao parsear resposta de entidades: ' . $e->getMessage());
            return $this->getFallbackEntityExtraction($text);
        }
    }

    /**
     * Extração de entidades fallback
     */
    private function getFallbackEntityExtraction(string $text): array
    {
        // Extração básica baseada em padrões
        $persons = $this->extractPersonsBasic($text);
        $organizations = $this->extractOrganizationsBasic($text);
        $locations = $this->extractLocationsBasic($text);
        $dates = $this->extractDatesBasic($text);

        return [
            'persons' => $persons,
            'organizations' => $organizations,
            'locations' => $locations,
            'dates' => $dates,
            'products' => [],
            'events' => [],
            'concepts' => [],
            'text' => $text,
            'timestamp' => now()->toISOString(),
            'fallback' => true
        ];
    }

    /**
     * Extração básica de pessoas
     */
    private function extractPersonsBasic(string $text): array
    {
        // Padrões básicos para nomes próprios
        $patterns = [
            '/(?:Sr\.|Sra\.|Dr\.|Dra\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/',
            '/([A-Z][a-z]+\s+[A-Z][a-z]+)/'
        ];

        $persons = [];
        foreach ($patterns as $pattern) {
            preg_match_all($pattern, $text, $matches);
            if (!empty($matches[1])) {
                $persons = array_merge($persons, $matches[1]);
            }
        }

        return array_unique($persons);
    }

    /**
     * Extração básica de organizações
     */
    private function extractOrganizationsBasic(string $text): array
    {
        $patterns = [
            '/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Ltd|Inc|Corp|S\.A\.|LTDA|S\.A\.))/i',
            '/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Company|Corporation|Enterprise))/i'
        ];

        $organizations = [];
        foreach ($patterns as $pattern) {
            preg_match_all($pattern, $text, $matches);
            if (!empty($matches[1])) {
                $organizations = array_merge($organizations, $matches[1]);
            }
        }

        return array_unique($organizations);
    }

    /**
     * Extração básica de locais
     */
    private function extractLocationsBasic(string $text): array
    {
        $patterns = [
            '/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*(?:SP|RJ|MG|RS|PR|SC|BA|GO|PE|CE|PA|MA|AL|MT|MS|RO|TO|AC|AP|RR|AM|PB|RN|SE|DF))/',
            '/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*(?:Brasil|Brazil))/i'
        ];

        $locations = [];
        foreach ($patterns as $pattern) {
            preg_match_all($pattern, $text, $matches);
            if (!empty($matches[1])) {
                $locations = array_merge($locations, $matches[1]);
            }
        }

        return array_unique($locations);
    }

    /**
     * Extração básica de datas
     */
    private function extractDatesBasic(string $text): array
    {
        $patterns = [
            '/(\d{1,2}\/\d{1,2}\/\d{4})/',
            '/(\d{1,2}\s+de\s+\w+\s+de\s+\d{4})/i',
            '/(\d{4}-\d{2}-\d{2})/'
        ];

        $dates = [];
        foreach ($patterns as $pattern) {
            preg_match_all($pattern, $text, $matches);
            if (!empty($matches[1])) {
                $dates = array_merge($dates, $matches[1]);
            }
        }

        return array_unique($dates);
    }

    /**
     * Extrair entidades em lote
     */
    public function extractBatchEntities(array $texts, string $language = 'pt', ?int $userId = null): array
    {
        $results = [];

        foreach ($texts as $index => $text) {
            try {
                $results[$index] = $this->extractEntities($text, $language, $userId);
            } catch (\Exception $e) {
                Log::error("Erro na extração de entidades do texto {$index}: " . $e->getMessage());
                $results[$index] = [
                    'error' => $e->getMessage(),
                    'text' => $text
                ];
            }
        }

        return $results;
    }

    /**
     * Obter estatísticas de entidades
     */
    public function getEntityStats(array $entities): array
    {
        $total = count($entities);
        $totalPersons = 0;
        $totalOrganizations = 0;
        $totalLocations = 0;
        $totalDates = 0;

        foreach ($entities as $entity) {
            if (isset($entity['persons'])) {
                $totalPersons += count($entity['persons']);
            }
            if (isset($entity['organizations'])) {
                $totalOrganizations += count($entity['organizations']);
            }
            if (isset($entity['locations'])) {
                $totalLocations += count($entity['locations']);
            }
            if (isset($entity['dates'])) {
                $totalDates += count($entity['dates']);
            }
        }

        return [
            'total_texts' => $total,
            'total_persons' => $totalPersons,
            'total_organizations' => $totalOrganizations,
            'total_locations' => $totalLocations,
            'total_dates' => $totalDates,
            'average_persons_per_text' => $total > 0 ? round($totalPersons / $total, 2) : 0,
            'average_organizations_per_text' => $total > 0 ? round($totalOrganizations / $total, 2) : 0,
            'average_locations_per_text' => $total > 0 ? round($totalLocations / $total, 2) : 0,
            'average_dates_per_text' => $total > 0 ? round($totalDates / $total, 2) : 0
        ];
    }
}
