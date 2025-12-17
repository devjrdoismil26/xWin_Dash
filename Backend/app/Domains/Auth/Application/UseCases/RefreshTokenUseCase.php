<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Commands\RefreshTokenCommand;
use App\Domains\Auth\Application\Handlers\RefreshTokenHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class RefreshTokenUseCase
{
    public function __construct(
        private RefreshTokenHandler $refreshTokenHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(RefreshTokenCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAuthRules($command->toArray());

            // Executar comando via handler
            $result = $this->refreshTokenHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('user.tokens_refreshed', [
                'device_id' => $command->deviceId
            ]);

            Log::info('Token refresh successful', [
                'device_id' => $command->deviceId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Tokens renovados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error refreshing tokens', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao renovar tokens: ' . $e->getMessage()
            ];
        }
    }
}
