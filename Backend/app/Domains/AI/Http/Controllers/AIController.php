<?php

namespace App\Domains\AI\Http\Controllers;

use App\Domains\AI\Http\Requests\GenerateRequest;
use App\Domains\AI\Http\Requests\GenerateTextRequest;
use App\Domains\AI\Http\Requests\GenerateImageRequest;
use App\Domains\AI\Http\Requests\ChatRequest;
use App\Domains\AI\Services\AIService;
use App\Domains\AI\Services\GeminiService;
use App\Domains\AI\Services\AIIntegrationService;
use App\Domains\AI\Infrastructure\Persistence\Eloquent\AIGenerationModel;
use App\Domains\Integrations\Infrastructure\Persistence\Eloquent\ApiCredentialModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

/**
 * AIController
 * 
 * SECURITY FIX (AUTH-003): Adicionado suporte a multi-tenancy via project_id
 */
class AIController extends Controller
{
    protected AIService $aiService;
    protected GeminiService $geminiService;
    protected AIIntegrationService $integrationService;

    public function __construct(
        AIService $aiService,
        GeminiService $geminiService,
        AIIntegrationService $integrationService
    ) {
        $this->aiService = $aiService;
        $this->geminiService = $geminiService;
        $this->integrationService = $integrationService;
    }

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * AUTH-PENDENTE-017: Adicionada autorização
     */
    public function generate(GenerateRequest $request): \Illuminate\Http\JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            // SECURITY: Adicionar project_id ao contexto
            $data = array_merge($request->validated(), [
                'project_id' => $this->getProjectId(),
                'user_id' => Auth::id(),
            ]);
            
            $result = $this->aiService->generate($data);
            return Response::json(['data' => $result]);
        } catch (\Exception $e) {
            return Response::json(['error' => $e->getMessage()], 500);
        }
    }



    /**
     * IMPL-005: Implementação real de validação de API key
     * AUTH-013: Adicionada autorização
     */
    public function validateApiKey(Request $request): \Illuminate\Http\JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        $request->validate([
            'provider' => 'required|string|in:openai,gemini,claude',
            'api_key' => 'required|string',
        ]);

        try {
            $projectId = $this->getProjectId();
            $userId = Auth::id();

            // SECURITY: Buscar credencial do usuário/projeto
            $credential = ApiCredentialModel::where('user_id', $userId)
                ->where('provider', $request->provider)
                ->where('is_active', true)
                ->first();

            if (!$credential) {
                return Response::json([
                    'success' => false,
                    'error' => 'API key not found for this provider'
                ], 404);
            }

            // Validar se a chave fornecida corresponde à armazenada
            $isValid = hash_equals($credential->api_key ?? '', $request->api_key);

            if (!$isValid) {
                return Response::json([
                    'success' => false,
                    'error' => 'Invalid API key'
                ], 401);
            }

            // Testar conexão com o provider (opcional - pode ser assíncrono)
            $testResult = $this->aiService->testConnection($request->provider, $request->api_key);

            return Response::json([
                'success' => true,
                'valid' => true,
                'provider' => $request->provider,
                'connection_test' => $testResult['success'] ?? false,
                'message' => 'API key is valid'
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * IMPL-005: Implementação real de histórico
     * AUTH-013: Adicionada autorização
     */
    public function getHistory(Request $request): \Illuminate\Http\JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', AIGeneration::class);
        
        $projectId = $this->getProjectId();
        $userId = Auth::id();

        // SECURITY: Buscar histórico do usuário filtrado por projeto
        $query = AIGenerationModel::where('user_id', $userId);
        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        // Filtros opcionais
        if ($request->provider) {
            $query->where('provider', $request->provider);
        }
        if ($request->model) {
            $query->where('model', $request->model);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->date_from) {
            $query->where('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $history = $query->orderByDesc('created_at')
            ->paginate($request->per_page ?? 20)
            ->map(function($generation) {
                return [
                    'id' => $generation->id,
                    'provider' => $generation->provider,
                    'model' => $generation->model,
                    'prompt' => substr($generation->prompt, 0, 100) . '...',
                    'status' => $generation->status,
                    'usage_meta' => $generation->usage_meta,
                    'created_at' => $generation->created_at->toISOString(),
                ];
            });

        return Response::json([
            'success' => true,
            'data' => $history
        ]);
    }

    /**
     * IMPL-005: Implementação real de deletar histórico
     */
    public function deleteHistory(string $id): \Illuminate\Http\JsonResponse
    {
        $projectId = $this->getProjectId();
        $userId = Auth::id();

        // SECURITY: Verificar ownership e projeto
        $generation = AIGenerationModel::where('id', $id)
            ->where('user_id', $userId);
        if ($projectId) {
            $generation->where('project_id', $projectId);
        }
        $generation = $generation->firstOrFail();

        $generation->delete();

        return Response::json([
            'success' => true,
            'message' => 'History item deleted successfully'
        ], 204);
    }

    /**
     * AUTH-PENDENTE-017: Adicionada autorização
     */
    public function getProviders(): \Illuminate\Http\JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', AIGeneration::class);
        
        $manager = app(\App\Domains\AI\Services\AIProviderManager::class);
        return Response::json(['providers' => $manager->getProviderCapabilities()]);
    }

    /**
     * Geração de texto com Gemini
     */
    /**
     * AUTH-013: Adicionada autorização
     */
    public function generateText(GenerateTextRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->geminiService->generateText(
                $request->input('prompt'),
                $request->input('model', 'gemini-1.5-pro'),
                $userId,
                $projectId
            );

            return Response::json([
                'success' => true,
                'data' => [
                    'text' => $result,
                    'model' => $request->input('model', 'gemini-1.5-pro'),
                    'timestamp' => now()->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Geração de imagem com Gemini
     */
    /**
     * AUTH-013: Adicionada autorização
     */
    public function generateImage(GenerateImageRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->geminiService->generateImage(
                $request->input('prompt'),
                $request->only(['width', 'height', 'style', 'quality']),
                $userId,
                $projectId
            );

            return Response::json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Geração de vídeo com Veo2
     * AUTH-PENDENTE-011: Adicionada autorização e project_id
     */
    public function generateVideo(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->geminiService->generateVideo(
                $request->input('prompt'),
                $request->only(['duration', 'quality', 'style', 'aspect_ratio']),
                $userId,
                $projectId
            );

            return Response::json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Chat inteligente
     * AUTH-PENDENTE-011: Adicionada autorização e project_id
     */
    public function chat(ChatRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->integrationService->intelligentChat(
                $request->input('message'),
                $request->input('context', []),
                $userId,
                $projectId
            );

            return Response::json($result);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Geração de conteúdo multimodal
     * AUTH-PENDENTE-017: Adicionada autorização e project_id
     */
    public function generateMultimodal(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->integrationService->generateMultimodalContent(
                $request->all(),
                $userId,
                $projectId
            );

            return Response::json($result);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Análise avançada de texto
     * AUTH-PENDENTE-017: Adicionada autorização e project_id
     */
    public function analyzeText(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->integrationService->advancedTextAnalysis(
                $request->input('text'),
                $request->only(['sentiment', 'summary', 'translate_to', 'translate_from', 'pylab_analysis']),
                $userId,
                $projectId
            );

            return Response::json($result);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Geração de conteúdo para redes sociais
     * AUTH-PENDENTE-017: Adicionada autorização e project_id
     */
    public function generateSocialContent(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->integrationService->generateSocialMediaContent(
                $request->all(),
                $userId,
                $projectId
            );

            return Response::json($result);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Análise de sentimento
     * AUTH-PENDENTE-017: Adicionada autorização e project_id
     */
    public function analyzeSentiment(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->geminiService->analyzeSentiment(
                $request->input('text'),
                $userId,
                $projectId
            );

            return Response::json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tradução de texto
     * AUTH-PENDENTE-017: Adicionada autorização e project_id
     */
    public function translateText(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->geminiService->translateText(
                $request->input('text'),
                $request->input('target_language', 'pt'),
                $request->input('source_language', 'auto'),
                $userId,
                $projectId
            );

            return Response::json([
                'success' => true,
                'data' => [
                    'translated_text' => $result,
                    'source_language' => $request->input('source_language', 'auto'),
                    'target_language' => $request->input('target_language', 'pt')
                ]
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resumo de texto
     * AUTH-PENDENTE-017: Adicionada autorização e project_id
     */
    public function summarizeText(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $result = $this->geminiService->summarizeText(
                $request->input('text'),
                $request->input('max_length', 200),
                $userId,
                $projectId
            );

            return Response::json([
                'success' => true,
                'data' => [
                    'summary' => $result,
                    'max_length' => $request->input('max_length', 200)
                ]
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Status dos serviços
     * AUTH-PENDENTE-017: Adicionada autorização
     */
    public function getServicesStatus(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', AIGeneration::class);
        
        try {
            $status = $this->integrationService->getServicesStatus();
            return Response::json([
                'success' => true,
                'data' => $status
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lista modelos disponíveis
     * AUTH-PENDENTE-017: Adicionada autorização e project_id
     */
    public function getModels(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', AIGeneration::class);
        
        try {
            $userId = Auth::id();
            $projectId = $this->getProjectId();
            $models = $this->geminiService->listModels($userId, $projectId);

            return Response::json([
                'success' => true,
                'data' => $models
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test connections to all AI providers
     * AUTH-PENDENTE-017: Adicionada autorização
     */
    public function testConnections(): JsonResponse
    {
        // SECURITY: Verificar autorização (apenas admin/manager)
        $this->authorize('viewAny', AIGeneration::class);
        
        try {
            $results = $this->aiService->testConnections();

            return Response::json([
                'success' => true,
                'data' => $results
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get AI usage statistics
     * AUTH-PENDENTE-017: Adicionada autorização
     */
    public function getStats(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', AIGeneration::class);
        
        try {
            $stats = $this->aiService->getStats();

            return Response::json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return Response::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
