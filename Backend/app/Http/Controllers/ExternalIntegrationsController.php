<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\AnalyticsService;
use App\Services\ContentSchedulingService;
use App\Domains\AI\Services\FunctionCallingService;
use Illuminate\Support\Facades\Log;

/**
 * 🚀 External Integrations Controller
 * 
 * Controller para gerenciar todas as integrações externas
 */
class ExternalIntegrationsController extends Controller
{
    public function __construct(
        private RateLimiterService $rateLimiter,
        private CircuitBreakerService $circuitBreaker,
        private AnalyticsService $analytics,
        private ContentSchedulingService $scheduling,
        private FunctionCallingService $functionCalling
    ) {}

    /**
     * Obtém status de todas as integrações
     */
    public function getStatus(): JsonResponse
    {
        try {
            $status = [
                'timestamp' => now()->toISOString(),
                'services' => [
                    'rate_limiter' => [
                        'status' => 'active',
                        'platforms' => array_keys($this->rateLimiter->getAllLimits())
                    ],
                    'circuit_breaker' => [
                        'status' => 'active',
                        'circuits' => $this->circuitBreaker->getAllCircuitStates()
                    ],
                    'analytics' => [
                        'status' => 'active',
                        'supported_platforms' => ['facebook', 'google', 'twitter', 'linkedin', 'tiktok']
                    ],
                    'content_scheduling' => [
                        'status' => 'active',
                        'supported_platforms' => ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']
                    ],
                    'function_calling' => [
                        'status' => 'active',
                        'available_functions' => count($this->functionCalling->getAvailableFunctions())
                    ]
                ]
            ];

            return response()->json($status);
        } catch (\Exception $e) {
            Log::error('Failed to get integrations status', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get integrations status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém estatísticas de rate limiting
     */
    public function getRateLimitStats(Request $request): JsonResponse
    {
        try {
            $platform = $request->get('platform');
            $endpoint = $request->get('endpoint', 'default');
            $userId = $request->get('user_id');

            if ($platform) {
                $stats = $this->rateLimiter->getUsageStats($platform, $endpoint, $userId);
            } else {
                $stats = [];
                foreach (array_keys($this->rateLimiter->getAllLimits()) as $p) {
                    $stats[$p] = $this->rateLimiter->getUsageStats($p, $endpoint, $userId);
                }
            }

            return response()->json([
                'timestamp' => now()->toISOString(),
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get rate limit stats', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get rate limit stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém status dos circuit breakers
     */
    public function getCircuitBreakerStatus(Request $request): JsonResponse
    {
        try {
            $platform = $request->get('platform');
            $endpoint = $request->get('endpoint', 'default');

            if ($platform) {
                $status = $this->circuitBreaker->getCircuitStats($platform, $endpoint);
            } else {
                $status = $this->circuitBreaker->getAllCircuitStates();
            }

            return response()->json([
                'timestamp' => now()->toISOString(),
                'status' => $status
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get circuit breaker status', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get circuit breaker status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reseta circuit breaker
     */
    public function resetCircuitBreaker(Request $request): JsonResponse
    {
        try {
            $platform = $request->get('platform');
            $endpoint = $request->get('endpoint', 'default');

            if (!$platform) {
                return response()->json([
                    'error' => 'Platform is required'
                ], 400);
            }

            $this->circuitBreaker->resetCircuit($platform, $endpoint);

            return response()->json([
                'message' => "Circuit breaker reset for {$platform}",
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to reset circuit breaker', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to reset circuit breaker',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém métricas agregadas
     */
    public function getAggregatedMetrics(Request $request): JsonResponse
    {
        try {
            $platforms = $request->get('platforms', []);
            $params = $request->get('params', []);

            if (empty($platforms)) {
                return response()->json([
                    'error' => 'Platforms are required'
                ], 400);
            }

            $metrics = $this->analytics->getAggregatedMetrics($platforms, $params);

            return response()->json([
                'timestamp' => now()->toISOString(),
                'metrics' => $metrics
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get aggregated metrics', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get aggregated metrics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém relatório de performance
     */
    public function getPerformanceReport(Request $request): JsonResponse
    {
        try {
            $platforms = $request->get('platforms', []);
            $params = $request->get('params', []);

            if (empty($platforms)) {
                return response()->json([
                    'error' => 'Platforms are required'
                ], 400);
            }

            $report = $this->analytics->getPerformanceReport($platforms, $params);

            return response()->json([
                'timestamp' => now()->toISOString(),
                'report' => $report
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get performance report', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get performance report',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém sugestões de horários otimizados
     */
    public function getOptimalTimes(Request $request): JsonResponse
    {
        try {
            $platform = $request->get('platform');
            $options = $request->get('options', []);

            if (!$platform) {
                return response()->json([
                    'error' => 'Platform is required'
                ], 400);
            }

            $suggestions = $this->scheduling->suggestOptimalTimes($platform, $options);

            return response()->json([
                'timestamp' => now()->toISOString(),
                'platform' => $platform,
                'suggestions' => $suggestions
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get optimal times', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get optimal times',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém estatísticas de agendamento
     */
    public function getSchedulingStats(Request $request): JsonResponse
    {
        try {
            $filters = $request->get('filters', []);
            $stats = $this->scheduling->getSchedulingStats($filters);

            return response()->json([
                'timestamp' => now()->toISOString(),
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get scheduling stats', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get scheduling stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém funções disponíveis para function calling
     */
    public function getAvailableFunctions(): JsonResponse
    {
        try {
            $functions = $this->functionCalling->getAvailableFunctions();
            $stats = $this->functionCalling->getFunctionStats();

            return response()->json([
                'timestamp' => now()->toISOString(),
                'functions' => $functions,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get available functions', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get available functions',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Executa uma função via function calling
     */
    public function executeFunction(Request $request): JsonResponse
    {
        try {
            $name = $request->get('name');
            $arguments = $request->get('arguments', []);

            if (!$name) {
                return response()->json([
                    'error' => 'Function name is required'
                ], 400);
            }

            $result = $this->functionCalling->executeFunction($name, $arguments);

            return response()->json([
                'timestamp' => now()->toISOString(),
                'function' => $name,
                'arguments' => $arguments,
                'result' => $result
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to execute function', [
                'function' => $request->get('name'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to execute function',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Testa conectividade de uma plataforma
     */
    public function testConnectivity(Request $request): JsonResponse
    {
        try {
            $platform = $request->get('platform');
            $accountId = $request->get('account_id');

            if (!$platform || !$accountId) {
                return response()->json([
                    'error' => 'Platform and account_id are required'
                ], 400);
            }

            // Aqui você implementaria o teste real de conectividade
            // Por enquanto, vamos simular
            $result = [
                'platform' => $platform,
                'account_id' => $accountId,
                'connected' => true,
                'response_time_ms' => rand(100, 500),
                'timestamp' => now()->toISOString()
            ];

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Failed to test connectivity', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to test connectivity',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém logs de integração
     */
    public function getLogs(Request $request): JsonResponse
    {
        try {
            $platform = $request->get('platform');
            $level = $request->get('level', 'info');
            $limit = $request->get('limit', 100);

            // Aqui você implementaria a busca real nos logs
            // Por enquanto, vamos simular
            $logs = [
                [
                    'timestamp' => now()->subMinutes(5)->toISOString(),
                    'level' => 'info',
                    'platform' => $platform ?? 'system',
                    'message' => 'Integration test completed successfully'
                ],
                [
                    'timestamp' => now()->subMinutes(10)->toISOString(),
                    'level' => 'info',
                    'platform' => $platform ?? 'system',
                    'message' => 'Rate limit check passed'
                ]
            ];

            return response()->json([
                'timestamp' => now()->toISOString(),
                'logs' => $logs,
                'total' => count($logs)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to get logs', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get logs',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}