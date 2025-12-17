<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Commands\ChangeUserPasswordCommand;
use App\Domains\Users\Application\Handlers\ChangeUserPasswordHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class ChangeUserPasswordUseCase
{
    public function __construct(
        private ChangeUserPasswordHandler $changeUserPasswordHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(ChangeUserPasswordCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validatePasswordChange($command->toArray());

            // Executar comando via handler
            $result = $this->changeUserPasswordHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.password_changed', [
                'user_id' => $command->userId,
                'logout_other_sessions' => $command->logoutOtherSessions
            ]);

            Log::info('User password changed successfully', [
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Senha alterada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error changing user password', [
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
