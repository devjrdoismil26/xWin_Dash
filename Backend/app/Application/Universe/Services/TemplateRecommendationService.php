<?php

namespace App\Application\Universe\Services;

use App\Domains\AI\Services\AIService; // Supondo que este serviço exista
use App\Models\User; // Supondo o model de usuário padrão do Laravel
use Illuminate\Support\Facades\Log;

class TemplateRecommendationService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Recomenda templates com base nas preferências do usuário e contexto.
     *
     * @param User   $user        o usuário para quem recomendar
     * @param string $context     o contexto da recomendação (ex: 'email_campaign', 'landing_page')
     * @param array  $preferences preferências adicionais do usuário ou dados de entrada
     *
     * @return array uma lista de IDs ou nomes de templates recomendados
     */
    public function recommendTemplates(User $user, string $context, array $preferences = []): array
    {
        Log::info("Recomendando templates para o usuário {$user->id} no contexto: {$context}");

        $prompt = "Recomende templates para {$context} para o usuário {$user->name}. Considere as seguintes preferências: " . json_encode($preferences);

        try {
            $aiRecommendation = $this->aiService->generate([
                'user_id' => $user->id,
                'type' => 'text',
                'prompt' => $prompt,
                'provider' => 'gemini',
                'model' => 'gemini-pro',
            ]);

            // Assumindo que a AI retorna uma lista de nomes/IDs de templates
            $recommendations = json_decode($aiRecommendation['result'], true); // Tentar decodificar JSON
            if (json_last_error() !== JSON_ERROR_NONE) {
                // Se não for JSON, tentar parsear como texto simples ou retornar vazio
                $recommendations = explode(',', $aiRecommendation['result']);
                $recommendations = array_map('trim', $recommendations);
            }

            return ['templates' => $recommendations];

        } catch (\Exception $e) {
            Log::error("Falha ao recomendar templates para o usuário {$user->id}: " . $e->getMessage());
            return ['templates' => []];
        }
    }
}
