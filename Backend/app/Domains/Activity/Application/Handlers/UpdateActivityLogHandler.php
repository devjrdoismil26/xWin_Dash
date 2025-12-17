<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Commands\UpdateActivityLogCommand;
use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use App\Domains\Activity\Domain\Services\ActivityLogService;
use App\Domains\Activity\Domain\Services\ActivityValidationService;
use Illuminate\Support\Facades\Log;

class UpdateActivityLogHandler
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository,
        private ActivityLogService $activityLogService,
        private ActivityValidationService $validationService
    ) {
    }

    public function handle(UpdateActivityLogCommand $command): array
    {
        try {
            // Buscar o log existente
            $activityLog = $this->activityLogRepository->findById($command->activityId);

            if (!$activityLog) {
                throw new \Exception('Log de atividade não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateActivityLogUpdate($command->toArray());

            // Atualizar o log
            $updateData = array_filter([
                'description' => $command->description,
                'metadata' => $command->metadata,
                'level' => $command->level
            ], function ($value) {
                return $value !== null;
            });

            $updatedActivityLog = $this->activityLogService->updateActivityLog($activityLog, $updateData);

            // Salvar no repositório
            $savedActivityLog = $this->activityLogRepository->save($updatedActivityLog);

            Log::info('Activity log updated successfully', [
                'activity_id' => $command->activityId
            ]);

            return [
                'activity_log' => $savedActivityLog->toArray(),
                'message' => 'Log de atividade atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating activity log', [
                'activity_id' => $command->activityId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateActivityLogCommand $command): void
    {
        if (empty($command->activityId)) {
            throw new \InvalidArgumentException('ID do log é obrigatório');
        }

        if ($command->level) {
            $validLevels = ['debug', 'info', 'warning', 'error', 'critical'];
            if (!in_array($command->level, $validLevels)) {
                throw new \InvalidArgumentException('Nível inválido');
            }
        }
    }
}
