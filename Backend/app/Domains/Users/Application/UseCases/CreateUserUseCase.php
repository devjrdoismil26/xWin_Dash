<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Commands\CreateUserCommand;
use App\Domains\Users\Application\Handlers\CreateUserHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateUserUseCase
{
    public function __construct(
        private CreateUserHandler $createUserHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateUserCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateUserCreation($command->toArray());

            // Executar comando via handler
            $result = $this->createUserHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.created', [
                'user_id' => $result['user']['id'],
                'email' => $command->email,
                'role' => $command->role
            ]);

            Log::info('User created successfully', [
                'user_id' => $result['user']['id'],
                'email' => $command->email
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Usuário criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating user', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar usuário: ' . $e->getMessage()
            ];
        }
    }
}
