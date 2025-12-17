<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Commands\EnableModuleCommand;
use App\Domains\Core\Services\ModuleManager;
use App\Domains\Core\Repositories\ModuleRepository;
use App\Domains\Core\Exceptions\ModuleNotFoundException;
use App\Domains\Core\Exceptions\ModuleEnableException;
use Illuminate\Support\Facades\Log;

class EnableModuleHandler
{
    public function __construct(
        private ModuleManager $moduleManager,
        private ModuleRepository $moduleRepository
    ) {
    }

    public function handle(EnableModuleCommand $command): array
    {
        try {
            // Verificar se o módulo existe
            $module = $this->moduleManager->getModule($command->moduleName);

            if (!$module) {
                throw new ModuleNotFoundException(
                    "Module '{$command->moduleName}' not found"
                );
            }

            // Verificar se o módulo já está habilitado
            $moduleStatus = $this->moduleRepository->getModuleStatus($command->moduleName);

            if ($moduleStatus && $moduleStatus->is_enabled) {
                throw new ModuleEnableException(
                    "Module '{$command->moduleName}' is already enabled"
                );
            }

            // Verificar dependências
            $this->checkModuleDependencies($command->moduleName);

            // Habilitar o módulo
            $enabled = $this->moduleManager->enableModule($command->moduleName);

            if (!$enabled) {
                throw new ModuleEnableException(
                    "Failed to enable module '{$command->moduleName}'"
                );
            }

            // Salvar configuração se fornecida
            if ($command->configuration) {
                $this->moduleRepository->updateModuleConfiguration(
                    $command->moduleName,
                    $command->configuration
                );
            }

            // Log da habilitação
            Log::info("Module enabled", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'has_configuration' => !empty($command->configuration)
            ]);

            return [
                'success' => true,
                'module_name' => $command->moduleName,
                'enabled_at' => now()->toISOString(),
                'configuration' => $command->configuration
            ];
        } catch (ModuleNotFoundException $e) {
            Log::error("Module not found for enabling", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (ModuleEnableException $e) {
            Log::error("Module enable failed", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during module enable", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new ModuleEnableException(
                "Failed to enable module: " . $e->getMessage()
            );
        }
    }

    private function checkModuleDependencies(string $moduleName): void
    {
        // Verificar se todas as dependências estão habilitadas
        // Esta lógica seria implementada com base nas dependências definidas
        Log::info("Checking module dependencies", [
            'module_name' => $moduleName
        ]);
    }
}
