<?php

namespace App\Domains\AI\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Domains\AI\Application\Services\PyLabIntegrationService;

/**
 * Controller especializado para gerenciamento de conexão com PyLab
 */
class PyLabConnectionController extends Controller
{
    private PyLabIntegrationService $pyLabService;

    public function __construct(PyLabIntegrationService $pyLabService)
    {
        $this->pyLabService = $pyLabService;
    }

    /**
     * Verificar status da conexão com PyLab
     */
    public function checkConnection(): JsonResponse
    {
        try {
            $isConnected = $this->pyLabService->checkConnection();

            return response()->json([
                'success' => true,
                'connected' => $isConnected,
                'timestamp' => now()->toISOString(),
                'message' => $isConnected ? 'PyLab conectado' : 'PyLab desconectado'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::checkConnection', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'connected' => false,
                'error' => 'Erro ao verificar conexão com PyLab',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Conectar ao PyLab
     */
    public function connect(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'pylab_url' => 'required|url',
                'api_key' => 'required|string',
                'timeout' => 'integer|min:5|max:300'
            ]);

            $connectionData = [
                'pylab_url' => $request->get('pylab_url'),
                'api_key' => $request->get('api_key'),
                'timeout' => $request->get('timeout', 30)
            ];

            $result = $this->pyLabService->connect($connectionData);

            return response()->json([
                'success' => true,
                'connected' => true,
                'data' => $result,
                'message' => 'Conectado ao PyLab com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::connect', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'connected' => false,
                'error' => 'Erro ao conectar ao PyLab',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Desconectar do PyLab
     */
    public function disconnect(): JsonResponse
    {
        try {
            $result = $this->pyLabService->disconnect();

            return response()->json([
                'success' => true,
                'connected' => false,
                'data' => $result,
                'message' => 'Desconectado do PyLab com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::disconnect', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao desconectar do PyLab',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obter informações da conexão
     */
    public function getConnectionInfo(): JsonResponse
    {
        try {
            $info = $this->pyLabService->getConnectionInfo();

            return response()->json([
                'success' => true,
                'data' => $info
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::getConnectionInfo', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter informações da conexão',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Testar conexão com PyLab
     */
    public function testConnection(): JsonResponse
    {
        try {
            $result = $this->pyLabService->testConnection();

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Teste de conexão realizado com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::testConnection', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro no teste de conexão',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obter status detalhado do PyLab
     */
    public function getDetailedStatus(): JsonResponse
    {
        try {
            $status = $this->pyLabService->getDetailedStatus();

            return response()->json([
                'success' => true,
                'data' => $status
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::getDetailedStatus', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter status detalhado',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Reconfigurar conexão
     */
    public function reconfigure(Request $request): JsonResponse
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

            $result = $this->pyLabService->reconfigure($config);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Conexão reconfigurada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::reconfigure', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao reconfigurar conexão',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obter logs de conexão
     */
    public function getConnectionLogs(): JsonResponse
    {
        try {
            $logs = $this->pyLabService->getConnectionLogs();

            return response()->json([
                'success' => true,
                'data' => $logs
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::getConnectionLogs', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter logs de conexão',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Limpar logs de conexão
     */
    public function clearConnectionLogs(): JsonResponse
    {
        try {
            $result = $this->pyLabService->clearConnectionLogs();

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Logs de conexão limpos com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabConnectionController::clearConnectionLogs', [
                'error' => $exception->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao limpar logs de conexão',
                'details' => $exception->getMessage()
            ], 500);
        }
    }
}
