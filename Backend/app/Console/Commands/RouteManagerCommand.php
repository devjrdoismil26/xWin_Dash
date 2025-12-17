<?php

namespace App\Console\Commands;

use App\Services\RouteManager;
use Illuminate\Console\Command;

/**
 * 🚀 ROUTE MANAGER COMMAND
 * 
 * Comando CLI para gerenciar o sistema de rotas
 */
class RouteManagerCommand extends Command
{
    protected $signature = 'route:manager 
                            {action : Ação a executar (stats|modules|health|clear-cache|reload|toggle)}
                            {module? : Nome do módulo (para ações específicas)}
                            {--enabled= : Habilitar/desabilitar módulo (true/false)}';

    protected $description = 'Gerenciar sistema de rotas otimizado';

    protected RouteManager $routeManager;

    public function __construct(RouteManager $routeManager)
    {
        parent::__construct();
        $this->routeManager = $routeManager;
    }

    public function handle(): int
    {
        $action = $this->argument('action');
        $module = $this->argument('module');

        switch ($action) {
            case 'stats':
                return $this->showStats();
            case 'modules':
                return $this->showModules();
            case 'health':
                return $this->showHealth();
            case 'clear-cache':
                return $this->clearCache();
            case 'reload':
                return $this->reloadRoutes();
            case 'toggle':
                return $this->toggleModule($module);
            default:
                $this->error("Ação '{$action}' não reconhecida");
                return 1;
        }
    }

    protected function showStats(): int
    {
        $this->info('📊 Estatísticas do Sistema de Rotas');
        $this->line('');

        $stats = $this->routeManager->getRouteStats();
        
        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Total de Rotas', $stats['total_routes']],
                ['Módulos Carregados', $stats['modules_loaded']],
                ['Módulos Habilitados', $stats['modules_enabled']],
                ['Status do Cache', $stats['cache_status']],
            ]
        );

        return 0;
    }

    protected function showModules(): int
    {
        $this->info('📁 Módulos de Rotas');
        $this->line('');

        $available = $this->routeManager->getAvailableModules();
        $enabled = $this->routeManager->getEnabledModules();

        $modules = [];
        foreach ($available as $module) {
            $modules[] = [
                $module,
                in_array($module, $enabled) ? '✅ Habilitado' : '❌ Desabilitado',
                $this->routeManager->getModuleInfo($module)['priority'] ?? 'N/A',
            ];
        }

        $this->table(
            ['Módulo', 'Status', 'Prioridade'],
            $modules
        );

        return 0;
    }

    protected function showHealth(): int
    {
        $this->info('🏥 Verificação de Saúde do Sistema');
        $this->line('');

        $health = $this->routeManager->healthCheck();
        
        $status = $health['status'] === 'healthy' ? '✅ Saudável' : '❌ Com Problemas';
        $this->line("Status: {$status}");
        $this->line('');

        if (!empty($health['issues'])) {
            $this->error('Problemas encontrados:');
            foreach ($health['issues'] as $issue) {
                $this->line("  • {$issue}");
            }
            $this->line('');
        }

        if (!empty($health['recommendations'])) {
            $this->info('Recomendações:');
            foreach ($health['recommendations'] as $recommendation) {
                $this->line("  • {$recommendation}");
            }
        }

        return $health['status'] === 'healthy' ? 0 : 1;
    }

    protected function clearCache(): int
    {
        $this->routeManager->clearCache();
        $this->info('✅ Cache de rotas limpo com sucesso');
        return 0;
    }

    protected function reloadRoutes(): int
    {
        $this->routeManager->clearCache();
        $this->routeManager->loadAllRoutes();
        
        $stats = $this->routeManager->getRouteStats();
        $this->info('✅ Rotas recarregadas com sucesso');
        $this->line("Total de rotas: {$stats['total_routes']}");
        
        return 0;
    }

    protected function toggleModule(?string $module): int
    {
        if (!$module) {
            $this->error('Nome do módulo é obrigatório para esta ação');
            return 1;
        }

        $enabled = $this->option('enabled');
        if ($enabled === null) {
            $this->error('Opção --enabled é obrigatória (true/false)');
            return 1;
        }

        $enabled = filter_var($enabled, FILTER_VALIDATE_BOOLEAN);
        
        $result = $this->routeManager->toggleModule($module, $enabled);
        
        if (!$result) {
            $this->error("Módulo '{$module}' não encontrado");
            return 1;
        }

        $status = $enabled ? 'habilitado' : 'desabilitado';
        $this->info("✅ Módulo '{$module}' {$status} com sucesso");
        
        return 0;
    }
}