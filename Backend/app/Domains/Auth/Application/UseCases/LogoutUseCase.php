<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Commands\LogoutCommand;
use App\Domains\Auth\Application\Handlers\LogoutHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class LogoutUseCase
{
    public function __construct(
        private LogoutHandler $logoutHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(LogoutCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuthRules($command->toArray());

            // Executar comando via handler
            $result = $this->logoutHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.logged_out', [
                'user_id' => $command->userId,
                'logout_all_sessions' => $command->logoutAllSessions
            ]);

            Log::info('User logout successful', [
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Logout realizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error during logout', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro no logout: ' . $e->getMessage()
            ];
        }
    }
}
