<?php

namespace App\Application\Universe\Services;

use App\Domains\AI\Services\AIService; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class IndustryInsightsService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Gera insights de indústria com base em um tópico ou dados fornecidos.
     *
     * @param string $topic o tópico da indústria para gerar insights
     * @param array  $data  dados adicionais para a análise
     *
     * @return array os insights gerados
     */
    public function generateInsights(string $topic, array $data = []): array
    {
        Log::info("Gerando insights de indústria para o tópico: {$topic}");

        $prompt = "Gere insights de indústria detalhados sobre o tópico: {$topic}. Considere os seguintes dados: " . json_encode($data);

        try {
            $aiInsights = $this->aiService->generate([
                'user_id' => auth()->id(), // Ou um ID de usuário de sistema
                'type' => 'text',
                'prompt' => $prompt,
                'provider' => 'gemini',
                'model' => 'gemini-pro',
            ]);

            return ['insights' => $aiInsights['result']];

        } catch (\Exception $e) {
            Log::error("Falha ao gerar insights de indústria para o tópico {$topic}: " . $e->getMessage());
            return ['insights' => 'Não foi possível gerar insights no momento.'];
        }
    }
}
