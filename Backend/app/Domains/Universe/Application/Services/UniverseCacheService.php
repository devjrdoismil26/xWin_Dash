<?php

namespace App\Domains\Universe\Application\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

/**
 * Service para cache do módulo Universe
 * Otimiza performance com cache inteligente
 */
class UniverseCacheService
{
    protected int $defaultTtl = 3600; // 1 hora
    protected string $prefix = 'universe:';

    /**
     * Cache de templates populares
     */
    public function getPopularTemplates(int $limit = 10): array
    {
        $key = $this->prefix . 'templates:popular:' . $limit;
        
        return Cache::remember($key, $this->defaultTtl, function () use ($limit) {
            try {
                return \DB::table('universe_templates')
                    ->where('is_public', true)
                    ->orderBy('usage_count', 'desc')
                    ->limit($limit)
                    ->get()
                    ->map(function ($template) {
                        return [
                            'id' => $template->id,
                            'name' => $template->name,
                            'category' => $template->category,
                            'usage_count' => $template->usage_count ?? 0
                        ];
                    })
                    ->toArray();
            } catch (\Exception $e) {
                \Log::warning("Erro ao buscar templates populares: " . $e->getMessage());
                return [];
            }
        }) ?? [];
    }

    /**
     * Cache de estatísticas do usuário
     */
    public function getUserStats(string $userId): array
    {
        $key = $this->prefix . 'user:stats:' . $userId;
        
        return Cache::remember($key, 1800, function () use ($userId) {
            try {
                $totalInstances = \DB::table('universe_instances')
                    ->where('user_id', $userId)
                    ->count();
                
                $activeInstances = \DB::table('universe_instances')
                    ->where('user_id', $userId)
                    ->where('is_active', true)
                    ->count();
                
                $totalTemplates = \DB::table('universe_templates')
                    ->where('user_id', $userId)
                    ->count();
                
                $recentActivity = \DB::table('universe_instances')
                    ->where('user_id', $userId)
                    ->orderBy('updated_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($instance) {
                        return [
                            'id' => $instance->id,
                            'name' => $instance->name,
                            'updated_at' => $instance->updated_at
                        ];
                    })
                    ->toArray();
                
                return [
                    'total_instances' => $totalInstances,
                    'active_instances' => $activeInstances,
                    'total_templates' => $totalTemplates,
                    'recent_activity' => $recentActivity
                ];
            } catch (\Exception $e) {
                \Log::warning("Erro ao calcular estatísticas do usuário: " . $e->getMessage());
                return [
                    'total_instances' => 0,
                    'active_instances' => 0,
                    'total_templates' => 0,
                    'recent_activity' => []
                ];
            }
        }) ?? [];
    }

    /**
     * Cache de configurações do sistema
     */
    public function getSystemConfig(): array
    {
        $key = $this->prefix . 'system:config';
        
        return Cache::remember($key, 7200, function () {
            return [
                'categories' => ['business', 'marketing', 'analytics', 'automation'],
                'difficulties' => ['iniciante', 'intermediario', 'avancado'],
                'features' => ['ai', 'analytics', 'automation', 'integrations']
            ];
        }) ?? [];
    }

    /**
     * Cache de instâncias por projeto
     */
    public function getProjectInstances(string $projectId): array
    {
        $key = $this->prefix . 'project:instances:' . $projectId;
        
        return Cache::remember($key, 1800, function () use ($projectId) {
            try {
                return \DB::table('universe_instances')
                    ->where('project_id', $projectId)
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($instance) {
                        return [
                            'id' => $instance->id,
                            'name' => $instance->name,
                            'type' => $instance->type,
                            'is_active' => $instance->is_active ?? false,
                            'created_at' => $instance->created_at
                        ];
                    })
                    ->toArray();
            } catch (\Exception $e) {
                \Log::warning("Erro ao buscar instâncias do projeto: " . $e->getMessage());
                return [];
            }
        }) ?? [];
    }

    /**
     * Cache com tags para invalidação inteligente
     */
    public function rememberWithTags(string $key, int $ttl, callable $callback, array $tags = []): mixed
    {
        $cacheKey = $this->prefix . $key;
        
        return Cache::tags(array_merge(['universe'], $tags))->remember($cacheKey, $ttl, $callback);
    }

    /**
     * Invalida cache por tags
     */
    public function invalidateByTags(array $tags): void
    {
        try {
            Cache::tags(array_merge(['universe'], $tags))->flush();
            Log::info('Universe cache invalidated by tags', ['tags' => $tags]);
        } catch (\Exception $e) {
            Log::warning('Failed to invalidate cache by tags', [
                'tags' => $tags,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Invalida cache específico
     */
    public function invalidateCache(string $pattern): void
    {
        if (config('cache.default') === 'redis') {
            $keys = Redis::keys($this->prefix . $pattern . '*');
            if (!empty($keys)) {
                Redis::del($keys);
            }
        } else {
            Cache::forget($this->prefix . $pattern);
        }
    }

    /**
     * Invalida cache do usuário
     */
    public function invalidateUserCache(string $userId): void
    {
        $this->invalidateCache('user:' . $userId);
    }

    /**
     * Invalida cache do projeto
     */
    public function invalidateProjectCache(string $projectId): void
    {
        $this->invalidateCache('project:' . $projectId);
    }

    /**
     * Cache de templates por categoria
     */
    public function getTemplatesByCategory(string $category): array
    {
        $key = $this->prefix . 'templates:category:' . $category;
        
        return Cache::remember($key, $this->defaultTtl, function () use ($category) {
            try {
                return \DB::table('universe_templates')
                    ->where('category', $category)
                    ->where('is_public', true)
                    ->orderBy('usage_count', 'desc')
                    ->get()
                    ->map(function ($template) {
                        return [
                            'id' => $template->id,
                            'name' => $template->name,
                            'category' => $template->category,
                            'difficulty' => $template->difficulty ?? 'beginner',
                            'usage_count' => $template->usage_count ?? 0
                        ];
                    })
                    ->toArray();
            } catch (\Exception $e) {
                \Log::warning("Erro ao buscar templates por categoria: " . $e->getMessage());
                return [];
            }
        }) ?? [];
    }

    /**
     * Cache de analytics
     */
    public function getAnalytics(string $instanceId, string $period = '7d'): array
    {
        $key = $this->prefix . 'analytics:' . $instanceId . ':' . $period;
        
        return Cache::remember($key, 900, function () use ($instanceId, $period) {
            try {
                // Calcular período
                $days = match($period) {
                    '1d' => 1,
                    '7d' => 7,
                    '30d' => 30,
                    '90d' => 90,
                    default => 7
                };
                
                $startDate = now()->subDays($days);
                
                // Buscar analytics da instância
                $views = \DB::table('universe_analytics')
                    ->where('instance_id', $instanceId)
                    ->where('created_at', '>=', $startDate)
                    ->where('event_type', 'view')
                    ->count();
                
                $interactions = \DB::table('universe_analytics')
                    ->where('instance_id', $instanceId)
                    ->where('created_at', '>=', $startDate)
                    ->where('event_type', 'interaction')
                    ->count();
                
                // Calcular performance (taxa de interação)
                $performance = $views > 0 ? round(($interactions / $views) * 100, 2) : 0;
                
                // Buscar tendências (últimos 7 dias)
                $trends = \DB::table('universe_analytics')
                    ->where('instance_id', $instanceId)
                    ->where('created_at', '>=', now()->subDays(7))
                    ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get()
                    ->map(fn($item) => ['date' => $item->date, 'count' => $item->count])
                    ->toArray();
                
                return [
                    'views' => $views,
                    'interactions' => $interactions,
                    'performance' => $performance,
                    'trends' => $trends
                ];
            } catch (\Exception $e) {
                \Log::warning("Erro ao calcular analytics: " . $e->getMessage());
                return [
                    'views' => 0,
                    'interactions' => 0,
                    'performance' => 0,
                    'trends' => []
                ];
            }
        }) ?? [];
    }

    /**
     * Warm up cache
     */
    public function warmUpCache(): void
    {
        // Pre-carrega dados importantes
        $this->getPopularTemplates();
        $this->getSystemConfig();
        
        // Cache de templates por categoria
        $categories = ['business', 'marketing', 'analytics', 'automation'];
        foreach ($categories as $category) {
            $this->getTemplatesByCategory($category);
        }
    }
}