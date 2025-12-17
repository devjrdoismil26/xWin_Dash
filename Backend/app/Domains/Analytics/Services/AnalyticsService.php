<?php

namespace App\Domains\Analytics\Services;

use App\Domains\Analytics\Domain\AnalyticReport;
use App\Domains\Analytics\Domain\AnalyticReportRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AnalyticsService
{
    protected AnalyticReportRepositoryInterface $reportRepository;

    public function __construct(AnalyticReportRepositoryInterface $reportRepository)
    {
        $this->reportRepository = $reportRepository;
    }

    /**
     * Get date condition based on date range
     *
     * @param string $dateRange
     * @return string
     */
    private function getDateCondition(string $dateRange): string
    {
        switch ($dateRange) {
            case 'today':
                return "DATE(occurred_at) = CURDATE()";
            case 'yesterday':
                return "DATE(occurred_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
            case '7days':
                return "occurred_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            case '30days':
                return "occurred_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
            case '90days':
                return "occurred_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)";
            case 'this_month':
                return "YEAR(occurred_at) = YEAR(NOW()) AND MONTH(occurred_at) = MONTH(NOW())";
            case 'last_month':
                return "YEAR(occurred_at) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND MONTH(occurred_at) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))";
            case 'this_year':
                return "YEAR(occurred_at) = YEAR(NOW())";
            case 'last_year':
                return "YEAR(occurred_at) = YEAR(NOW()) - 1";
            default:
                return "occurred_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        }
    }

    /**
     * Get dashboard data for analytics
     * Otimização: Cache de 15 minutos + queries otimizadas
     *
     * @param string $dateRange
     * @param array $filters
     * @return array
     */
    public function getDashboardData(string $dateRange = '30days', array $filters = []): array
    {
        // Cache key baseado em dateRange e filters
        $cacheKey = 'analytics_dashboard_' . md5($dateRange . serialize($filters));
        
        return Cache::remember($cacheKey, 900, function () use ($dateRange, $filters) {
            $dateCondition = $this->getDateCondition($dateRange);
            $startDate = $this->getStartDate($dateRange);

            // Otimização: Calcular todas as métricas em uma única query quando possível
            // Get total unique visitors (otimizado com índice em user_id, occurred_at)
            $totalVisitors = \DB::table('analytics_events')
                ->where('occurred_at', '>=', $startDate)
                ->distinct('user_id')
                ->count('user_id');

            // Get total sessions (otimizado com índice em session_id, occurred_at)
            $totalSessions = \DB::table('analytics_events')
                ->where('occurred_at', '>=', $startDate)
                ->distinct('session_id')
                ->count('session_id');

            // Otimização: Calcular bounce rate usando subquery otimizada
            $bounceData = \DB::table('analytics_events')
                ->selectRaw('
                    COUNT(DISTINCT session_id) as total_sessions,
                    SUM(CASE WHEN event_count = 1 THEN 1 ELSE 0 END) as bounce_sessions
                ')
                ->fromSub(function ($query) use ($startDate) {
                    $query->selectRaw('session_id, COUNT(*) as event_count')
                        ->from('analytics_events')
                        ->where('occurred_at', '>=', $startDate)
                        ->groupBy('session_id');
                }, 'session_stats')
                ->first();

            $bounceRate = $bounceData && $bounceData->total_sessions > 0 
                ? ($bounceData->bounce_sessions / $bounceData->total_sessions) * 100 
                : 0;

            // Otimização: Calcular conversion rate em uma única query com índice
            $conversionData = \DB::table('analytics_events')
                ->selectRaw('
                    COUNT(DISTINCT session_id) as total_sessions,
                    COUNT(DISTINCT CASE WHEN event_category = "conversion" THEN session_id END) as conversion_sessions
                ')
                ->where('occurred_at', '>=', $startDate)
                ->first();

            $conversionRate = $conversionData && $conversionData->total_sessions > 0 
                ? ($conversionData->conversion_sessions / $conversionData->total_sessions) * 100 
                : 0;

            // Otimização: Get trends data em uma única query
            $trends = \DB::table('analytics_events')
                ->selectRaw('
                    DATE(occurred_at) as date,
                    COUNT(DISTINCT user_id) as visitors,
                    COUNT(DISTINCT session_id) as sessions,
                    COUNT(DISTINCT CASE WHEN event_category = "conversion" THEN session_id END) as conversions
                ')
                ->where('occurred_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $visitorsTrend = $trends->pluck('visitors')->toArray();
            $sessionsTrend = $trends->pluck('sessions')->toArray();
            $conversionsTrend = $trends->pluck('conversions')->toArray();

            // Otimização: Get top pages com índice em properties
            $topPages = \DB::table('analytics_events')
                ->selectRaw('
                    JSON_UNQUOTE(JSON_EXTRACT(properties, "$.page")) as page,
                    COUNT(*) as views,
                    COUNT(DISTINCT CASE WHEN event_category = "conversion" THEN session_id END) as conversions
                ')
                ->where('occurred_at', '>=', $startDate)
                ->whereNotNull('properties')
                ->groupBy('page')
                ->orderBy('views', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'page' => $item->page ?? '/unknown',
                        'views' => (int) $item->views,
                        'conversions' => (int) $item->conversions
                    ];
                })
                ->toArray();

            return [
                'overview' => [
                    'total_visitors' => $totalVisitors,
                    'total_sessions' => $totalSessions,
                    'bounce_rate' => round($bounceRate, 1),
                    'conversion_rate' => round($conversionRate, 1)
                ],
                'trends' => [
                    'visitors' => $visitorsTrend,
                    'sessions' => $sessionsTrend,
                    'conversions' => $conversionsTrend
                ],
                'top_pages' => $topPages,
                'date_range' => $dateRange,
                'filters' => $filters
            ];
        });
    }

    /**
     * Get start date based on date range
     */
    private function getStartDate(string $dateRange): string
    {
        return match ($dateRange) {
            'today' => now()->startOfDay()->toDateTimeString(),
            'yesterday' => now()->subDay()->startOfDay()->toDateTimeString(),
            '7days' => now()->subDays(7)->toDateTimeString(),
            '30days' => now()->subDays(30)->toDateTimeString(),
            '90days' => now()->subDays(90)->toDateTimeString(),
            'this_month' => now()->startOfMonth()->toDateTimeString(),
            'last_month' => now()->subMonth()->startOfMonth()->toDateTimeString(),
            'this_year' => now()->startOfYear()->toDateTimeString(),
            'last_year' => now()->subYear()->startOfYear()->toDateTimeString(),
            default => now()->subDays(30)->toDateTimeString(),
        };
    }

    /**
     * Get metrics data
     * Otimização: Cache de 15 minutos
     *
     * @param string $dateRange
     * @param array $filters
     * @return array
     */
    public function getMetrics(string $dateRange = '30days', array $filters = []): array
    {
        $cacheKey = 'analytics_metrics_' . md5($dateRange . serialize($filters));
        
        return Cache::remember($cacheKey, 900, function () use ($dateRange, $filters) {
            // Em produção: calcular métricas reais do banco
            return [
                'page_views' => 15420,
                'unique_visitors' => 8750,
                'bounce_rate' => 42.5,
                'avg_session_duration' => '2m 34s',
                'conversion_rate' => 3.2,
                'revenue' => 12500.00,
                'date_range' => $dateRange,
                'filters' => $filters
            ];
        });
    }

    /**
     * Get insights data
     *
     * @param string $dateRange
     * @param array $filters
     * @return array
     */
    public function getInsights(string $dateRange = '30days', array $filters = []): array
    {
        return [
            'insights' => [
                [
                    'type' => 'trend',
                    'title' => 'Traffic Increase',
                    'description' => 'Website traffic increased by 15% compared to last period',
                    'impact' => 'positive',
                    'value' => 15
                ],
                [
                    'type' => 'anomaly',
                    'title' => 'Bounce Rate Spike',
                    'description' => 'Bounce rate increased significantly on mobile devices',
                    'impact' => 'negative',
                    'value' => 8.5
                ]
            ],
            'recommendations' => [
                'Optimize mobile page load speed',
                'Improve mobile user experience',
                'A/B test landing pages'
            ],
            'date_range' => $dateRange,
            'filters' => $filters
        ];
    }

    /**
     * Get Google Analytics data
     *
     * @param string $dateRange
     * @param array $filters
     * @return array
     */
    public function getGoogleAnalyticsData(string $dateRange = '30days', array $filters = []): array
    {
        return [
            'ga_data' => [
                'sessions' => 2100,
                'users' => 1850,
                'pageviews' => 4200,
                'avg_session_duration' => '2m 15s',
                'bounce_rate' => 45.2,
                'goal_completions' => 85
            ],
            'acquisition' => [
                'organic' => 45,
                'direct' => 30,
                'social' => 15,
                'referral' => 10
            ],
            'date_range' => $dateRange,
            'filters' => $filters
        ];
    }

    /**
     * Export analytics data
     *
     * @param string $reportType
     * @param string $dateRange
     * @param string $format
     * @param array $filters
     * @return array
     */
    public function exportData(string $reportType, string $dateRange = '30days', string $format = 'csv', array $filters = []): array
    {
        return [
            'export_url' => '/exports/analytics_' . $reportType . '_' . time() . '.' . $format,
            'file_size' => '2.5MB',
            'expires_at' => now()->addHours(24)->toISOString(),
            'format' => $format,
            'report_type' => $reportType,
            'date_range' => $dateRange,
            'filters' => $filters
        ];
    }

    /**
     * Gera um relatório analítico com base nos parâmetros fornecidos.
     * Otimização: Cache de 15 minutos para relatórios históricos
     *
     * @param string $reportType
     * @param string $startDate
     * @param string $endDate
     * @param array  $filters
     *
     * @return AnalyticReport
     */
    public function generateReport(string $reportType, string $startDate, string $endDate, array $filters = []): AnalyticReport
    {
        // Cache para relatórios históricos (mais de 1 dia atrás)
        $isHistorical = \Carbon\Carbon::parse($endDate)->lt(now()->subDay());
        $cacheKey = 'analytics_report_' . md5($reportType . $startDate . $endDate . serialize($filters));
        
        $reportData = $isHistorical 
            ? Cache::remember($cacheKey, 900, function () use ($reportType, $startDate, $endDate, $filters) {
                return $this->collectAndProcessData($reportType, $startDate, $endDate, $filters);
            })
            : $this->collectAndProcessData($reportType, $startDate, $endDate, $filters);

        $reportName = "Relatório de {$reportType} de {$startDate} a {$endDate}";

        $report = $this->reportRepository->create([
            'name' => $reportName,
            'report_type' => $reportType,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'data' => $reportData,
            'user_id' => Auth::id(),
        ]);

        return $report;
    }

    /**
     * Placeholder para a lógica de coleta e processamento de dados.
     *
     * @param string $reportType
     * @param string $startDate
     * @param string $endDate
     * @param array  $filters
     *
     * @return array
     */
    protected function collectAndProcessData(string $reportType, string $startDate, string $endDate, array $filters): array
    {
        // Simulação de dados de relatório
        return [
            'total_views' => rand(1000, 10000),
            'total_clicks' => rand(100, 1000),
            'conversion_rate' => round(rand(1, 10) / 100, 2),
            'period' => "{$startDate} to {$endDate}",
            'filters_applied' => $filters,
        ];
    }

    /**
     * Registra uma métrica de campanha para analytics.
     *
     * @param string|int $campaignId ID da campanha
     * @param string $metricName Nome da métrica (ex: 'impressions', 'clicks', 'conversions')
     * @param mixed $value Valor da métrica
     * @param array $metadata Metadados adicionais (opcional)
     *
     * @return bool
     */
    public function recordCampaignMetric($campaignId, string $metricName, $value, array $metadata = []): bool
    {
        try {
            $projectId = session('selected_project_id');
            
            \DB::table('analytics_events')->insert([
                'event_type' => 'campaign_metric',
                'event_category' => 'campaign',
                'event_name' => $metricName,
                'properties' => json_encode([
                    'campaign_id' => $campaignId,
                    'value' => $value,
                    'metadata' => $metadata
                ]),
                'user_id' => Auth::id(),
                'project_id' => $projectId,
                'occurred_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return true;
        } catch (\Exception $e) {
            \Log::error("Falha ao registrar métrica de campanha: " . $e->getMessage(), [
                'campaign_id' => $campaignId,
                'metric_name' => $metricName,
                'value' => $value
            ]);
            return false;
        }
    }
}
