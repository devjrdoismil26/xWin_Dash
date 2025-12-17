<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Commands\UpdateUserPreferencesCommand;
use App\Domains\Users\Application\Handlers\UpdateUserPreferencesHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateUserPreferencesUseCase
{
    public function __construct(
        private UpdateUserPreferencesHandler $updateUserPreferencesHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateUserPreferencesCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateUserPreferences($command->toArray());

            // Executar comando via handler
            $result = $this->updateUserPreferencesHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.preferences_updated', [
                'user_id' => $command->userId,
                'preferences' => $command->preferences
            ]);

            Log::info('User preferences updated successfully', [
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Preferências atualizadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating user preferences', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar preferências: ' . $e->getMessage()
            ];
        }
    }
}
