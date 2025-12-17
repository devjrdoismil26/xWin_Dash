<?php

namespace App\Domains\Dashboard\Repositories;

use App\Domains\Dashboard\Domain\DashboardWidget;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardWidgetModel;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * DashboardWidgetRepository
 * 
 * Repository for managing dashboard widgets data.
 * Handles data retrieval from database, external APIs, and cache.
 * 
 * Note: This repository focuses on widget data retrieval.
 * The infrastructure repository handles CRUD operations.
 */
class DashboardWidgetRepository
{
    protected string $cachePrefix = 'dashboard:widget:data:';
    protected int $cacheTtl = 300; // 5 minutes for data

    /**
     * Get widget data from external API or database
     * 
     * @param DashboardWidget|DashboardWidgetModel|string $widget Widget object or widget ID
     * @return array Widget data
     */
    public function getWidgetData($widget): array
    {
        try {
            // Resolve widget if ID is provided
            if (is_string($widget)) {
                $widgetModel = DashboardWidgetModel::find($widget);
                if (!$widgetModel) {
                    return [];
                }
                $widget = $widgetModel;
            }

            // Get widget ID
            $widgetId = $widget instanceof DashboardWidgetModel ? $widget->id : $widget->id;
            $widgetType = $widget instanceof DashboardWidgetModel ? $widget->type : $widget->type;
            $config = $widget instanceof DashboardWidgetModel ? ($widget->config ?? []) : ($widget->config ?? []);
            $projectId = $widget instanceof DashboardWidgetModel ? ($widget->project_id ?? null) : ($widget->projectId ?? null);

            $cacheKey = $this->cachePrefix . $widgetId;
            
            return Cache::remember($cacheKey, $this->cacheTtl, function () use ($widgetType, $config, $projectId, $widgetId) {
                // Get data based on widget type
                return match ($widgetType) {
                    'metrics', 'metric' => $this->getMetricsData($config, $projectId),
                    'chart' => $this->getChartData($config, $projectId),
                    'table' => $this->getTableData($config, $projectId),
                    'activity', 'list' => $this->getActivityData($projectId),
                    'leads' => $this->getLeadsData($projectId),
                    'analytics' => $this->getAnalyticsData($projectId),
                    'workflows' => $this->getWorkflowsData($projectId),
                    'projects' => $this->getProjectsData($projectId),
                    default => $this->getDefaultData($widgetType, $widgetId)
                };
            });
        } catch (\Exception $e) {
            Log::error("DashboardWidgetRepository::getWidgetData - error", [
                'widget_id' => is_string($widget) ? $widget : ($widget->id ?? 'unknown'),
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Get metrics data
     */
    protected function getMetricsData(array $config, ?string $projectId): array
    {
        $metrics = $config['metrics'] ?? ['total_leads', 'total_projects', 'total_workflows'];
        $projectId = $projectId ?? session('selected_project_id');

        $data = [];
        foreach ($metrics as $metric) {
            $data[$metric] = $this->fetchMetricValue($metric, $projectId);
        }

        return $data;
    }

    /**
     * Get chart data
     */
    protected function getChartData(array $config, ?string $projectId): array
    {
        $chartType = $config['chart_type'] ?? 'line';
        $dataSource = $config['data_source'] ?? null;
        $period = $config['period'] ?? '30d';
        $projectId = $projectId ?? session('selected_project_id');

        if ($dataSource) {
            return $this->fetchDataSourceData($dataSource, $chartType, $period, $projectId);
        }

        // Default: return empty chart structure
        return [
            'type' => $chartType,
            'labels' => [],
            'datasets' => []
        ];
    }

    /**
     * Get table data
     */
    protected function getTableData(array $config, ?string $projectId): array
    {
        $tableSource = $config['table_source'] ?? 'leads';
        $limit = $config['limit'] ?? 10;
        $projectId = $projectId ?? session('selected_project_id');

        return match ($tableSource) {
            'leads' => $this->getLeadsTableData($projectId, $limit),
            'activities' => $this->getActivitiesTableData($projectId, $limit),
            'workflows' => $this->getWorkflowsTableData($projectId, $limit),
            default => []
        };
    }

    /**
     * Get activity data
     */
    protected function getActivityData(?string $projectId): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            
            return DB::table('activities')
                ->where('project_id', $projectId)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'type' => $activity->type ?? 'unknown',
                        'description' => $activity->description ?? '',
                        'created_at' => $activity->created_at
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de atividade: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get leads data
     */
    protected function getLeadsData(?string $projectId): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            
            return [
                'total' => DB::table('leads')->where('project_id', $projectId)->count(),
                'new' => DB::table('leads')->where('project_id', $projectId)->where('status', 'new')->count(),
                'qualified' => DB::table('leads')->where('project_id', $projectId)->where('status', 'qualified')->count(),
                'converted' => DB::table('leads')->where('project_id', $projectId)->where('status', 'converted')->count(),
                'lost' => DB::table('leads')->where('project_id', $projectId)->where('status', 'lost')->count(),
            ];
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de leads: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get analytics data
     */
    protected function getAnalyticsData(?string $projectId): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            
            return DB::table('analytics_events')
                ->where('project_id', $projectId)
                ->where('created_at', '>=', now()->subDays(30))
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'date' => $item->date,
                        'count' => $item->count
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de analytics: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get workflows data
     */
    protected function getWorkflowsData(?string $projectId): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            
            return [
                'total' => DB::table('workflows')->where('project_id', $projectId)->count(),
                'active' => DB::table('workflows')->where('project_id', $projectId)->where('is_active', true)->count(),
                'paused' => DB::table('workflows')->where('project_id', $projectId)->where('is_active', false)->count(),
            ];
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de workflows: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get projects data
     */
    protected function getProjectsData(?string $projectId): array
    {
        try {
            return [
                'total' => DB::table('projects')->count(),
                'active' => DB::table('projects')->where('is_active', true)->count(),
            ];
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de projetos: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get leads table data
     */
    protected function getLeadsTableData(?string $projectId, int $limit): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            
            return DB::table('leads')
                ->where('project_id', $projectId)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($lead) {
                    return [
                        'id' => $lead->id,
                        'name' => $lead->name,
                        'email' => $lead->email,
                        'status' => $lead->status,
                        'score' => $lead->score ?? 0,
                        'created_at' => $lead->created_at
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de tabela de leads: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get activities table data
     */
    protected function getActivitiesTableData(?string $projectId, int $limit): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            
            return DB::table('activities')
                ->where('project_id', $projectId)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de tabela de atividades: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get workflows table data
     */
    protected function getWorkflowsTableData(?string $projectId, int $limit): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            
            return DB::table('workflows')
                ->where('project_id', $projectId)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de tabela de workflows: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get default data
     */
    protected function getDefaultData(string $widgetType, string $widgetId): array
    {
        return [
            'message' => 'Widget data not configured',
            'widget_id' => $widgetId,
            'widget_type' => $widgetType
        ];
    }

    /**
     * Fetch metric value
     */
    protected function fetchMetricValue(string $metric, ?string $projectId): mixed
    {
        $projectId = $projectId ?? session('selected_project_id');

        try {
            return match ($metric) {
                'total_leads' => DB::table('leads')->where('project_id', $projectId)->count(),
                'total_projects' => DB::table('projects')->where('id', $projectId)->exists() ? 1 : DB::table('projects')->count(),
                'total_workflows' => DB::table('workflows')->where('project_id', $projectId)->count(),
                'total_activities' => DB::table('activities')->where('project_id', $projectId)->count(),
                'active_workflows' => DB::table('workflows')->where('project_id', $projectId)->where('is_active', true)->count(),
                default => 0
            };
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar métrica {$metric}: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Fetch data from external source
     */
    protected function fetchDataSourceData(string $dataSource, string $chartType, string $period, ?string $projectId): array
    {
        // This would integrate with external APIs
        // For now, return structure based on data source
        Log::info("Fetching data from source: {$dataSource}", [
            'chart_type' => $chartType,
            'period' => $period
        ]);

        // Calculate days from period
        $days = match ($period) {
            '7d' => 7,
            '30d' => 30,
            '90d' => 90,
            '1y' => 365,
            default => 30
        };

        try {
            $projectId = $projectId ?? session('selected_project_id');
            
            // Generate labels (dates)
            $labels = [];
            $datasets = [];
            
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $labels[] = $date;
            }

            // Fetch data based on source
            $data = match ($dataSource) {
                'leads' => $this->getLeadsChartData($projectId, $days),
                'analytics' => $this->getAnalyticsChartData($projectId, $days),
                'workflows' => $this->getWorkflowsChartData($projectId, $days),
                default => array_fill(0, $days, 0)
            };

            $datasets[] = [
                'label' => ucfirst($dataSource),
                'data' => $data
            ];

            return [
                'type' => $chartType,
                'labels' => $labels,
                'datasets' => $datasets
            ];
        } catch (\Exception $e) {
            Log::warning("Erro ao buscar dados de fonte externa: " . $e->getMessage());
            return [
                'type' => $chartType,
                'labels' => [],
                'datasets' => []
            ];
        }
    }

    /**
     * Get leads chart data
     */
    protected function getLeadsChartData(?string $projectId, int $days): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            $data = [];
            
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i)->startOfDay();
                $count = DB::table('leads')
                    ->where('project_id', $projectId)
                    ->whereDate('created_at', $date)
                    ->count();
                $data[] = $count;
            }
            
            return $data;
        } catch (\Exception $e) {
            return array_fill(0, $days, 0);
        }
    }

    /**
     * Get analytics chart data
     */
    protected function getAnalyticsChartData(?string $projectId, int $days): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            $data = [];
            
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i)->startOfDay();
                $count = DB::table('analytics_events')
                    ->where('project_id', $projectId)
                    ->whereDate('created_at', $date)
                    ->count();
                $data[] = $count;
            }
            
            return $data;
        } catch (\Exception $e) {
            return array_fill(0, $days, 0);
        }
    }

    /**
     * Get workflows chart data
     */
    protected function getWorkflowsChartData(?string $projectId, int $days): array
    {
        try {
            $projectId = $projectId ?? session('selected_project_id');
            $data = [];
            
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = now()->subDays($i)->startOfDay();
                $count = DB::table('workflow_executions')
                    ->where('project_id', $projectId)
                    ->whereDate('started_at', $date)
                    ->count();
                $data[] = $count;
            }
            
            return $data;
        } catch (\Exception $e) {
            return array_fill(0, $days, 0);
        }
    }

    /**
     * Invalidate widget data cache
     */
    public function invalidateCache(string $widgetId): void
    {
        Cache::forget($this->cachePrefix . $widgetId);
    }
}
