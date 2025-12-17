<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Queries\ListUsersQuery;
use App\Domains\Users\Application\Handlers\ListUsersHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListUsersUseCase
{
    public function __construct(
        private ListUsersHandler $listUsersHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListUsersQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'users', 'list_users');

            // Executar query via handler
            $result = $this->listUsersHandler->handle($query);

            Log::info('Users listed successfully', [
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Usuários listados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing users', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar usuários: ' . $e->getMessage()
            ];
        }
    }
}
