<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Commands\UpdateUserPreferencesCommand;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use App\Domains\Users\Domain\Services\UserValidationService;
use Illuminate\Support\Facades\Log;

class UpdateUserPreferencesHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService,
        private UserValidationService $userValidationService
    ) {
    }

    public function handle(UpdateUserPreferencesCommand $command): array
    {
        try {
            // Buscar o usuário existente
            $user = $this->userRepository->findById($command->userId);

            if (!$user) {
                throw new \Exception('Usuário não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Validar preferências
            $this->userValidationService->validatePreferences($command->preferences);

            // Atualizar preferências
            $updatedUser = $this->userService->updatePreferences($user, $command->preferences, $command->merge);

            // Salvar no repositório
            $savedUser = $this->userRepository->save($updatedUser);

            Log::info('User preferences updated successfully', [
                'user_id' => $command->userId
            ]);

            return [
                'user' => $savedUser->toArray(),
                'message' => 'Preferências atualizadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating user preferences', [
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateUserPreferencesCommand $command): void
    {
        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }

        if (empty($command->preferences)) {
            throw new \InvalidArgumentException('Preferências são obrigatórias');
        }

        if (!is_array($command->preferences)) {
            throw new \InvalidArgumentException('Preferências devem ser um array');
        }
    }
}
