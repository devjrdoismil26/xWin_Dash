<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Commands\CreateActivityLogCommand;
use App\Domains\Activity\Application\Handlers\CreateActivityLogHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateActivityLogUseCase
{
    public function __construct(
        private CreateActivityLogHandler $createActivityLogHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateActivityLogCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateActivityRules($command->toArray());

            // Executar comando via handler
            $result = $this->createActivityLogHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('activity.log_created', [
                'activity_id' => $result['activity_log']['id'],
                'action' => $command->action,
                'user_id' => $command->userId
            ]);

            Log::info('Activity log created successfully', [
                'activity_id' => $result['activity_log']['id'],
                'action' => $command->action
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Log de atividade criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating activity log', [
                'action' => $command->action,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar log de atividade: ' . $e->getMessage()
            ];
        }
    }
}
