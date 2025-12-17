<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Commands\UpdateUserCommand;
use App\Domains\Users\Application\Handlers\UpdateUserHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateUserUseCase
{
    public function __construct(
        private UpdateUserHandler $updateUserHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateUserCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateUserUpdate($command->toArray());

            // Executar comando via handler
            $result = $this->updateUserHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.updated', [
                'user_id' => $command->userId,
                'changes' => $command->toArray()
            ]);

            Log::info('User updated successfully', [
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Usuário atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating user', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar usuário: ' . $e->getMessage()
            ];
        }
    }
}
