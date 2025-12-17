<?php

namespace App\Domains\Analytics\Http\Controllers;

use App\Domains\Analytics\Http\Requests\GetReportDataRequest;
use App\Domains\Analytics\Services\AnalyticsService;
use App\Domains\Analytics\Infrastructure\Persistence\Eloquent\AnalyticsEventModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * AnalyticsController
 * 
 * SECURITY FIX (AUTH-009): Implementada filtragem por project_id para multi-tenancy
 */
class AnalyticsController extends Controller
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * Add project filter to request filters
     */
    protected function addProjectFilter(array $filters): array
    {
        $projectId = $this->getProjectId();
        if ($projectId) {
            $filters['project_id'] = $projectId;
        }
        return $filters;
    }

    /**
     * Handle the request to get report data.
     * AUTH-020: Adicionada autorização
     *
     * @param GetReportDataRequest $request
     *
     * @return JsonResponse
     */
    public function getReportData(GetReportDataRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('view', AnalyticsEventModel::class);
        
        try {
            // SECURITY: Adicionar filtro de projeto
            $filters = $this->addProjectFilter($request->input('filters', []));
            
            $reportData = $this->analyticsService->generateReport(
                $request->input('report_type'),
                $request->input('start_date'),
                $request->input('end_date'),
                $filters,
            );

            return response()->json(['data' => $reportData]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getSummary(GetReportDataRequest $request): JsonResponse
    {
        // Map summary to generateReport for now
        return $this->getReportData($request);
    }

    public function getDetailedReport(GetReportDataRequest $request): JsonResponse
    {
        return $this->getReportData($request);
    }

    /**
     * Get analytics dashboard data.
     * AUTH-020: Adicionada autorização
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return JsonResponse
     */
    public function getDashboard(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('view', AnalyticsEventModel::class);
        
        try {
            // SECURITY: Adicionar filtro de projeto
            $filters = $this->addProjectFilter($request->input('filters', []));
            
            $dashboardData = $this->analyticsService->getDashboardData(
                $request->input('date_range', '30days'),
                $filters
            );

            return response()->json([
                'success' => true,
                'data' => $dashboardData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get analytics metrics.
     * AUTH-PENDENTE-009: Adicionada autorização
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return JsonResponse
     */
    public function getMetrics(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('view', AnalyticsEventModel::class);
        
        try {
            // SECURITY: Adicionar filtro de projeto
            $filters = $this->addProjectFilter($request->input('filters', []));
            
            $metrics = $this->analyticsService->getMetrics(
                $request->input('date_range', '30days'),
                $filters
            );

            return response()->json([
                'success' => true,
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get analytics insights.
     * AUTH-PENDENTE-009: Adicionada autorização
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return JsonResponse
     */
    public function getInsights(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('view', AnalyticsEventModel::class);
        
        try {
            // SECURITY: Adicionar filtro de projeto
            $filters = $this->addProjectFilter($request->input('filters', []));
            
            $insights = $this->analyticsService->getInsights(
                $request->input('date_range', '30days'),
                $filters
            );

            return response()->json([
                'success' => true,
                'data' => $insights
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Google Analytics integration data.
     * AUTH-PENDENTE-009: Adicionada autorização
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return JsonResponse
     */
    public function getGoogleAnalytics(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('view', AnalyticsEventModel::class);
        
        try {
            $gaData = $this->analyticsService->getGoogleAnalyticsData(
                $request->input('date_range', '30days'),
                $request->input('filters', [])
            );

            return response()->json([
                'success' => true,
                'data' => $gaData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export analytics data.
     * AUTH-020: Adicionada autorização
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return JsonResponse
     */
    public function export(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('view', AnalyticsEventModel::class);
        
        try {
            $format = $request->input('format', 'csv');
            $exportData = $this->analyticsService->exportData(
                $request->input('report_type'),
                $request->input('date_range', '30days'),
                $format,
                $request->input('filters', [])
            );

            return response()->json([
                'success' => true,
                'data' => $exportData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
