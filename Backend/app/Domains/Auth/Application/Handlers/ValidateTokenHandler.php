<?php

namespace App\Domains\Auth\Application\Handlers;

use App\Domains\Auth\Application\Queries\ValidateTokenQuery;
use App\Domains\Auth\Domain\Services\TokenService;
use App\Domains\Users\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Log;

class ValidateTokenHandler
{
    public function __construct(
        private TokenService $tokenService,
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(ValidateTokenQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Validar token
            $tokenData = $this->tokenService->validateAccessToken($query->token, $query->deviceId);

            if (!$tokenData) {
                return null;
            }

            // Buscar usuário
            $user = $this->userRepository->findById($tokenData['user_id']);

            if (!$user || !$user->is_active) {
                return null;
            }

            Log::info('Token validated successfully', [
                'user_id' => $user->id,
                'device_id' => $query->deviceId
            ]);

            return [
                'user' => $user->toArray(),
                'token_data' => $tokenData,
                'valid' => true
            ];
        } catch (\Exception $e) {
            Log::error('Error validating token', [
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }

    private function validateQuery(ValidateTokenQuery $query): void
    {
        if (empty($query->token)) {
            throw new \InvalidArgumentException('Token é obrigatório');
        }
    }
}
