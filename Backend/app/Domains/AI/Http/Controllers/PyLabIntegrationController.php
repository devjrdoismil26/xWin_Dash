<?php

namespace App\Domains\AI\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Domains\AI\Http\Controllers\PyLabConnectionController;
use App\Domains\AI\Http\Controllers\PyLabGenerationController;
use App\Domains\AI\Application\Services\AIService;

/**
 * 🚀 PyLab Integration Controller
 *
 * Controller principal para integração entre aiLaboratory e PyLab
 * Delega operações para controllers especializados
 */
class PyLabIntegrationController extends Controller
{
    private PyLabConnectionController $connectionController;
    private PyLabGenerationController $generationController;
    private AIService $aiService;

    public function __construct(
        PyLabConnectionController $connectionController,
        PyLabGenerationController $generationController,
        AIService $aiService
    ) {
        $this->connectionController = $connectionController;
        $this->generationController = $generationController;
        $this->aiService = $aiService;
    }

    // ============================================================================
    // CONNECTION & STATUS
    // ============================================================================

    /**
     * Verificar status da conexão com PyLab
     */
    public function checkConnection(): JsonResponse
    {
        return $this->connectionController->checkConnection();
    }

    /**
     * Conectar ao PyLab
     */
    public function connect(Request $request): JsonResponse
    {
        return $this->connectionController->connect($request);
    }

    /**
     * Desconectar do PyLab
     */
    public function disconnect(): JsonResponse
    {
        return $this->connectionController->disconnect();
    }

    /**
     * Obter informações da conexão
     */
    public function getConnectionInfo(): JsonResponse
    {
        return $this->connectionController->getConnectionInfo();
    }

    /**
     * Testar conexão com PyLab
     */
    public function testConnection(): JsonResponse
    {
        return $this->connectionController->testConnection();
    }

    /**
     * Obter status detalhado do PyLab
     */
    public function getDetailedStatus(): JsonResponse
    {
        return $this->connectionController->getDetailedStatus();
    }

    /**
     * Reconfigurar conexão
     */
    public function reconfigure(Request $request): JsonResponse
    {
        return $this->connectionController->reconfigure($request);
    }

    /**
     * Obter logs de conexão
     */
    public function getConnectionLogs(): JsonResponse
    {
        return $this->connectionController->getConnectionLogs();
    }

    /**
     * Limpar logs de conexão
     */
    public function clearConnectionLogs(): JsonResponse
    {
        return $this->connectionController->clearConnectionLogs();
    }

    // ============================================================================
    // GENERATION OPERATIONS
    // ============================================================================

    /**
     * Gerar texto
     */
    public function generateText(Request $request): JsonResponse
    {
        return $this->generationController->generateText($request);
    }

    /**
     * Gerar imagem
     */
    public function generateImage(Request $request): JsonResponse
    {
        return $this->generationController->generateImage($request);
    }

    /**
     * Gerar vídeo
     */
    public function generateVideo(Request $request): JsonResponse
    {
        return $this->generationController->generateVideo($request);
    }

    /**
     * Analisar texto
     */
    public function analyzeText(Request $request): JsonResponse
    {
        return $this->generationController->analyzeText($request);
    }

    /**
     * Gerar código
     */
    public function generateCode(Request $request): JsonResponse
    {
        return $this->generationController->generateCode($request);
    }

    /**
     * Gerar conteúdo multimodal
     */
    public function generateMultimodal(Request $request): JsonResponse
    {
        return $this->generationController->generateMultimodal($request);
    }

    /**
     * Obter status de geração
     */
    public function getGenerationStatus(string $taskId): JsonResponse
    {
        return $this->generationController->getGenerationStatus($taskId);
    }

    /**
     * Cancelar geração
     */
    public function cancelGeneration(string $taskId): JsonResponse
    {
        return $this->generationController->cancelGeneration($taskId);
    }

    /**
     * Obter histórico de gerações
     */
    public function getGenerationHistory(Request $request): JsonResponse
    {
        return $this->generationController->getGenerationHistory($request);
    }

    // ============================================================================
    // INTEGRATION OPERATIONS
    // ============================================================================

    /**
     * Obter dashboard de integração
     */
    public function getIntegrationDashboard(): JsonResponse
    {
        try {
            $connectionStatus = $this->connectionController->checkConnection();
            $connectionInfo = $this->connectionController->getConnectionInfo();
            $recentHistory = $this->generationController->getGenerationHistory(
                new Request(['limit' => 10])
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'connection' => $connectionStatus->getData(),
                    'info' => $connectionInfo->getData(),
                    'recent_activity' => $recentHistory->getData(),
                    'timestamp' => now()->toISOString()
                ]
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabIntegrationController::getIntegrationDashboard', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter dashboard de integração',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obter estatísticas de uso
     */
    public function getUsageStatistics(): JsonResponse
    {
        try {
            $statistics = $this->aiService->getUsageStatistics();

            return response()->json([
                'success' => true,
                'data' => $statistics
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabIntegrationController::getUsageStatistics', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter estatísticas de uso',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obter modelos disponíveis
     */
    public function getAvailableModels(): JsonResponse
    {
        try {
            $models = $this->aiService->getAvailableModels();

            return response()->json([
                'success' => true,
                'data' => $models
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabIntegrationController::getAvailableModels', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter modelos disponíveis',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Validar configuração
     */
    public function validateConfiguration(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'pylab_url' => 'required|url',
                'api_key' => 'required|string',
                'timeout' => 'integer|min:5|max:300'
            ]);

            $config = [
                'pylab_url' => $request->get('pylab_url'),
                'api_key' => $request->get('api_key'),
                'timeout' => $request->get('timeout', 30)
            ];

            $validation = $this->aiService->validateConfiguration($config);

            return response()->json([
                'success' => true,
                'data' => $validation,
                'message' => 'Configuração validada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabIntegrationController::validateConfiguration', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao validar configuração',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obter logs de integração
     */
    public function getIntegrationLogs(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'limit' => 'integer|min:1|max:1000',
                'level' => 'string|in:debug,info,warning,error',
                'date_from' => 'date',
                'date_to' => 'date|after_or_equal:date_from'
            ]);

            $filters = [
                'limit' => $request->get('limit', 100),
                'level' => $request->get('level'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to')
            ];

            $logs = $this->aiService->getIntegrationLogs($filters);

            return response()->json([
                'success' => true,
                'data' => $logs
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabIntegrationController::getIntegrationLogs', [
                'error' => $exception->getMessage(),
                'filters' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter logs de integração',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Limpar logs de integração
     */
    public function clearIntegrationLogs(): JsonResponse
    {
        try {
            $result = $this->aiService->clearIntegrationLogs();

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Logs de integração limpos com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabIntegrationController::clearIntegrationLogs', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao limpar logs de integração',
                'details' => $exception->getMessage()
            ], 500);
        }
    }
}
