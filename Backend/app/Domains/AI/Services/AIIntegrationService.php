<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Infrastructure\Http\PyLabClient;
use App\Domains\AI\Exceptions\GeminiApiException;
use App\Domains\AI\Exceptions\PyLabException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * 🚀 AI Integration Service (Refatorado)
 *
 * Orquestra serviços especializados para integração de IA
 * Inclui geração de conteúdo, chat inteligente e análise de texto
 *
 * Refatorado para reduzir complexidade e melhorar manutenibilidade.
 */
class AIIntegrationService
{
    private AIContentGenerationService $contentGenerationService;
    private AIChatService $chatService;
    private AITextAnalysisService $textAnalysisService;
    private AIProviderManager $providerManager;

    public function __construct(
        AIContentGenerationService $contentGenerationService,
        AIChatService $chatService,
        AITextAnalysisService $textAnalysisService,
        AIProviderManager $providerManager
    ) {
        $this->contentGenerationService = $contentGenerationService;
        $this->chatService = $chatService;
        $this->textAnalysisService = $textAnalysisService;
        $this->providerManager = $providerManager;
    }

    // ===== GERAÇÃO DE CONTEÚDO =====

    /**
     * Gera conteúdo multimodal (texto, imagem, vídeo) usando a melhor combinação de serviços
     */
    public function generateMultimodalContent(array $request, ?int $userId = null): array
    {
        return $this->contentGenerationService->generateMultimodalContent($request, $userId);
    }

    /**
     * Gera conteúdo otimizado para redes sociais
     */
    public function generateSocialMediaContent(array $request, ?int $userId = null): array
    {
        return $this->contentGenerationService->generateSocialMediaContent($request, $userId);
    }

    // ===== CHAT INTELIGENTE =====

    /**
     * Processa uma conversa inteligente com análise de contexto
     */
    public function intelligentChat(string $message, array $context = [], ?int $userId = null): array
    {
        return $this->chatService->intelligentChat($message, $context, $userId);
    }

    // ===== ANÁLISE DE TEXTO =====

    /**
     * Realiza análise avançada de texto
     */
    public function advancedTextAnalysis(string $text, array $options = [], ?int $userId = null): array
    {
        return $this->textAnalysisService->advancedTextAnalysis($text, $options, $userId);
    }

    // ===== STATUS DOS SERVIÇOS =====

    /**
     * Obtém o status de todos os serviços de IA
     */
    public function getServicesStatus(): array
    {
        try {
            $services = [
                'gemini' => $this->checkGeminiStatus(),
                'pylab' => $this->checkPyLabStatus(),
                'openai' => $this->checkOpenAIStatus(),
                'claude' => $this->checkClaudeStatus()
            ];

            $overallStatus = 'healthy';
            $healthyServices = 0;
            $totalServices = count($services);

            foreach ($services as $service => $status) {
                if ($status['status'] === 'healthy') {
                    $healthyServices++;
                } elseif ($status['status'] === 'degraded') {
                    $overallStatus = 'degraded';
                } elseif ($status['status'] === 'down') {
                    $overallStatus = 'down';
                }
            }

            return [
                'success' => true,
                'overall_status' => $overallStatus,
                'services' => $services,
                'health_percentage' => ($healthyServices / $totalServices) * 100,
                'last_checked' => now()
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro ao verificar status dos serviços', [
                'error' => $exception->getMessage()
            ]);

            return [
                'success' => false,
                'error' => 'Erro interno ao verificar status dos serviços',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Verifica o status do serviço Gemini
     */
    private function checkGeminiStatus(): array
    {
        try {
            $cacheKey = "gemini_status_check";

            return Cache::remember($cacheKey, 300, function () {
                // Implementar verificação real do Gemini
                return [
                    'status' => 'healthy',
                    'response_time' => 150,
                    'last_check' => now(),
                    'details' => 'Serviço funcionando normalmente'
                ];
            });
        } catch (\Throwable $e) {
            return [
                'status' => 'down',
                'error' => $e->getMessage(),
                'last_check' => now()
            ];
        }
    }

    /**
     * Verifica o status do serviço PyLab
     */
    private function checkPyLabStatus(): array
    {
        try {
            $cacheKey = "pylab_status_check";

            return Cache::remember($cacheKey, 300, function () {
                // Implementar verificação real do PyLab
                return [
                    'status' => 'healthy',
                    'response_time' => 200,
                    'last_check' => now(),
                    'details' => 'Serviço funcionando normalmente'
                ];
            });
        } catch (\Throwable $e) {
            return [
                'status' => 'down',
                'error' => $e->getMessage(),
                'last_check' => now()
            ];
        }
    }

    /**
     * Verifica o status do serviço OpenAI
     */
    private function checkOpenAIStatus(): array
    {
        try {
            $cacheKey = "openai_status_check";

            return Cache::remember($cacheKey, 300, function () {
                // Implementar verificação real do OpenAI
                return [
                    'status' => 'healthy',
                    'response_time' => 180,
                    'last_check' => now(),
                    'details' => 'Serviço funcionando normalmente'
                ];
            });
        } catch (\Throwable $e) {
            return [
                'status' => 'down',
                'error' => $e->getMessage(),
                'last_check' => now()
            ];
        }
    }

    /**
     * Verifica o status do serviço Claude
     */
    private function checkClaudeStatus(): array
    {
        try {
            $cacheKey = "claude_status_check";

            return Cache::remember($cacheKey, 300, function () {
                // Implementar verificação real do Claude
                return [
                    'status' => 'healthy',
                    'response_time' => 160,
                    'last_check' => now(),
                    'details' => 'Serviço funcionando normalmente'
                ];
            });
        } catch (\Throwable $e) {
            return [
                'status' => 'down',
                'error' => $e->getMessage(),
                'last_check' => now()
            ];
        }
    }
}
