<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Commands\CleanupActivityLogsCommand;
use App\Domains\Activity\Application\Handlers\CleanupActivityLogsHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CleanupActivityLogsUseCase
{
    public function __construct(
        private CleanupActivityLogsHandler $cleanupActivityLogsHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CleanupActivityLogsCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateActivityRules($command->toArray());

            // Executar comando via handler
            $result = $this->cleanupActivityLogsHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('activity.logs_cleaned', [
                'deleted_count' => $result['cleanup_result']['deleted_count'],
                'dry_run' => $command->dryRun
            ]);

            Log::info('Activity logs cleanup completed successfully', [
                'deleted_count' => $result['cleanup_result']['deleted_count'],
                'dry_run' => $command->dryRun
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => $command->dryRun ? 'Simulação de limpeza concluída' : 'Limpeza de logs concluída'
            ];
        } catch (\Exception $e) {
            Log::error('Error cleaning up activity logs', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao limpar logs de atividade: ' . $e->getMessage()
            ];
        }
    }
}
