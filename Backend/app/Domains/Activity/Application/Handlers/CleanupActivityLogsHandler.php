<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Commands\CleanupActivityLogsCommand;
use App\Domains\Activity\Domain\Services\ActivityLogService;
use Illuminate\Support\Facades\Log;

class CleanupActivityLogsHandler
{
    public function __construct(
        private ActivityLogService $activityLogService
    ) {
    }

    public function handle(CleanupActivityLogsCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Executar limpeza
            $result = $this->activityLogService->cleanupLogs([
                'older_than' => $command->olderThan,
                'action' => $command->action,
                'level' => $command->level,
                'dry_run' => $command->dryRun
            ]);

            Log::info('Activity logs cleanup completed', [
                'deleted_count' => $result['deleted_count'],
                'dry_run' => $command->dryRun
            ]);

            return [
                'cleanup_result' => $result,
                'message' => $command->dryRun ? 'Simulação de limpeza concluída' : 'Limpeza de logs concluída'
            ];
        } catch (\Exception $e) {
            Log::error('Error cleaning up activity logs', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CleanupActivityLogsCommand $command): void
    {
        if ($command->olderThan && !strtotime($command->olderThan)) {
            throw new \InvalidArgumentException('Data inválida para older_than');
        }
    }
}
