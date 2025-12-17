<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Commands\ResetPasswordCommand;
use App\Domains\Auth\Application\Handlers\ResetPasswordHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class ResetPasswordUseCase
{
    public function __construct(
        private ResetPasswordHandler $resetPasswordHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(ResetPasswordCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validatePasswordReset($command->toArray());

            // Executar comando via handler
            $result = $this->resetPasswordHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.password_reset', [
                'user_id' => $result['user']['id'],
                'email' => $command->email,
                'ip_address' => $command->ipAddress
            ]);

            Log::info('Password reset successful', [
                'user_id' => $result['user']['id'],
                'email' => $command->email
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Senha redefinida com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error resetting password', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao redefinir senha: ' . $e->getMessage()
            ];
        }
    }
}
