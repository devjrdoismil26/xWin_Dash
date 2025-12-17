<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Commands\ChangeUserPasswordCommand;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use App\Domains\Users\Domain\Services\UserValidationService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ChangeUserPasswordHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService,
        private UserValidationService $userValidationService
    ) {
    }

    public function handle(ChangeUserPasswordCommand $command): array
    {
        try {
            // Buscar o usuário existente
            $user = $this->userRepository->findById($command->userId);

            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar senha atual
            if (!Hash::check($command->currentPassword, $user->password)) {
                throw new \Exception('Senha atual incorreta');
            }

            // Validar nova senha
            $this->userValidationService->validatePassword($command->newPassword);

            // Atualizar a senha
            $updatedUser = $this->userService->updatePassword($user, $command->newPassword);

            // Salvar no repositório
            $savedUser = $this->userRepository->save($updatedUser);

            // Logout de outras sessões se solicitado
            if ($command->logoutOtherSessions) {
                $this->userService->logoutOtherSessions($user);
            }

            Log::info('User password changed successfully', [
                'user_id' => $command->userId
            ]);

            return [
                'user' => $savedUser->toArray(),
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

    private function validateCommand(ChangeUserPasswordCommand $command): void
    {
        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }

        if (empty($command->currentPassword)) {
            throw new \InvalidArgumentException('Senha atual é obrigatória');
        }

        if (empty($command->newPassword)) {
            throw new \InvalidArgumentException('Nova senha é obrigatória');
        }

        if (strlen($command->newPassword) < 8) {
            throw new \InvalidArgumentException('Nova senha deve ter pelo menos 8 caracteres');
        }
    }
}
