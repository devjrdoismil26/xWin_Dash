<?php

namespace App\Domains\Universe\Services;

use App\Domains\AI\Services\AIService;
use App\Domains\Products\Services\LandingPageService;
use App\Domains\Products\Models\LandingPage;
use Illuminate\Support\Facades\Log;

class LandingPageAIAutomationService
{
    protected AIService $aiService;

    protected LandingPageService $landingPageService;

    public function __construct(AIService $aiService, LandingPageService $landingPageService)
    {
        $this->aiService = $aiService;
        $this->landingPageService = $landingPageService;
    }

    /**
     * Gera conteúdo para uma landing page usando IA.
     *
     * @param int    $landingPageId o ID da landing page
     * @param string $prompt        o prompt para a geração de conteúdo
     * @param array<string, mixed> $options opções adicionais para a geração (ex: tom, estilo)
     *
     * @return string o conteúdo gerado pela IA
     *
     * @throws \Exception se a geração falhar
     */
    public function generateContentForLandingPage(int $landingPageId, string $prompt, array $options = []): string
    {
        Log::info("Gerando conteúdo com IA para landing page ID: {$landingPageId}. Prompt: {$prompt}");

        try {
            // Gerar conteúdo usando IA
            $generatedContent = $this->aiService->generateText($prompt, 'gemini-pro', 'gemini');

            // Buscar a landing page e atualizar com o novo conteúdo
            $landingPage = LandingPage::findOrFail($landingPageId);
            $this->landingPageService->updateLandingPage($landingPage, ['content' => $generatedContent]);

            Log::info("Conteúdo gerado e atualizado com sucesso para landing page ID: {$landingPageId}.");
            return $generatedContent;
        } catch (\Exception $e) {
            Log::error("Falha ao gerar conteúdo para landing page ID: {$landingPageId} com IA: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Otimiza uma landing page para conversão usando IA.
     *
     * @param int   $landingPageId     o ID da landing page
     * @param array<string> $optimizationGoals os objetivos da otimização (ex: 'aumentar_leads', 'reduzir_bounce')
     *
     * @return array<string, mixed> o resultado da otimização
     *
     * @throws \Exception se a otimização falhar
     */
    public function optimizeLandingPageForConversion(int $landingPageId, array $optimizationGoals): array
    {
        Log::info("Otimizando landing page ID: {$landingPageId} para conversão com IA. Objetivos: " . json_encode($optimizationGoals));

        try {
            $landingPage = LandingPage::findOrFail($landingPageId);

            $prompt = "Sugira otimizações para a landing page '{$landingPage->name}' com o conteúdo: {$landingPage->content}. Objetivos: " . implode(", ", $optimizationGoals) . ".";
            $aiResponse = $this->aiService->generateText($prompt, 'gemini-pro', 'gemini');

            Log::info("Otimização de landing page com IA concluída para ID: {$landingPageId}.");
            return [
                'status' => 'success',
                'suggestions' => $aiResponse,
                'original_landing_page_id' => $landingPageId,
            ];
        } catch (\Exception $e) {
            Log::error("Falha ao otimizar landing page ID: {$landingPageId} com IA: " . $e->getMessage());
            throw $e;
        }
    }
}
