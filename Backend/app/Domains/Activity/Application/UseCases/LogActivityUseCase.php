<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Commands\LogActivityCommand;
use App\Domains\Activity\Application\Handlers\LogActivityHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class LogActivityUseCase
{
    public function __construct(
        private LogActivityHandler $logActivityHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(LogActivityCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateActivityRules($command->toArray());

            // Executar comando via handler
            $result = $this->logActivityHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('activity.logged', [
                'activity_id' => $result['activity_log']['id'],
                'action' => $command->action,
                'user_id' => $command->userId
            ]);

            Log::info('Activity logged successfully', [
                'activity_id' => $result['activity_log']['id'],
                'action' => $command->action
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Atividade registrada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error logging activity', [
                'action' => $command->action,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao registrar atividade: ' . $e->getMessage()
            ];
        }
    }
}
