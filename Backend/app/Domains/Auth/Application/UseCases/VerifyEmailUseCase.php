<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Commands\VerifyEmailCommand;
use App\Domains\Auth\Application\Handlers\VerifyEmailHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class VerifyEmailUseCase
{
    public function __construct(
        private VerifyEmailHandler $verifyEmailHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(VerifyEmailCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuthRules($command->toArray());

            // Executar comando via handler
            $result = $this->verifyEmailHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.email_verified', [
                'user_id' => $result['user']['id'],
                'email' => $result['user']['email']
            ]);

            Log::info('Email verification successful', [
                'user_id' => $result['user']['id']
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Email verificado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error verifying email', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao verificar email: ' . $e->getMessage()
            ];
        }
    }
}
