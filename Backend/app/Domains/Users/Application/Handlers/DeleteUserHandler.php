<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Commands\DeleteUserCommand;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use App\Domains\Users\Domain\Services\UserValidationService;
use Illuminate\Support\Facades\Log;

class DeleteUserHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService,
        private UserValidationService $userValidationService
    ) {
    }

    public function handle(DeleteUserCommand $command): array
    {
        try {
            // Buscar o usuário existente
            $user = $this->userRepository->findById($command->userId);

            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há dados associados
            $hasAssociatedData = $this->userService->hasAssociatedData($user);

            if ($hasAssociatedData && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir usuário com dados associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Transferir dados se solicitado
            if ($command->transferData && $command->transferToUserId) {
                $this->userService->transferUserData($user, $command->transferToUserId);
            }

            // Limpar dados associados se necessário
            if ($command->forceDelete) {
                $this->userService->cleanupUserData($user);
            }

            // Excluir o usuário
            $this->userRepository->delete($command->userId);

            Log::info('User deleted successfully', [
                'user_id' => $command->userId
            ]);

            return [
                'message' => 'Usuário excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting user', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteUserCommand $command): void
    {
        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }

        if ($command->transferData && empty($command->transferToUserId)) {
            throw new \InvalidArgumentException('ID do usuário de destino é obrigatório para transferência de dados');
        }
    }
}
