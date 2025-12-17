<?php

namespace App\Http\Controllers\Api;

use App\Domains\Universe\Application\Services\UniverseMonitoringService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UniverseMonitoringController extends Controller
{
    protected UniverseMonitoringService $monitoringService;

    public function __construct(UniverseMonitoringService $monitoringService)
    {
        $this->monitoringService = $monitoringService;
    }

    /**
     * Get current monitoring metrics
     */
    public function metrics(): JsonResponse
    {
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $metrics = $this->monitoringService->collectMetrics();
            
            return response()->json([
                'success' => true,
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to collect metrics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get monitoring report
     */
    public function report(): JsonResponse
    {
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $report = $this->monitoringService->generateReport();
            
            return response()->json([
                'success' => true,
                'data' => $report
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check for alerts
     */
    public function alerts(): JsonResponse
    {
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $this->monitoringService->collectMetrics();
            $issues = $this->monitoringService->detectIssues();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'issues' => $issues,
                    'count' => count($issues),
                    'critical_count' => count(array_filter($issues, fn($i) => $i['severity'] === 'critical')),
                    'warning_count' => count(array_filter($issues, fn($i) => $i['severity'] === 'warning'))
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check alerts: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system health status
     */
    public function health(): JsonResponse
    {
        try {
            $this->monitoringService->collectMetrics();
            $issues = $this->monitoringService->detectIssues();
            
            $criticalIssues = array_filter($issues, fn($i) => $i['severity'] === 'critical');
            $status = empty($criticalIssues) ? 'healthy' : 'unhealthy';
            
            return response()->json([
                'success' => true,
                'data' => [
                    'status' => $status,
                    'timestamp' => now()->toISOString(),
                    'issues_count' => count($issues),
                    'critical_issues' => count($criticalIssues)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => 'error',
                'message' => 'Health check failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get performance metrics
     */
    public function performance(): JsonResponse
    {
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $metrics = $this->monitoringService->collectMetrics();
            $performance = $metrics['performance'] ?? [];
            
            return response()->json([
                'success' => true,
                'data' => $performance
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get performance metrics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Universe-specific metrics
     */
    public function universe(): JsonResponse
    {
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $metrics = $this->monitoringService->collectMetrics();
            $universe = $metrics['universe'] ?? [];
            
            return response()->json([
                'success' => true,
                'data' => $universe
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get Universe metrics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Trigger manual monitoring cycle
     */
    public function trigger(): JsonResponse
    {
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $this->monitoringService->collectMetrics();
            $issues = $this->monitoringService->detectIssues();
            $this->monitoringService->saveMetrics();
            
            if (!empty($issues)) {
                $this->monitoringService->sendAlerts();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Monitoring cycle completed',
                'data' => [
                    'issues_detected' => count($issues),
                    'alerts_sent' => !empty($issues)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to trigger monitoring: ' . $e->getMessage()
            ], 500);
        }
    }
}