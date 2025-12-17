<?php

namespace App\Application\Universe\Services;

use App\Domains\AI\Services\AIService; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class PredictiveAIService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Realiza uma previsão com base nos dados fornecidos.
     *
     * @param string $predictionType o tipo de previsão (ex: 'sales_forecast', 'churn_risk')
     * @param array  $inputData      os dados de entrada para a previsão
     * @param int    $userId         o ID do usuário que solicita a previsão
     *
     * @return array o resultado da previsão
     */
    public function predict(string $predictionType, array $inputData, int $userId): array
    {
        Log::info("Realizando previsão de tipo: {$predictionType} para o usuário {$userId}.");

        // Construir o prompt para a AI com base no tipo de previsão e dados de entrada
        $prompt = "Preveja {$predictionType} com base nos seguintes dados: " . json_encode($inputData);

        try {
            $aiPrediction = $this->aiService->generate([
                'user_id' => $userId,
                'type' => 'text',
                'prompt' => $prompt,
                'provider' => 'gemini',
                'model' => 'gemini-pro',
            ]);

            return ['prediction' => $aiPrediction['result']];

        } catch (\Exception $e) {
            Log::error("Falha na previsão de AI para o tipo {$predictionType}: " . $e->getMessage());
            return ['prediction' => 'Não foi possível gerar a previsão no momento.'];
        }
    }
}
