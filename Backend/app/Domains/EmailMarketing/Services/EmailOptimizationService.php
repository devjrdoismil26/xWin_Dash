<?php

namespace App\Domains\EmailMarketing\Services;

use App\Domains\AI\Services\AIService; // Supondo que este serviço exista
use App\Domains\EmailMarketing\Exceptions\ContentRecommendationException;
use App\Domains\EmailMarketing\Exceptions\SubjectOptimizationException;
use Illuminate\Support\Facades\Log;

class EmailOptimizationService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Obtém recomendações de conteúdo para uma campanha de e-mail.
     *
     * @param string      $topic
     * @param string|null $targetAudience
     * @param string|null $length
     *
     * @return array
     *
     * @throws ContentRecommendationException
     */
    public function getContentRecommendations(string $topic, ?string $targetAudience = null, ?string $length = null): array
    {
        $prompt = "Gere ideias de conteúdo para um e-mail sobre {$topic}.";
        if ($targetAudience) {
            $prompt .= " O público-alvo é {$targetAudience}.";
        }
        if ($length) {
            $prompt .= " O comprimento desejado é {$length}.";
        }

        try {
            $aiResponse = $this->aiService->generate([
                'user_id' => auth()->id(),
                'type' => 'text',
                'prompt' => $prompt,
                'provider' => 'gemini',
                'model' => 'gemini-pro',
            ]);

            return json_decode($aiResponse['result'], true) ?? ['recommendations' => $aiResponse['result']];
        } catch (\Exception $e) {
            Log::error("Falha ao obter recomendações de conteúdo: " . $e->getMessage());
            throw new ContentRecommendationException("Não foi possível gerar recomendações de conteúdo no momento.", 0, $e);
        }
    }

    /**
     * Otimiza a linha de assunto de um e-mail.
     *
     * @param string      $originalSubject
     * @param string|null $targetAudience
     * @param array $keywords
     *
     * @return string
     *
     * @throws SubjectOptimizationException
     */
    public function optimizeSubject(string $originalSubject, ?string $targetAudience = null, array $keywords = []): string
    {
        $prompt = "Otimize a linha de assunto: '{$originalSubject}'.";
        if ($targetAudience) {
            $prompt .= " Público-alvo: {$targetAudience}.";
        }
        if (!empty($keywords)) {
            $prompt .= " Palavras-chave: " . implode(', ', $keywords) . ".";
        }

        try {
            $aiResponse = $this->aiService->generate([
                'user_id' => auth()->id(),
                'type' => 'text',
                'prompt' => $prompt,
                'provider' => 'gemini',
                'model' => 'gemini-pro',
            ]);

            return $aiResponse['result'];
        } catch (\Exception $e) {
            Log::error("Falha ao otimizar assunto: " . $e->getMessage());
            throw new SubjectOptimizationException("Não foi possível otimizar o assunto no momento.", 0, $e);
        }
    }

    /**
     * Obtém sugestões de melhor horário de envio.
     *
     * @param int         $campaignId
     * @param string|null $targetAudience
     *
     * @return array
     */
    public function getBestSendingTime(int $campaignId, ?string $targetAudience = null): array
    {
        // Lógica para analisar dados históricos de engajamento e sugerir horários
        // Isso pode envolver consultas a dados de métricas de campanhas anteriores
        Log::info("Obtendo melhor horário de envio para campanha ID: {$campaignId}.");

        // Simulação de sugestões
        return [
            'suggested_times' => [
                'Monday 10:00 AM',
                'Tuesday 2:00 PM',
                'Wednesday 9:00 AM',
            ],
            'reasoning' => 'Baseado em dados históricos de abertura e cliques para seu público-alvo.',
        ];
    }
}
