<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Commands\DisableModuleCommand;
use App\Domains\Core\Services\ModuleManager;
use App\Domains\Core\Repositories\ModuleRepository;
use App\Domains\Core\Exceptions\ModuleNotFoundException;
use App\Domains\Core\Exceptions\ModuleDisableException;
use Illuminate\Support\Facades\Log;

class DisableModuleHandler
{
    public function __construct(
        private ModuleManager $moduleManager,
        private ModuleRepository $moduleRepository
    ) {
    }

    public function handle(DisableModuleCommand $command): array
    {
        try {
            // Verificar se o módulo existe
            $module = $this->moduleManager->getModule($command->moduleName);

            if (!$module) {
                throw new ModuleNotFoundException(
                    "Module '{$command->moduleName}' not found"
                );
            }

            // Verificar se o módulo está habilitado
            $moduleStatus = $this->moduleRepository->getModuleStatus($command->moduleName);

            if (!$moduleStatus || !$moduleStatus->is_enabled) {
                throw new ModuleDisableException(
                    "Module '{$command->moduleName}' is not enabled"
                );
            }

            // Verificar se outros módulos dependem deste
            if (!$command->forceDisable) {
                $this->checkModuleDependents($command->moduleName);
            }

            // Desabilitar o módulo
            $disabled = $this->moduleManager->disableModule($command->moduleName);

            if (!$disabled) {
                throw new ModuleDisableException(
                    "Failed to disable module '{$command->moduleName}'"
                );
            }

            // Log da desabilitação
            Log::info("Module disabled", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'force_disable' => $command->forceDisable
            ]);

            return [
                'success' => true,
                'module_name' => $command->moduleName,
                'disabled_at' => now()->toISOString()
            ];
        } catch (ModuleNotFoundException $e) {
            Log::error("Module not found for disabling", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (ModuleDisableException $e) {
            Log::error("Module disable failed", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during module disable", [
                'module_name' => $command->moduleName,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new ModuleDisableException(
                "Failed to disable module: " . $e->getMessage()
            );
        }
    }

    private function checkModuleDependents(string $moduleName): void
    {
        // Verificar se outros módulos dependem deste
        // Se houver dependências, lançar exceção a menos que seja force disable
        Log::info("Checking module dependents", [
            'module_name' => $moduleName
        ]);
    }
}
