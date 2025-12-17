<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\UniverseAnalytics;
use App\Domains\Analytics\Services\GoogleAnalyticsService;
use Illuminate\Support\Facades\Log;

class BusinessIntelligenceEngine
{
    protected GoogleAnalyticsService $analyticsService;

    public function __construct(GoogleAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }
    /**
     * Gera insights de Business Intelligence com base em dados do universo.
     *
     * @param string $dataSource a fonte de dados para análise (ex: 'leads', 'campaigns', 'instances')
     * @param array<string, mixed> $filters filtros a serem aplicados na análise
     *
     * @return array<string, mixed> os insights gerados
     *
     * @throws \Exception se a análise falhar ou a fonte de dados não for suportada
     */
    public function getInsights(string $dataSource, array $filters = []): array
    {
        Log::info("Gerando insights de BI para fonte: {$dataSource} com filtros: " . json_encode($filters));

        $insights = [];

        switch (strtolower($dataSource)) {
            case 'web_analytics':
                // Insights reais do Google Analytics
                $insights = $this->getWebAnalyticsInsights($filters);
                break;

            case 'traffic_sources':
                // Análise de fontes de tráfego
                $insights = $this->getTrafficSourcesInsights($filters);
                break;

            case 'user_behavior':
                // Comportamento do usuário
                $insights = $this->getUserBehaviorInsights($filters);
                break;

            case 'leads':
                // Insights de Leads combinando GA + dados internos
                $insights = $this->getLeadsInsights($filters);
                break;

            case 'campaigns':
                // Insights de Campanhas
                $insights = $this->getCampaignsInsights($filters);
                break;

            case 'instances':
                // Insights de Instâncias
                $insights = $this->getInstancesInsights($filters);
                break;

            default:
                throw new \Exception("Fonte de dados de BI não suportada: {$dataSource}.");
        }

        Log::info("Insights de BI gerados com sucesso para fonte: {$dataSource}.");
        return $insights;
    }

    /**
     * Obtém insights de web analytics do Google Analytics.
     */
    protected function getWebAnalyticsInsights(array $filters): array
    {
        try {
            $startDate = $filters['start_date'] ?? '30daysAgo';
            $endDate = $filters['end_date'] ?? 'today';
            $propertyId = $filters['property_id'] ?? config('services.google_analytics.property_id');

            // Obter métricas básicas do GA
            $basicMetrics = $this->analyticsService->getBasicMetrics($propertyId, $startDate, $endDate);

            // Obter dados de sessões
            $sessions = $this->analyticsService->getSessions($propertyId, $startDate, $endDate);

            // Obter eventos personalizados
            $events = $this->analyticsService->getEvents($propertyId, $startDate, $endDate);

            return [
                'summary' => [
                    'total_users' => $basicMetrics['users'] ?? 0,
                    'total_sessions' => $basicMetrics['sessions'] ?? 0,
                    'page_views' => $basicMetrics['pageViews'] ?? 0,
                    'bounce_rate' => $basicMetrics['bounceRate'] ?? 0,
                    'avg_session_duration' => $basicMetrics['avgSessionDuration'] ?? 0,
                ],
                'sessions_data' => $sessions,
                'events_data' => $events,
                'trends' => $this->calculateTrends($basicMetrics),
                'generated_at' => now()->toISOString(),
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter insights de web analytics: " . $e->getMessage());
            return ['error' => 'Falha ao obter dados do Google Analytics', 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtém insights de fontes de tráfego.
     */
    protected function getTrafficSourcesInsights(array $filters): array
    {
        try {
            $startDate = $filters['start_date'] ?? '30daysAgo';
            $endDate = $filters['end_date'] ?? 'today';
            $propertyId = $filters['property_id'] ?? config('services.google_analytics.property_id');

            // Obter dados de canais de aquisição
            $channels = $this->analyticsService->getAcquisitionChannels($propertyId, $startDate, $endDate);

            // Obter dados de referenciadores
            $referrers = $this->analyticsService->getReferrers($propertyId, $startDate, $endDate);

            return [
                'acquisition_channels' => $channels,
                'top_referrers' => $referrers,
                'channel_performance' => $this->analyzeChannelPerformance($channels),
                'generated_at' => now()->toISOString(),
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter insights de fontes de tráfego: " . $e->getMessage());
            return ['error' => 'Falha ao obter dados de fontes de tráfego', 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtém insights de comportamento do usuário.
     */
    protected function getUserBehaviorInsights(array $filters): array
    {
        try {
            $startDate = $filters['start_date'] ?? '30daysAgo';
            $endDate = $filters['end_date'] ?? 'today';
            $propertyId = $filters['property_id'] ?? config('services.google_analytics.property_id');

            // Obter dados de páginas mais visitadas
            $topPages = $this->analyticsService->getTopPages($propertyId, $startDate, $endDate);

            // Obter eventos personalizados
            $events = $this->analyticsService->getEvents($propertyId, $startDate, $endDate);

            return [
                'top_pages' => $topPages,
                'user_events' => $events,
                'behavior_flow' => $this->analyzeBehaviorFlow($topPages, $events),
                'generated_at' => now()->toISOString(),
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter insights de comportamento: " . $e->getMessage());
            return ['error' => 'Falha ao obter dados de comportamento', 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtém insights de leads combinando GA e dados internos.
     */
    protected function getLeadsInsights(array $filters): array
    {
        try {
            // Dados do Google Analytics
            $gaInsights = $this->getWebAnalyticsInsights($filters);

            // Dados internos de leads (simulação - em produção viria do repositório de leads)
            $internalLeads = $this->getInternalLeadsData($filters);

            return [
                'analytics_data' => $gaInsights,
                'internal_leads' => $internalLeads,
                'conversion_metrics' => $this->calculateConversionMetrics($gaInsights, $internalLeads),
                'lead_quality_score' => $this->calculateLeadQualityScore($internalLeads),
                'generated_at' => now()->toISOString(),
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter insights de leads: " . $e->getMessage());
            return ['error' => 'Falha ao obter dados de leads', 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtém insights de campanhas.
     */
    protected function getCampaignsInsights(array $filters): array
    {
        try {
            $gaInsights = $this->getWebAnalyticsInsights($filters);
            $trafficInsights = $this->getTrafficSourcesInsights($filters);

            // Dados internos de campanhas
            $campaignData = $this->getInternalCampaignData($filters);

            return [
                'campaign_performance' => $campaignData,
                'traffic_attribution' => $trafficInsights,
                'roi_analysis' => $this->calculateCampaignROI($campaignData, $gaInsights),
                'optimization_suggestions' => $this->generateOptimizationSuggestions($campaignData),
                'generated_at' => now()->toISOString(),
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter insights de campanhas: " . $e->getMessage());
            return ['error' => 'Falha ao obter dados de campanhas', 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtém insights de instâncias do universo.
     */
    protected function getInstancesInsights(array $filters): array
    {
        try {
            // Dados do banco interno de instâncias
            $instancesData = $this->getInternalInstancesData($filters);

            // Correlacionar com dados de analytics se disponível
            $analyticsData = $this->getWebAnalyticsInsights($filters);

            return [
                'instances_summary' => $instancesData['summary'],
                'performance_metrics' => $instancesData['metrics'],
                'usage_patterns' => $this->analyzeUsagePatterns($instancesData),
                'growth_trends' => $this->calculateGrowthTrends($instancesData),
                'analytics_correlation' => $analyticsData,
                'generated_at' => now()->toISOString(),
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter insights de instâncias: " . $e->getMessage());
            return ['error' => 'Falha ao obter dados de instâncias', 'message' => $e->getMessage()];
        }
    }

    /**
     * Calcula tendências baseadas nas métricas.
     */
    protected function calculateTrends(array $metrics): array
    {
        return [
            'user_growth' => $this->calculateGrowthRate($metrics['users'] ?? 0),
            'session_trend' => $this->calculateGrowthRate($metrics['sessions'] ?? 0),
            'engagement_trend' => $this->calculateEngagementTrend($metrics),
        ];
    }

    /**
     * Analisa performance dos canais.
     */
    protected function analyzeChannelPerformance(array $channels): array
    {
        $performance = [];
        foreach ($channels as $channel) {
            $performance[$channel['channel']] = [
                'efficiency_score' => $this->calculateChannelEfficiency($channel),
                'roi_estimate' => $this->estimateChannelROI($channel),
                'growth_potential' => $this->assessGrowthPotential($channel),
            ];
        }
        return $performance;
    }

    /**
     * Analisa fluxo de comportamento do usuário.
     */
    protected function analyzeBehaviorFlow(array $pages, array $events): array
    {
        return [
            'entry_points' => array_slice($pages, 0, 5),
            'conversion_funnel' => $this->buildConversionFunnel($events),
            'drop_off_points' => $this->identifyDropOffPoints($pages, $events),
        ];
    }

    // Métodos auxiliares para cálculos internos
    protected function calculateGrowthRate(int $current, int $previous = 0): float
    {
        if ($previous === 0) {
            return 0;
        }
        return (($current - $previous) / $previous) * 100;
    }

    protected function calculateEngagementTrend(array $metrics): string
    {
        $avgDuration = $metrics['avgSessionDuration'] ?? 0;
        $bounceRate = $metrics['bounceRate'] ?? 100;

        if ($avgDuration > 180 && $bounceRate < 50) {
            return 'high';
        }
        if ($avgDuration > 120 && $bounceRate < 70) {
            return 'medium';
        }
        return 'low';
    }

    protected function calculateChannelEfficiency(array $channel): float
    {
        $sessions = $channel['sessions'] ?? 1;
        $conversions = $channel['conversions'] ?? 0;
        return ($conversions / $sessions) * 100;
    }

    protected function estimateChannelROI(array $channel): float
    {
        // Lógica simplificada de ROI
        return ($channel['value'] ?? 0) / max($channel['cost'] ?? 1, 1);
    }

    protected function assessGrowthPotential(array $channel): string
    {
        $efficiency = $this->calculateChannelEfficiency($channel);
        if ($efficiency > 5) {
            return 'high';
        }
        if ($efficiency > 2) {
            return 'medium';
        }
        return 'low';
    }

    protected function buildConversionFunnel(array $events): array
    {
        // Construir funil baseado em eventos comuns
        $funnel = [];
        $commonEvents = ['page_view', 'engagement', 'conversion'];

        foreach ($commonEvents as $event) {
            $count = 0;
            foreach ($events as $eventData) {
                if (str_contains($eventData['event_name'] ?? '', $event)) {
                    $count += $eventData['count'] ?? 0;
                }
            }
            $funnel[$event] = $count;
        }

        return $funnel;
    }

    protected function identifyDropOffPoints(array $pages, array $events): array
    {
        // Identificar pontos onde usuários saem mais
        $dropOffs = [];
        foreach ($pages as $page) {
            if (($page['bounce_rate'] ?? 0) > 70) {
                $dropOffs[] = [
                    'page' => $page['page_path'] ?? 'unknown',
                    'bounce_rate' => $page['bounce_rate'] ?? 0,
                    'severity' => 'high'
                ];
            }
        }
        return $dropOffs;
    }

    // Métodos para dados internos (placeholders que seriam implementados com repositórios reais)
    protected function getInternalLeadsData(array $filters): array
    {
        // Em produção, isso viria do repositório de leads
        return [
            'total_leads' => 150,
            'qualified_leads' => 45,
            'conversion_rate' => 30.0,
            'sources' => ['organic' => 60, 'paid' => 45, 'referral' => 30, 'direct' => 15]
        ];
    }

    protected function getInternalCampaignData(array $filters): array
    {
        // Em produção, isso viria do repositório de campanhas
        return [
            'active_campaigns' => 8,
            'total_spend' => 5000.00,
            'total_revenue' => 15000.00,
            'avg_cpc' => 2.50,
            'avg_conversion_rate' => 3.5
        ];
    }

    protected function getInternalInstancesData(array $filters): array
    {
        // Em produção, isso viria do repositório de instâncias
        return [
            'summary' => [
                'total_instances' => 25,
                'active_instances' => 20,
                'inactive_instances' => 5,
            ],
            'metrics' => [
                'avg_daily_usage' => 150,
                'total_api_calls' => 15000,
                'storage_used_gb' => 45.5,
            ]
        ];
    }

    protected function calculateConversionMetrics(array $gaData, array $leadsData): array
    {
        $totalUsers = $gaData['summary']['total_users'] ?? 1;
        $totalLeads = $leadsData['total_leads'] ?? 0;

        return [
            'visitor_to_lead_rate' => ($totalLeads / $totalUsers) * 100,
            'cost_per_lead' => $totalUsers > 0 ? 100 / ($totalLeads / $totalUsers) : 0,
            'lead_quality_distribution' => $leadsData['sources'] ?? []
        ];
    }

    protected function calculateLeadQualityScore(array $leadsData): float
    {
        $qualifiedLeads = $leadsData['qualified_leads'] ?? 0;
        $totalLeads = $leadsData['total_leads'] ?? 1;

        return ($qualifiedLeads / $totalLeads) * 100;
    }

    protected function calculateCampaignROI(array $campaignData, array $gaData): array
    {
        $spend = $campaignData['total_spend'] ?? 1;
        $revenue = $campaignData['total_revenue'] ?? 0;

        return [
            'roi_percentage' => (($revenue - $spend) / $spend) * 100,
            'revenue_per_visit' => $revenue / max($gaData['summary']['total_sessions'] ?? 1, 1),
            'cost_per_acquisition' => $spend / max($campaignData['avg_conversion_rate'] ?? 1, 1)
        ];
    }

    protected function generateOptimizationSuggestions(array $campaignData): array
    {
        $suggestions = [];

        if (($campaignData['avg_conversion_rate'] ?? 0) < 2.0) {
            $suggestions[] = 'Considere otimizar as landing pages para melhorar a conversão';
        }

        if (($campaignData['avg_cpc'] ?? 0) > 3.0) {
            $suggestions[] = 'Revise as palavras-chave para reduzir o CPC médio';
        }

        return $suggestions;
    }

    protected function analyzeUsagePatterns(array $instancesData): array
    {
        return [
            'peak_usage_time' => '14:00-16:00',
            'most_used_features' => ['AI Generation', 'Social Publishing', 'Analytics'],
            'user_engagement_level' => 'high'
        ];
    }

    protected function calculateGrowthTrends(array $instancesData): array
    {
        return [
            'monthly_growth_rate' => 15.5,
            'projected_next_month' => $instancesData['summary']['total_instances'] * 1.155,
            'growth_trajectory' => 'accelerating'
        ];
    }

    /**
     * Processa dados brutos para gerar métricas analíticas.
     *
     * @param string $metricName o nome da métrica
     * @param mixed  $value      o valor da métrica
     * @param int    $instanceId o ID da instância do universo
     * @param int    $userId     o ID do usuário
     *
     * @return UniverseAnalytics
     */
    public function recordMetric(string $metricName, mixed $value, int $instanceId, int $userId): UniverseAnalytics
    {
        $analytics = new UniverseAnalytics([
            'metric_name' => $metricName,
            'value' => $value,
            'timestamp' => now(),
            'instance_id' => $instanceId,
            'user_id' => $userId,
        ]);
        $analytics->save();
        Log::info("Métrica de BI registrada: {$metricName} = {$value} para instância ID: {$instanceId}.");
        return $analytics;
    }
}
