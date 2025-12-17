<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Commands\RefreshTokenCommand;
use App\Domains\Auth\Domain\Services\TokenService;
use App\Domains\Auth\Domain\Services\SessionService;
use Illuminate\Support\Facades\Log;

class RefreshTokenHandler
{
    public function __construct(
        private TokenService $tokenService,
        private SessionService $sessionService
    ) {
    }

    public function handle(RefreshTokenCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Validar refresh token
            $tokenData = $this->tokenService->validateRefreshToken($command->refreshToken);

            if (!$tokenData) {
                throw new \Exception('Refresh token inválido ou expirado');
            }

            // Gerar novos tokens
            $newTokens = $this->tokenService->refreshTokens($command->refreshToken);

            // Atualizar sessão
            $this->sessionService->updateSessionTokens(
                $tokenData['user_id'],
                $command->deviceId,
                $newTokens
            );

            Log::info('Tokens refreshed successfully', [
                'user_id' => $tokenData['user_id'],
                'device_id' => $command->deviceId
            ]);

            return [
                'tokens' => $newTokens,
                'message' => 'Tokens renovados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error refreshing tokens', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(RefreshTokenCommand $command): void
    {
        if (empty($command->refreshToken)) {
            throw new \InvalidArgumentException('Refresh token é obrigatório');
        }
    }
}
