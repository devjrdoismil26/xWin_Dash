<?php

namespace App\Domains\Universe\Services;

use App\Domains\AI\Services\AIService;
use App\Domains\Universe\ValueObjects\EnhancedPrompt; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

// Supondo que este Value Object exista

class PromptEnhancementService
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Aprimora um prompt de IA usando técnicas de processamento de linguagem natural ou IA.
     *
     * @param string $originalPrompt o prompt original
     * @param array<string, mixed> $context contexto adicional para o aprimoramento (ex: persona, objetivo)
     *
     * @return EnhancedPrompt o prompt aprimorado
     *
     * @throws \Exception se o aprimoramento falhar
     */
    public function enhancePrompt(string $originalPrompt, array $context = []): EnhancedPrompt
    {
        Log::info("Aprimorando prompt: {$originalPrompt}");

        try {
            // Exemplo de lógica de aprimoramento:
            // 1. Adicionar instruções de persona/tom
            $enhancedPromptText = $originalPrompt;
            if (isset($context['persona'])) {
                $enhancedPromptText = "Atue como um(a) {$context['persona']}. " . $enhancedPromptText;
            }
            if (isset($context['tone'])) {
                $enhancedPromptText .= " O tom deve ser {$context['tone']}.";
            }

            // 2. Usar IA para expandir ou refinar o prompt
            $aiRefinementPrompt = "Refine o seguinte prompt para um modelo de IA, tornando-o mais claro e eficaz: \"{$enhancedPromptText}\"";

            $aiResponse = $this->aiService->generate([
                'user_id' => 1, // Default user for system operations
                'provider' => 'gemini',
                'model' => 'gemini-pro',
                'prompt' => $aiRefinementPrompt,
                'type' => 'text',
                'parameters' => []
            ]);

            // Como o generate retorna um job ID, usar generateText para resposta síncrona
            $finalPrompt = $this->aiService->generateText($aiRefinementPrompt, 'gemini-pro');

            Log::info("Prompt aprimorado com sucesso.");
            return new EnhancedPrompt($originalPrompt, $finalPrompt, $context);
        } catch (\Exception $e) {
            Log::error("Falha ao aprimorar prompt: " . $e->getMessage());
            throw $e;
        }
    }
}
