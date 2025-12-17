<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Commands\LogoutCommand;
use App\Domains\Auth\Domain\Services\AuthService;
use App\Domains\Auth\Domain\Services\TokenService;
use App\Domains\Auth\Domain\Services\SessionService;
use Illuminate\Support\Facades\Log;

class LogoutHandler
{
    public function __construct(
        private AuthService $authService,
        private TokenService $tokenService,
        private SessionService $sessionService
    ) {
    }

    public function handle(LogoutCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            if ($command->logoutAllSessions) {
                // Logout de todas as sessões
                $this->sessionService->logoutAllSessions($command->userId);
                $this->tokenService->revokeAllTokens($command->userId);
            } else {
                // Logout de sessão específica
                if ($command->token) {
                    $this->tokenService->revokeToken($command->token);
                }

                if ($command->deviceId) {
                    $this->sessionService->logoutSessionByDevice($command->userId, $command->deviceId);
                }
            }

            // Registrar atividade de logout
            $this->authService->logLogoutActivity($command->userId, $command->toArray());

            Log::info('User logged out successfully', [
                'user_id' => $command->userId,
                'logout_all_sessions' => $command->logoutAllSessions
            ]);

            return [
                'message' => 'Logout realizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error during logout', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(LogoutCommand $command): void
    {
        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
