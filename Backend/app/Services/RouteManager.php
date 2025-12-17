<?php

namespace App\Services;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

/**
 * 🚀 ROUTE MANAGER - Sistema de Gerenciamento Centralizado de Rotas
 * 
 * Gerencia carregamento, cache e performance de rotas de forma otimizada
 */
class RouteManager
{
    /**
     * Módulos disponíveis e suas configurações
     */
    protected array $modules = [
        'core' => ['priority' => 1, 'always_load' => true],
        'auth' => ['priority' => 1, 'always_load' => true],
        'dashboard' => ['priority' => 2, 'always_load' => false],
        'projects' => ['priority' => 2, 'always_load' => false],
        'users' => ['priority' => 2, 'always_load' => false],
        'workflows' => ['priority' => 3, 'always_load' => false],
        'universe' => ['priority' => 3, 'always_load' => false],
        'activity' => ['priority' => 4, 'always_load' => false],
        'analytics' => ['priority' => 4, 'always_load' => false],
        'email_marketing' => ['priority' => 5, 'always_load' => false],
        'ai' => ['priority' => 5, 'always_load' => false],
        'aura' => ['priority' => 5, 'always_load' => false],
        'social_buffer' => ['priority' => 6, 'always_load' => false],
        'leads' => ['priority' => 6, 'always_load' => false],
        'products' => ['priority' => 6, 'always_load' => false],
        'categorization' => ['priority' => 7, 'always_load' => false],
        'integrations' => ['priority' => 7, 'always_load' => false],
        'nodered' => ['priority' => 7, 'always_load' => false],
    ];

    /**
     * Cache key para rotas
     */
    protected string $cacheKey = 'route_manager_cache';

    /**
     * Cache duration em minutos
     */
    protected int $cacheDuration = 60;

    /**
     * Carregar todas as rotas de forma otimizada
     */
    public function loadAllRoutes(): void
    {
        // Verificar se deve usar cache
        if ($this->shouldUseCache()) {
            $this->loadFromCache();
            return;
        }

        // Carregar módulos por prioridade
        $this->loadModulesByPriority();

        // Cachear se necessário
        if ($this->shouldCache()) {
            $this->cacheRoutes();
        }
    }

    /**
     * Carregar módulos por prioridade
     */
    protected function loadModulesByPriority(): void
    {
        // Ordenar módulos por prioridade
        $sortedModules = $this->getSortedModules();

        foreach ($sortedModules as $module => $config) {
            if ($this->shouldLoadModule($module)) {
                $this->loadModule($module);
            }
        }
    }

    /**
     * Verificar se deve carregar um módulo
     */
    protected function shouldLoadModule(string $module): bool
    {
        // Módulos essenciais sempre carregam
        if ($this->modules[$module]['always_load']) {
            return true;
        }

        // Verificar configuração do módulo
        return Config::get("modules.{$module}.enabled", true);
    }

    /**
     * Carregar um módulo específico
     */
    protected function loadModule(string $module): void
    {
        $modulePath = base_path("routes/modules/{$module}.php");
        
        if (file_exists($modulePath)) {
            require $modulePath;
            
            // Log de carregamento (apenas em debug)
            if (Config::get('app.debug')) {
                \Log::info("RouteManager: Módulo '{$module}' carregado com sucesso");
            }
        }
    }

    /**
     * Obter módulos ordenados por prioridade
     */
    protected function getSortedModules(): array
    {
        $modules = $this->modules;
        
        uasort($modules, function ($a, $b) {
            return $a['priority'] <=> $b['priority'];
        });

        return $modules;
    }

    /**
     * Verificar se deve usar cache
     */
    protected function shouldUseCache(): bool
    {
        return !Config::get('app.debug') && Cache::has($this->cacheKey);
    }

    /**
     * Verificar se deve cachear
     */
    protected function shouldCache(): bool
    {
        return !Config::get('app.debug');
    }

    /**
     * Carregar rotas do cache
     */
    protected function loadFromCache(): void
    {
        $cachedRoutes = Cache::get($this->cacheKey);
        
        if ($cachedRoutes) {
            foreach ($cachedRoutes as $route) {
                Route::{$route['method']}($route['uri'], $route['action'])
                    ->name($route['name'] ?? null);
            }
        }
    }

    /**
     * Cachear rotas
     */
    protected function cacheRoutes(): void
    {
        $routes = [];
        
        foreach (Route::getRoutes() as $route) {
            $routes[] = [
                'method' => $route->methods()[0] ?? 'GET',
                'uri' => $route->uri(),
                'action' => $route->getActionName(),
                'name' => $route->getName(),
            ];
        }

        Cache::put($this->cacheKey, $routes, $this->cacheDuration);
    }

    /**
     * Limpar cache de rotas
     */
    public function clearCache(): void
    {
        Cache::forget($this->cacheKey);
    }

    /**
     * Obter estatísticas de rotas
     */
    public function getRouteStats(): array
    {
        $stats = [
            'total_routes' => count(Route::getRoutes()),
            'modules_loaded' => 0,
            'modules_enabled' => 0,
            'cache_status' => Cache::has($this->cacheKey) ? 'cached' : 'not_cached',
        ];

        foreach ($this->modules as $module => $config) {
            if ($this->shouldLoadModule($module)) {
                $stats['modules_loaded']++;
            }
            
            if (Config::get("modules.{$module}.enabled", true)) {
                $stats['modules_enabled']++;
            }
        }

        return $stats;
    }

    /**
     * Obter informações de um módulo específico
     */
    public function getModuleInfo(string $module): array
    {
        if (!isset($this->modules[$module])) {
            return ['error' => 'Módulo não encontrado'];
        }

        return [
            'module' => $module,
            'priority' => $this->modules[$module]['priority'],
            'always_load' => $this->modules[$module]['always_load'],
            'enabled' => Config::get("modules.{$module}.enabled", true),
            'file_exists' => file_exists(base_path("routes/modules/{$module}.php")),
        ];
    }

    /**
     * Habilitar/desabilitar um módulo
     */
    public function toggleModule(string $module, bool $enabled): bool
    {
        if (!isset($this->modules[$module])) {
            return false;
        }

        // Atualizar configuração
        Config::set("modules.{$module}.enabled", $enabled);

        // Limpar cache
        $this->clearCache();

        return true;
    }

    /**
     * Obter lista de módulos disponíveis
     */
    public function getAvailableModules(): array
    {
        return array_keys($this->modules);
    }

    /**
     * Obter módulos habilitados
     */
    public function getEnabledModules(): array
    {
        $enabled = [];
        
        foreach ($this->modules as $module => $config) {
            if ($this->shouldLoadModule($module)) {
                $enabled[] = $module;
            }
        }

        return $enabled;
    }

    /**
     * Verificar saúde do sistema de rotas
     */
    public function healthCheck(): array
    {
        $health = [
            'status' => 'healthy',
            'issues' => [],
            'recommendations' => [],
        ];

        // Verificar arquivos de módulos
        foreach ($this->modules as $module => $config) {
            $modulePath = base_path("routes/modules/{$module}.php");
            
            if (!file_exists($modulePath)) {
                $health['issues'][] = "Arquivo de módulo '{$module}' não encontrado";
            }
        }

        // Verificar cache
        if (Cache::has($this->cacheKey)) {
            $health['recommendations'][] = 'Cache de rotas ativo - performance otimizada';
        }

        // Verificar configurações
        $disabledModules = [];
        foreach ($this->modules as $module => $config) {
            if (!$this->shouldLoadModule($module) && !$config['always_load']) {
                $disabledModules[] = $module;
            }
        }

        if (count($disabledModules) > 0) {
            $health['recommendations'][] = 'Módulos desabilitados: ' . implode(', ', $disabledModules);
        }

        if (count($health['issues']) > 0) {
            $health['status'] = 'unhealthy';
        }

        return $health;
    }
}