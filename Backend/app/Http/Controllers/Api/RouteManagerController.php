<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RouteManager;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * 🚀 ROUTE MANAGER CONTROLLER
 * 
 * API para gerenciar o sistema de rotas
 */
class RouteManagerController extends Controller
{
    protected RouteManager $routeManager;

    public function __construct(RouteManager $routeManager)
    {
        $this->routeManager = $routeManager;
    }

    /**
     * Obter estatísticas de rotas
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->routeManager->getRouteStats(),
        ]);
    }

    /**
     * Obter informações de um módulo
     */
    public function moduleInfo(Request $request, string $module): JsonResponse
    {
        $info = $this->routeManager->getModuleInfo($module);
        
        return response()->json([
            'success' => true,
            'data' => $info,
        ]);
    }

    /**
     * Listar módulos disponíveis
     */
    public function modules(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'available' => $this->routeManager->getAvailableModules(),
                'enabled' => $this->routeManager->getEnabledModules(),
            ],
        ]);
    }

    /**
     * Habilitar/desabilitar módulo
     */
    public function toggleModule(Request $request, string $module): JsonResponse
    {
        $enabled = $request->boolean('enabled', true);
        
        $result = $this->routeManager->toggleModule($module, $enabled);
        
        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Módulo não encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => "Módulo '{$module}' " . ($enabled ? 'habilitado' : 'desabilitado') . ' com sucesso',
        ]);
    }

    /**
     * Verificar saúde do sistema
     */
    public function healthCheck(): JsonResponse
    {
        $health = $this->routeManager->healthCheck();
        
        $statusCode = $health['status'] === 'healthy' ? 200 : 503;
        
        return response()->json([
            'success' => $health['status'] === 'healthy',
            'data' => $health,
        ], $statusCode);
    }

    /**
     * Limpar cache de rotas
     */
    public function clearCache(): JsonResponse
    {
        $this->routeManager->clearCache();
        
        return response()->json([
            'success' => true,
            'message' => 'Cache de rotas limpo com sucesso',
        ]);
    }

    /**
     * Recarregar rotas
     */
    public function reload(): JsonResponse
    {
        // Limpar cache
        $this->routeManager->clearCache();
        
        // Recarregar rotas
        $this->routeManager->loadAllRoutes();
        
        return response()->json([
            'success' => true,
            'message' => 'Rotas recarregadas com sucesso',
            'data' => $this->routeManager->getRouteStats(),
        ]);
    }

    /**
     * Obter configurações do RouteManager
     */
    public function config(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'route_manager' => config('route_manager'),
                'modules' => config('modules'),
            ],
        ]);
    }

    /**
     * Obter informações detalhadas de performance
     */
    public function performance(): JsonResponse
    {
        $stats = $this->routeManager->getRouteStats();
        $health = $this->routeManager->healthCheck();
        
        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'health' => $health,
                'memory_usage' => memory_get_usage(true),
                'peak_memory' => memory_get_peak_usage(true),
                'load_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
            ],
        ]);
    }
}