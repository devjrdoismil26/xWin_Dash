<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Commands\ChangePasswordCommand;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use App\Domains\Users\Domain\Services\PasswordService;
use Illuminate\Support\Facades\Log;

class ChangePasswordHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService,
        private PasswordService $passwordService
    ) {
    }

    public function handle(ChangePasswordCommand $command): array
    {
        try {
            // Buscar usuário
            $user = $this->userRepository->findById($command->userId);

            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Validar senha atual
            if (!$this->passwordService->verifyPassword($command->currentPassword, $user->password)) {
                throw new \Exception('Senha atual incorreta');
            }

            // Validar nova senha
            if (strlen($command->newPassword) < 8) {
                throw new \InvalidArgumentException('Nova senha deve ter pelo menos 8 caracteres');
            }

            // Criptografar nova senha
            $hashedPassword = $this->passwordService->hashPassword($command->newPassword);

            // Atualizar senha via serviço de domínio
            $updatedUser = $this->userService->updatePassword($user, $hashedPassword, $command->reason);

            // Salvar no repositório
            $this->userRepository->save($updatedUser);

            Log::info('User password changed successfully', [
                'user_id' => $command->userId,
                'reason' => $command->reason
            ]);

            return [
                'message' => 'Senha alterada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error changing user password', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
