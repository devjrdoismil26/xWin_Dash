<?php

namespace App\Domains\Universe\Services;

use App\Domains\AI\Infrastructure\Persistence\Eloquent\AIGenerationRepository;
use App\Domains\AI\Services\AIService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AILaboratoryService
{
    protected AIService $aiService;

    protected AIGenerationRepository $aiGenerationRepository;

    public function __construct(AIService $aiService, AIGenerationRepository $aiGenerationRepository)
    {
        $this->aiService = $aiService;
        $this->aiGenerationRepository = $aiGenerationRepository;
    }

    /**
     * Envia um prompt de teste para um serviço de IA e registra a interação.
     *
     * @param string      $serviceName o nome do serviço de IA (ex: 'gemini', 'openai')
     * @param string      $prompt      o prompt a ser enviado
     * @param string|null $model       o modelo de IA a ser usado (opcional)
     * @param array<string, mixed> $parameters  parâmetros adicionais para a requisição (opcional)
     *
     * @return array<string, mixed> a resposta do serviço de IA
     *
     * @throws \Exception se a requisição falhar
     */
    public function sendTestPrompt(string $serviceName, string $prompt, ?string $model = null, array $parameters = []): array
    {
        Log::info("Enviando prompt de teste para o serviço de IA: {$serviceName}.");

        try {
            // Usar o AIService real com método generate
            $response = $this->aiService->generate([
                'user_id' => Auth::id(),
                'provider' => $serviceName,
                'model' => $model ?? 'gpt-3.5-turbo',
                'prompt' => $prompt,
                'type' => 'text',
                'parameters' => $parameters
            ]);

            Log::info("Prompt de teste processado com sucesso pelo serviço de IA: {$serviceName}.");
            return [
                'status' => 'success',
                'generation_id' => $response['generation_id'],
                'message' => $response['message'],
                'service' => $serviceName,
                'model' => $model
            ];
        } catch (\Exception $e) {
            Log::error("Falha ao enviar prompt de teste para o serviço de IA {$serviceName}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Testa a conexão com um serviço de IA.
     *
     * @param string $serviceName o nome do serviço de IA
     *
     * @return array<string, mixed> o status da conexão
     */
    public function testAIServiceConnection(string $serviceName): array
    {
        Log::info("Testando conexão com o serviço de IA: {$serviceName}.");

        try {
            // Enviar prompt de teste simples para verificar conectividade
            $testResponse = $this->sendTestPrompt($serviceName, 'hello', null, ['test' => true]);

            Log::info("Conexão com {$serviceName} bem-sucedida.");
            return [
                'status' => 'success',
                'service' => $serviceName,
                'test_response' => $testResponse,
                'connected_at' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            Log::error("Falha na conexão com o serviço de IA {$serviceName}: " . $e->getMessage());
            return [
                'status' => 'failed',
                'service' => $serviceName,
                'error' => $e->getMessage(),
                'tested_at' => now()->toISOString()
            ];
        }
    }

    /**
     * Obtém o histórico de gerações de IA no laboratório para um usuário.
     *
     * @param int $userId  o ID do usuário
     * @param int $perPage número de itens por página
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getGenerationHistory(int $userId, int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return $this->aiGenerationRepository->getForUser($userId, $perPage);
    }

    /**
     * Analisa uma instância do Universe e retorna insights.
     */
    public function analyzeInstance(string $instanceId): array
    {
        $instance = \App\Domains\Universe\Models\UniverseInstance::with('blocks')->findOrFail($instanceId);
        
        $blocksCount = $instance->blocks->count();
        $blockTypes = $instance->blocks->pluck('block_type')->unique()->values()->toArray();
        
        return [
            'complexity_score' => min(100, $blocksCount * 5),
            'optimization_suggestions' => $this->generateOptimizationSuggestions($instance),
            'performance_predictions' => [
                'estimated_load_time' => $blocksCount * 0.1 . 's',
                'memory_usage' => $blocksCount * 2 . 'MB',
            ],
            'recommended_blocks' => $this->getRecommendedBlocks($blockTypes),
        ];
    }

    /**
     * Gera otimizações para uma instância.
     */
    public function generateOptimizations(string $instanceId): array
    {
        $analysis = $this->analyzeInstance($instanceId);
        
        return array_map(function($suggestion) {
            return [
                'type' => $suggestion['type'],
                'description' => $suggestion['description'],
                'impact' => $suggestion['impact'],
                'auto_apply' => false,
            ];
        }, $analysis['optimization_suggestions']);
    }

    /**
     * Personaliza instância para usuário (dispara job).
     */
    public function personalizeForUser(string $instanceId, int $userId): void
    {
        \App\Domains\Universe\Jobs\ProcessAIPersonalizationJob::dispatch($instanceId, $userId);
    }

    private function generateOptimizationSuggestions($instance): array
    {
        $suggestions = [];
        
        if ($instance->blocks->count() > 20) {
            $suggestions[] = [
                'type' => 'performance',
                'description' => 'Consider grouping related blocks',
                'impact' => 'high',
            ];
        }
        
        if (!$instance->canvas_state) {
            $suggestions[] = [
                'type' => 'usability',
                'description' => 'Save canvas state for better UX',
                'impact' => 'medium',
            ];
        }
        
        return $suggestions;
    }

    private function getRecommendedBlocks(array $currentTypes): array
    {
        $recommendations = [
            'chat' => ['workflow', 'ai'],
            'workflow' => ['chat', 'analytics'],
            'analytics' => ['dashboard', 'reports'],
        ];
        
        $recommended = [];
        foreach ($currentTypes as $type) {
            if (isset($recommendations[$type])) {
                $recommended = array_merge($recommended, $recommendations[$type]);
            }
        }
        
        return array_unique($recommended);
    }
}
