<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Commands\CreateActivityLogCommand;
use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use App\Domains\Activity\Domain\Services\ActivityLogService;
use App\Domains\Activity\Domain\Services\ActivityValidationService;
use Illuminate\Support\Facades\Log;

class CreateActivityLogHandler
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository,
        private ActivityLogService $activityLogService,
        private ActivityValidationService $validationService
    ) {
    }

    public function handle(CreateActivityLogCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateActivityLogCreation($command->toArray());

            // Criar o log de atividade no domínio
            $activityLog = $this->activityLogService->createActivityLog([
                'action' => $command->action,
                'description' => $command->description,
                'entity_type' => $command->entityType,
                'entity_id' => $command->entityId,
                'user_id' => $command->userId,
                'metadata' => $command->metadata,
                'ip_address' => $command->ipAddress,
                'user_agent' => $command->userAgent,
                'level' => $command->level
            ]);

            // Salvar no repositório
            $savedActivityLog = $this->activityLogRepository->save($activityLog);

            Log::info('Activity log created successfully', [
                'activity_id' => $savedActivityLog->id,
                'action' => $command->action,
                'user_id' => $command->userId
            ]);

            return [
                'activity_log' => $savedActivityLog->toArray(),
                'message' => 'Log de atividade criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating activity log', [
                'action' => $command->action,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateActivityLogCommand $command): void
    {
        if (empty($command->action)) {
            throw new \InvalidArgumentException('Ação é obrigatória');
        }

        if (empty($command->description)) {
            throw new \InvalidArgumentException('Descrição é obrigatória');
        }

        $validLevels = ['debug', 'info', 'warning', 'error', 'critical'];
        if (!in_array($command->level, $validLevels)) {
            throw new \InvalidArgumentException('Nível inválido');
        }
    }
}
