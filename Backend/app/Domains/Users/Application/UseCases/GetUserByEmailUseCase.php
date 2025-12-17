<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Queries\GetUserByEmailQuery;
use App\Domains\Users\Application\Handlers\GetUserByEmailHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetUserByEmailUseCase
{
    public function __construct(
        private GetUserByEmailHandler $getUserByEmailHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetUserByEmailQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'users', 'view_user_by_email');

            // Executar query via handler
            $result = $this->getUserByEmailHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Usuário não encontrado'
                ];
            }

            Log::info('User retrieved by email successfully', [
                'email' => $query->email
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Usuário recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving user by email', [
                'email' => $query->email,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar usuário: ' . $e->getMessage()
            ];
        }
    }
}
