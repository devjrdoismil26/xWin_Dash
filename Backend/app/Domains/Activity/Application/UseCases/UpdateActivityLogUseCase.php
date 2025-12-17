<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Commands\UpdateActivityLogCommand;
use App\Domains\Activity\Application\Handlers\UpdateActivityLogHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateActivityLogUseCase
{
    public function __construct(
        private UpdateActivityLogHandler $updateActivityLogHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateActivityLogCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateActivityRules($command->toArray());

            // Executar comando via handler
            $result = $this->updateActivityLogHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('activity.log_updated', [
                'activity_id' => $command->activityId,
                'changes' => $command->toArray()
            ]);

            Log::info('Activity log updated successfully', [
                'activity_id' => $command->activityId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Log de atividade atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating activity log', [
                'activity_id' => $command->activityId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar log de atividade: ' . $e->getMessage()
            ];
        }
    }
}
