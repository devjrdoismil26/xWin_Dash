<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Commands\LogActivityCommand;
use App\Domains\Activity\Domain\Services\ActivityLogService;
use App\Domains\Activity\Domain\Services\ActivityValidationService;
use Illuminate\Support\Facades\Log;

class LogActivityHandler
{
    public function __construct(
        private ActivityLogService $activityLogService,
        private ActivityValidationService $validationService
    ) {
    }

    public function handle(LogActivityCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateActivityLogging($command->toArray());

            // Criar log de atividade
            $activityLog = $this->activityLogService->logActivity([
                'action' => $command->action,
                'description' => $command->description,
                'entity_type' => $command->entityType,
                'entity_id' => $command->entityId,
                'user_id' => $command->userId,
                'metadata' => $command->metadata,
                'ip_address' => $command->ipAddress,
                'user_agent' => $command->userAgent
            ]);

            Log::info('Activity logged successfully', [
                'activity_id' => $activityLog->id,
                'action' => $command->action,
                'user_id' => $command->userId
            ]);

            return [
                'activity_log' => $activityLog->toArray(),
                'message' => 'Atividade registrada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error logging activity', [
                'action' => $command->action,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(LogActivityCommand $command): void
    {
        if (empty($command->action)) {
            throw new \InvalidArgumentException('Ação é obrigatória');
        }
    }
}
