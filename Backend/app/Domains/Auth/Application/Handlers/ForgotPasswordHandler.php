<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Commands\ForgotPasswordCommand;
use App\Domains\Auth\Domain\Services\PasswordResetService;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Log;

class ForgotPasswordHandler
{
    public function __construct(
        private PasswordResetService $passwordResetService,
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(ForgotPasswordCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Buscar usuário por email
            $user = $this->userRepository->findByEmail($command->email);

            if (!$user) {
                // Por segurança, não revelar se o email existe ou não
                return [
                    'message' => 'Se o email existir, você receberá um link para redefinir sua senha'
                ];
            }

            // Gerar token de reset
            $resetToken = $this->passwordResetService->generateResetToken($user);

            // Enviar email de reset
            $this->passwordResetService->sendResetEmail($user, $resetToken, $command->ipAddress);

            Log::info('Password reset requested', [
                'user_id' => $user->id,
                'email' => $command->email
            ]);

            return [
                'message' => 'Se o email existir, você receberá um link para redefinir sua senha'
            ];
        } catch (\Exception $e) {
            Log::error('Error requesting password reset', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(ForgotPasswordCommand $command): void
    {
        if (empty($command->email)) {
            throw new \InvalidArgumentException('Email é obrigatório');
        }

        if (!filter_var($command->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }
    }
}
