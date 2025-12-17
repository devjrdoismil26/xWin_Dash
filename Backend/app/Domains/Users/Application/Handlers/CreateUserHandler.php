<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Commands\CreateUserCommand;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use App\Domains\Users\Domain\Services\UserValidationService;
use App\Domains\Users\Events\UserCreated;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Event;

class CreateUserHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService,
        private UserValidationService $userValidationService
    ) {
    }

    public function handle(CreateUserCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o email já existe
            $existingUser = $this->userRepository->findByEmail($command->email);
            if ($existingUser) {
                throw new \Exception('Email já está em uso');
            }

            // Validar regras de negócio
            $this->userValidationService->validateUserCreation($command->toArray());

            // Criar o usuário no domínio
            $user = $this->userService->createUser([
                'name' => $command->name,
                'email' => $command->email,
                'password' => Hash::make($command->password),
                'phone' => $command->phone,
                'avatar' => $command->avatar,
                'metadata' => $command->metadata,
                'preferences' => $command->preferences,
                'role' => $command->role,
                'is_active' => $command->isActive,
                'email_verified' => $command->emailVerified
            ]);

            // Salvar no repositório
            $savedUser = $this->userRepository->save($user);

            // Disparar evento de usuário criado
            Event::dispatch(new UserCreated($savedUser));

            Log::info('User created successfully', [
                'user_id' => $savedUser->id,
                'email' => $command->email
            ]);

            return [
                'user' => $savedUser->toArray(),
                'message' => 'Usuário criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating user', [
                'email' => $command->email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateUserCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome é obrigatório');
        }

        if (empty($command->email)) {
            throw new \InvalidArgumentException('Email é obrigatório');
        }

        if (empty($command->password)) {
            throw new \InvalidArgumentException('Senha é obrigatória');
        }

        if (!filter_var($command->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }

        if (strlen($command->password) < 8) {
            throw new \InvalidArgumentException('Senha deve ter pelo menos 8 caracteres');
        }
    }
}
