<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Commands\UpdateUserCommand;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use App\Domains\Users\Domain\Services\UserValidationService;
use Illuminate\Support\Facades\Log;

class UpdateUserHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService,
        private UserValidationService $userValidationService
    ) {
    }

    public function handle(UpdateUserCommand $command): array
    {
        try {
            // Buscar o usuário existente
            $user = $this->userRepository->findById($command->userId);

            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o email já existe (se foi alterado)
            if ($command->email && $command->email !== $user->email) {
                $existingUser = $this->userRepository->findByEmail($command->email);
                if ($existingUser) {
                    throw new \Exception('Email já está em uso');
                }
            }

            // Validar regras de negócio
            $this->userValidationService->validateUserUpdate($command->toArray());

            // Atualizar o usuário
            $updateData = array_filter([
                'name' => $command->name,
                'email' => $command->email,
                'phone' => $command->phone,
                'avatar' => $command->avatar,
                'metadata' => $command->metadata,
                'preferences' => $command->preferences,
                'role' => $command->role,
                'is_active' => $command->isActive,
                'email_verified' => $command->emailVerified
            ], function ($value) {
                return $value !== null;
            });

            $updatedUser = $this->userService->updateUser($user, $updateData);

            // Salvar no repositório
            $savedUser = $this->userRepository->save($updatedUser);

            Log::info('User updated successfully', [
                'user_id' => $command->userId
            ]);

            return [
                'user' => $savedUser->toArray(),
                'message' => 'Usuário atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating user', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateUserCommand $command): void
    {
        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }

        if ($command->email && !filter_var($command->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }
    }
}
