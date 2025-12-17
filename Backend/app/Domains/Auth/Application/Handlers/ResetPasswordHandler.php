<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Commands\ResetPasswordCommand;
use App\Domains\Auth\Domain\Services\PasswordResetService;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ResetPasswordHandler
{
    public function __construct(
        private PasswordResetService $passwordResetService,
        private UserRepositoryInterface $userRepository,
        private UserService $userService
    ) {
    }

    public function handle(ResetPasswordCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Validar token de reset
            $tokenData = $this->passwordResetService->validateResetToken($command->token, $command->email);

            if (!$tokenData) {
                throw new \Exception('Token de reset inválido ou expirado');
            }

            // Buscar usuário
            $user = $this->userRepository->findById($tokenData['user_id']);

            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Atualizar senha
            $updatedUser = $this->userService->updatePassword($user, $command->password);

            // Salvar no repositório
            $savedUser = $this->userRepository->save($updatedUser);

            // Invalidar token de reset
            $this->passwordResetService->invalidateResetToken($command->token);

            // Revogar todas as sessões ativas
            $this->passwordResetService->revokeAllUserSessions($user->id);

            Log::info('Password reset successfully', [
                'user_id' => $user->id,
                'email' => $command->email
            ]);

            return [
                'user' => $savedUser->toArray(),
                'message' => 'Senha redefinida com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error resetting password', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(ResetPasswordCommand $command): void
    {
        if (empty($command->token)) {
            throw new \InvalidArgumentException('Token é obrigatório');
        }

        if (empty($command->email)) {
            throw new \InvalidArgumentException('Email é obrigatório');
        }

        if (empty($command->password)) {
            throw new \InvalidArgumentException('Senha é obrigatória');
        }

        if ($command->password !== $command->passwordConfirmation) {
            throw new \InvalidArgumentException('Confirmação de senha não confere');
        }

        if (!filter_var($command->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }

        if (strlen($command->password) < 8) {
            throw new \InvalidArgumentException('Senha deve ter pelo menos 8 caracteres');
        }
    }
}
