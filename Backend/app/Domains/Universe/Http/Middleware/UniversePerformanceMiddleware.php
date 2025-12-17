<?php

namespace App\Domains\Universe\Http\Middleware;

use App\Domains\Universe\Application\Services\UniversePerformanceService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Middleware para monitorar performance das rotas do Universe
 */
class UniversePerformanceMiddleware
{
    protected UniversePerformanceService $performanceService;

    public function __construct(UniversePerformanceService $performanceService)
    {
        $this->performanceService = $performanceService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage();

        // Executa a requisição
        $response = $next($request);

        // Calcula métricas
        $executionTime = microtime(true) - $startTime;
        $memoryUsed = memory_get_usage() - $startMemory;

        // Registra métricas se for crítica
        if ($executionTime > 1.0 || $memoryUsed > 25 * 1024 * 1024) {
            $this->performanceService->monitorOperation(
                'universe_request',
                function () use ($request, $executionTime, $memoryUsed) {
                    Log::warning('Universe slow request detected', [
                        'url' => $request->fullUrl(),
                        'method' => $request->method(),
                        'execution_time' => $executionTime,
                        'memory_used' => $memoryUsed,
                        'user_id' => auth()->id(),
                        'ip' => $request->ip()
                    ]);
                }
            );
        }

        // Adiciona headers de performance
        $response->headers->set('X-Universe-Execution-Time', round($executionTime, 4));
        $response->headers->set('X-Universe-Memory-Used', $this->formatBytes($memoryUsed));

        return $response;
    }

    /**
     * Formata bytes para leitura humana
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}