<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Queries\GetUserQuery;
use App\Domains\Users\Application\Handlers\GetUserHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetUserUseCase
{
    public function __construct(
        private GetUserHandler $getUserHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetUserQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'users', 'view_user');

            // Executar query via handler
            $result = $this->getUserHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Usuário não encontrado'
                ];
            }

            Log::info('User retrieved successfully', [
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Usuário recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving user', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar usuário: ' . $e->getMessage()
            ];
        }
    }
}
