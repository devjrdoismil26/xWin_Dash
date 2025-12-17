<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Queries\GetModuleStatusQuery;
use App\Domains\Core\Services\ModuleManager;
use App\Domains\Core\Repositories\ModuleRepository;

class GetModuleStatusHandler
{
    public function __construct(
        private ModuleManager $moduleManager,
        private ModuleRepository $moduleRepository
    ) {
    }

    public function handle(GetModuleStatusQuery $query): array
    {
        if ($query->moduleName) {
            // Status de um módulo específico
            $module = $this->moduleManager->getModule($query->moduleName);
            $moduleStatus = $this->moduleRepository->getModuleStatus($query->moduleName);

            if (!$module) {
                return [
                    'module_name' => $query->moduleName,
                    'exists' => false,
                    'is_enabled' => false,
                    'status' => 'not_found'
                ];
            }

            $result = [
                'module_name' => $query->moduleName,
                'exists' => true,
                'is_enabled' => $moduleStatus ? $moduleStatus->is_enabled : false,
                'status' => $moduleStatus && $moduleStatus->is_enabled ? 'enabled' : 'disabled',
                'version' => $module->getVersion() ?? 'unknown',
                'description' => $module->getDescription() ?? null
            ];

            if ($query->includeConfiguration && $moduleStatus) {
                $result['configuration'] = $moduleStatus->configuration;
            }

            return $result;
        } else {
            // Status de todos os módulos
            $allModules = $this->moduleManager->getAllModules();
            $modulesStatus = [];

            foreach ($allModules as $moduleName => $module) {
                $moduleStatus = $this->moduleRepository->getModuleStatus($moduleName);

                $modulesStatus[] = [
                    'module_name' => $moduleName,
                    'is_enabled' => $moduleStatus ? $moduleStatus->is_enabled : false,
                    'status' => $moduleStatus && $moduleStatus->is_enabled ? 'enabled' : 'disabled',
                    'version' => $module->getVersion() ?? 'unknown',
                    'description' => $module->getDescription() ?? null
                ];
            }

            return [
                'modules' => $modulesStatus,
                'total_modules' => count($modulesStatus),
                'enabled_count' => count(array_filter($modulesStatus, fn($m) => $m['is_enabled'])),
                'disabled_count' => count(array_filter($modulesStatus, fn($m) => !$m['is_enabled']))
            ];
        }
    }
}
