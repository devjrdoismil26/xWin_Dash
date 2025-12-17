<?php

namespace App\Domains\Dashboard\Services;

use App\Domains\Analytics\Services\AnalyticsService;
use App\Domains\Leads\Models\Lead;
use App\Domains\Leads\Models\Segment;
use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB as DatabaseFacade;
use Illuminate\Support\Facades\Storage;
use League\Csv\Writer;

class DashboardService
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function getOverviewMetrics()
    {
        // Cache válido por 24 horas, mas será limpo pelo Listener quando um lead for criado.
        return Cache::remember('dashboard.overview_metrics', 86400, function () {
            $totalLeads = Lead::count();
            $totalProjects = Project::count();
            // Adicione outras métricas conforme necessário

            return [
                'total_leads' => $totalLeads,
                'total_projects' => $totalProjects,
                // ...
            ];
        });
    }

    public function getLeadsTrend(int $days)
    {
        return Cache::remember("dashboard.leads_trend_{$days}", 86400, function () use ($days) {
            $startDate = Carbon::now()->subDays($days);

            $leadsTrend = Lead::selectRaw('DATE(created_at) as date, count(*) as count')
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return $leadsTrend;
        });
    }

    public function getSegmentGrowth(int $days)
    {
        return Cache::remember("dashboard.segment_growth_{$days}", 86400, function () use ($days) {
            $startDate = Carbon::now()->subDays($days);

            $segmentGrowth = DatabaseFacade::table('lead_segment')
                ->join('segments', 'lead_segment.segment_id', '=', 'segments.id')
                ->selectRaw('segments.name as segment_name, DATE(lead_segment.created_at) as date, count(*) as count')
                ->where('lead_segment.created_at', '>=', $startDate)
                ->groupBy('segment_name', 'date')
                ->orderBy('date')
                ->get();

            return $segmentGrowth;
        });
    }

    public function getScoreDistribution()
    {
        return Cache::remember('dashboard.score_distribution', 86400, function () {
            return $this->analyticsService->getLeadsByScoreRange();
        });
    }

    public function getProjectsStats()
    {
        return Cache::remember('dashboard.projects_stats', 86400, function () {
            $projectsByStatus = Project::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->get();

            return $projectsByStatus;
        });
    }

    /**
     * Export dashboard data based on user permissions.
     *
     * @param \App\Domains\Users\Models\User $user
     *
     * @return string the path to the generated CSV file
     */
    public function exportDashboardData(User $user): string
    {
        $csv = Writer::createFromString('');

        // Add headers for the export. This can be customized based on what data is being exported.
        $csv->insertOne([
            'Tipo de Dado', 'Métrica', 'Valor',
        ]);

        // Fetch overview metrics
        $overviewMetrics = $this->getOverviewMetrics();
        foreach ($overviewMetrics as $key => $value) {
            $csv->insertOne(['Visão Geral', ucfirst(str_replace('_', ' ', $key)), $value]);
        }

        // Fetch leads trend (last 30 days for example)
        $leadsTrend = $this->getLeadsTrend(30);
        foreach ($leadsTrend as $dataPoint) {
            $csv->insertOne(['Tendência de Leads', $dataPoint->date, $dataPoint->count]);
        }

        // Fetch segment growth (last 30 days for example)
        $segmentGrowth = $this->getSegmentGrowth(30);
        foreach ($segmentGrowth as $dataPoint) {
            $csv->insertOne(['Crescimento de Segmentos', $dataPoint
                ->segment_name . ' (' . $dataPoint->date . ')', $dataPoint->count]);
        }

        // Fetch score distribution
        $scoreDistribution = $this->getScoreDistribution();
        foreach ($scoreDistribution as $range => $count) {
            $csv->insertOne(['Distribuição de Pontuação', $range, $count]);
        }

        // Fetch projects stats
        $projectsStats = $this->getProjectsStats();
        foreach ($projectsStats as $stat) {
            $csv->insertOne(['Estatísticas de Projetos', $stat->status, $stat->count]);
        }

        $filename = 'dashboard_export_' . now()->format('Y-m-d-His') . '.csv';
        Storage::put('exports/' . $filename, $csv->getContent());

        return storage_path('app/exports/' . $filename);
    }

    public function getUserDashboard($userId): void
    {
        // Lógica para obter o dashboard de um usuário
    }

    public function updateWidgetConfig($widgetId, $config): void
    {
        // Lógica para atualizar a configuração de um widget
    }
}
