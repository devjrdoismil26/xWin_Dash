<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Commands\ForgotPasswordCommand;
use App\Domains\Auth\Application\Handlers\ForgotPasswordHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class ForgotPasswordUseCase
{
    public function __construct(
        private ForgotPasswordHandler $forgotPasswordHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(ForgotPasswordCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuthRules($command->toArray());

            // Executar comando via handler
            $result = $this->forgotPasswordHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.password_reset_requested', [
                'email' => $command->email,
                'ip_address' => $command->ipAddress
            ]);

            Log::info('Password reset request successful', [
                'email' => $command->email
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Solicitação de reset de senha enviada'
            ];
        } catch (\Exception $e) {
            Log::error('Error requesting password reset', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao solicitar reset de senha: ' . $e->getMessage()
            ];
        }
    }
}
