<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Commands\DeleteUserCommand;
use App\Domains\Users\Application\Handlers\DeleteUserHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeleteUserUseCase
{
    public function __construct(
        private DeleteUserHandler $deleteUserHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeleteUserCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateUserDeletion($command->toArray());

            // Executar comando via handler
            $result = $this->deleteUserHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.deleted', [
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete,
                'transfer_data' => $command->transferData
            ]);

            Log::info('User deleted successfully', [
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Usuário excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting user', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir usuário: ' . $e->getMessage()
            ];
        }
    }
}
