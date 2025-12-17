<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Commands\DeleteActivityLogCommand;
use App\Domains\Activity\Application\Handlers\DeleteActivityLogHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeleteActivityLogUseCase
{
    public function __construct(
        private DeleteActivityLogHandler $deleteActivityLogHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeleteActivityLogCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateActivityRules($command->toArray());

            // Executar comando via handler
            $result = $this->deleteActivityLogHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('activity.log_deleted', [
                'activity_id' => $command->activityId,
                'force_delete' => $command->forceDelete
            ]);

            Log::info('Activity log deleted successfully', [
                'activity_id' => $command->activityId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Log de atividade excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting activity log', [
                'activity_id' => $command->activityId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir log de atividade: ' . $e->getMessage()
            ];
        }
    }
}
