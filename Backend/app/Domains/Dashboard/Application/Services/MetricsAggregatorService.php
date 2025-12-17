<?php

namespace App\Domains\Dashboard\Application\Services;

use Illuminate\Support\Facades\Cache;

class MetricsAggregatorService
{
    public function getAggregatedMetrics(string $userId, ?string $projectId = null): array
    {
        $cacheKey = "dashboard_metrics_{$userId}" . ($projectId ? "_{$projectId}" : '');
        
        return Cache::remember($cacheKey, 300, function () use ($userId, $projectId) {
            $baseQuery = function ($table) use ($userId, $projectId) {
                $query = \DB::table($table)->where('user_id', $userId);
                if ($projectId) {
                    $query->where('project_id', $projectId);
                }
                return $query;
            };
            
            return [
                'total_projects' => $this->getTotalProjects($userId, $projectId),
                'total_leads' => $this->getTotalLeads($userId, $projectId),
                'total_products' => $this->getTotalProducts($userId, $projectId),
                'active_workflows' => $this->getActiveWorkflows($userId, $projectId),
                'recent_activities' => $this->getRecentActivities($userId, $projectId),
                'conversion_rate' => $this->getConversionRate($userId, $projectId),
                'revenue' => $this->getRevenue($userId, $projectId),
                'growth_metrics' => $this->getGrowthMetrics($userId, $projectId),
                'timestamp' => now()->toIso8601String()
            ];
        });
    }

    private function getTotalProjects(string $userId, ?string $projectId = null): int
    {
        try {
            // Otimização: usar índice composto (user_id, project_id)
            $query = \DB::table('projects')
                ->where('user_id', $userId);
            if ($projectId) {
                $query->where('id', $projectId);
            }
            // Usar select específico para melhor performance
            return $query->selectRaw('COUNT(*) as total')->value('total') ?? 0;
        } catch (\Exception $e) {
            \Log::warning("Erro ao obter total de projetos: " . $e->getMessage());
            return 0;
        }
    }

    private function getTotalLeads(string $userId, ?string $projectId = null): int
    {
        try {
            // Otimização: usar índice composto (user_id, project_id)
            $query = \DB::table('leads')
                ->where('user_id', $userId);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            // Usar select específico para melhor performance
            return $query->selectRaw('COUNT(*) as total')->value('total') ?? 0;
        } catch (\Exception $e) {
            \Log::warning("Erro ao obter total de leads: " . $e->getMessage());
            return 0;
        }
    }

    private function getTotalProducts(string $userId, ?string $projectId = null): int
    {
        try {
            // Otimização: usar índice composto (user_id, project_id)
            $query = \DB::table('products')
                ->where('user_id', $userId);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            // Usar select específico para melhor performance
            return $query->selectRaw('COUNT(*) as total')->value('total') ?? 0;
        } catch (\Exception $e) {
            \Log::warning("Erro ao obter total de produtos: " . $e->getMessage());
            return 0;
        }
    }

    private function getActiveWorkflows(string $userId, ?string $projectId = null): int
    {
        try {
            // Otimização: usar índice composto (user_id, is_active, project_id)
            $query = \DB::table('workflows')
                ->where('user_id', $userId)
                ->where('is_active', true);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            // Usar select específico para melhor performance
            return $query->selectRaw('COUNT(*) as total')->value('total') ?? 0;
        } catch (\Exception $e) {
            \Log::warning("Erro ao obter workflows ativos: " . $e->getMessage());
            return 0;
        }
    }

    private function getRecentActivities(string $userId, ?string $projectId = null): array
    {
        try {
            // Otimização: usar índice composto (user_id, project_id, created_at)
            // Selecionar apenas campos necessários
            $query = \DB::table('activity_logs')
                ->select('id', 'type', 'description', 'created_at')
                ->where('user_id', $userId);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            
            $activities = $query
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
            
            return $activities;
        } catch (\Exception $e) {
            \Log::warning("Erro ao obter atividades recentes: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get conversion rate
     * Otimização: usar uma única query com agregação condicional
     */
    private function getConversionRate(string $userId, ?string $projectId = null): float
    {
        try {
            // Otimização: calcular em uma única query usando SUM condicional
            $query = \DB::table('leads')
                ->where('user_id', $userId);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            
            // Calcular total e convertidos em uma única query
            $result = $query->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "converted" THEN 1 ELSE 0 END) as converted
            ')->first();
            
            $total = $result->total ?? 0;
            $converted = $result->converted ?? 0;
            
            return $total > 0 ? round(($converted / $total) * 100, 2) : 0.0;
        } catch (\Exception $e) {
            \Log::warning("Erro ao calcular taxa de conversão: " . $e->getMessage());
            return 0.0;
        }
    }

    /**
     * Get revenue
     * Otimização: usar SUM direto com índice
     */
    private function getRevenue(string $userId, ?string $projectId = null): float
    {
        try {
            // Otimização: usar índice composto (user_id, project_id, value)
            $query = \DB::table('leads')
                ->where('user_id', $userId)
                ->whereNotNull('value');
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            
            // Usar COALESCE para evitar null
            return (float) ($query->selectRaw('COALESCE(SUM(value), 0) as total')->value('total') ?? 0.0);
        } catch (\Exception $e) {
            \Log::warning("Erro ao calcular receita: " . $e->getMessage());
            return 0.0;
        }
    }

    /**
     * Get growth metrics
     * Otimização: calcular ambos os meses em uma única query
     */
    private function getGrowthMetrics(string $userId, ?string $projectId = null): array
    {
        try {
            $now = now();
            $lastMonth = $now->copy()->subMonth();
            $currentMonthStart = $now->copy()->startOfMonth();
            $lastMonthStart = $lastMonth->copy()->startOfMonth();
            $lastMonthEnd = $lastMonth->copy()->endOfMonth();
            
            // Otimização: calcular ambos os meses em uma única query usando SUM condicional
            $query = \DB::table('leads')
                ->where('user_id', $userId);
            if ($projectId) {
                $query->where('project_id', $projectId);
            }
            
            $result = $query->selectRaw('
                SUM(CASE 
                    WHEN created_at >= ? AND created_at < ? THEN 1 
                    ELSE 0 
                END) as current_month,
                SUM(CASE 
                    WHEN created_at >= ? AND created_at <= ? THEN 1 
                    ELSE 0 
                END) as last_month
            ', [
                $currentMonthStart->toDateTimeString(),
                $now->toDateTimeString(),
                $lastMonthStart->toDateTimeString(),
                $lastMonthEnd->toDateTimeString()
            ])->first();
            
            $currentMonth = (int) ($result->current_month ?? 0);
            $lastMonthCount = (int) ($result->last_month ?? 0);
            
            $growth = $lastMonthCount > 0 
                ? round((($currentMonth - $lastMonthCount) / $lastMonthCount) * 100, 2)
                : ($currentMonth > 0 ? 100.0 : 0.0);
            
            return [
                'current_month' => $currentMonth,
                'last_month' => $lastMonthCount,
                'growth_percentage' => $growth
            ];
        } catch (\Exception $e) {
            \Log::warning("Erro ao calcular métricas de crescimento: " . $e->getMessage());
            return [
                'current_month' => 0,
                'last_month' => 0,
                'growth_percentage' => 0.0
            ];
        }
    }

    public function clearCache(string $userId, ?string $projectId = null): void
    {
        $cacheKey = "dashboard_metrics_{$userId}" . ($projectId ? "_{$projectId}" : '');
        Cache::forget($cacheKey);
    }
}
