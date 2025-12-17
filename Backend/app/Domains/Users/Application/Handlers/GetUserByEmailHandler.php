<?php

namespace App\Domains\Users\Application\Handlers;

use App\Domains\Users\Application\Queries\GetUserByEmailQuery;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Users\Domain\Services\UserService;
use Illuminate\Support\Facades\Log;

class GetUserByEmailHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserService $userService
    ) {
    }

    public function handle(GetUserByEmailQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o usuário por email
            $user = $this->userRepository->findByEmail($query->email);

            if (!$user) {
                return null;
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $user->toArray();

            if ($query->includeProfile) {
                $result['profile'] = $this->userService->getUserProfile($user);
            }

            if ($query->includePreferences) {
                $result['preferences'] = $this->userService->getUserPreferences($user);
            }

            Log::info('User retrieved by email successfully', [
                'email' => $query->email
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving user by email', [
                'email' => $query->email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetUserByEmailQuery $query): void
    {
        if (empty($query->email)) {
            throw new \InvalidArgumentException('Email é obrigatório');
        }

        if (!filter_var($query->email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email inválido');
        }
    }
}
