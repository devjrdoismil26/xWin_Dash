<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Commands\LoginCommand;
use App\Domains\Auth\Domain\Services\AuthService;
use App\Domains\Auth\Domain\Services\TokenService;
use App\Domains\Auth\Domain\Services\SessionService;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LoginHandler
{
    public function __construct(
        private AuthService $authService,
        private TokenService $tokenService,
        private SessionService $sessionService,
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(LoginCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Buscar usuário por email
            $user = $this->userRepository->findByEmail($command->email);

            if (!$user) {
                throw new \Exception('Credenciais inválidas');
            }

            // Verificar senha
            if (!Hash::check($command->password, $user->password)) {
                throw new \Exception('Credenciais inválidas');
            }

            // Verificar se o usuário está ativo
            if (!$user->is_active) {
                throw new \Exception('Conta desativada');
            }

            // Gerar tokens
            $tokens = $this->tokenService->generateTokens($user);

            // Criar sessão
            $session = $this->sessionService->createSession([
                'user_id' => $user->id,
                'device_id' => $command->deviceId,
                'device_name' => $command->deviceName,
                'ip_address' => $command->ipAddress,
                'access_token' => $tokens['access_token'],
                'refresh_token' => $tokens['refresh_token'],
                'expires_at' => $tokens['expires_at']
            ]);

            // Registrar atividade de login
            $this->authService->logLoginActivity($user, $command->toArray());

            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'email' => $command->email,
                'device_id' => $command->deviceId
            ]);

            return [
                'user' => $user->toArray(),
                'tokens' => $tokens,
                'session' => $session->toArray(),
                'message' => 'Login realizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error during login', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(LoginCommand $command): void
    {
        if (empty($command->email)) {
            throw new \InvalidArgumentException('Email é obrigatório');
        }

        if (empty($command->password)) {
            throw new \InvalidArgumentException('Senha é obrigatória');
        }

        if (!filter_var($command->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }
    }
}
