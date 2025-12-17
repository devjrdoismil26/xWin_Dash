<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Commands\LoginCommand;
use App\Domains\Auth\Application\Handlers\LoginHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class LoginUseCase
{
    public function __construct(
        private LoginHandler $loginHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(LoginCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuthRules($command->toArray());

            // Executar comando via handler
            $result = $this->loginHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.logged_in', [
                'user_id' => $result['user']['id'],
                'device_id' => $command->deviceId,
                'ip_address' => $command->ipAddress
            ]);

            Log::info('User login successful', [
                'user_id' => $result['user']['id'],
                'email' => $command->email
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Login realizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error during login', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro no login: ' . $e->getMessage()
            ];
        }
    }
}
