<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Commands\ChangePasswordCommand;
use App\Domains\Users\Application\Handlers\ChangePasswordHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class ChangePasswordUseCase
{
    public function __construct(
        private ChangePasswordHandler $changePasswordHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(ChangePasswordCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateUserBusinessRules($command->toArray());

            // Executar comando via handler
            $result = $this->changePasswordHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.password_changed', [
                'user_id' => $command->userId,
                'reason' => $command->reason
            ]);

            Log::info('User password changed successfully via UseCase', [
                'user_id' => $command->userId,
                'reason' => $command->reason
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Senha alterada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error changing user password via UseCase', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao alterar senha: ' . $e->getMessage()
            ];
        }
    }
}
