<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Queries\GetUserPermissionsQuery;
use App\Domains\Auth\Application\Handlers\GetUserPermissionsHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetUserPermissionsUseCase
{
    public function __construct(
        private GetUserPermissionsHandler $getUserPermissionsHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetUserPermissionsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'auth', 'view_permissions');

            // Executar query via handler
            $result = $this->getUserPermissionsHandler->handle($query);

            Log::info('User permissions retrieved successfully', [
                'user_id' => $query->userId,
                'module' => $query->module
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Permissões recuperadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving user permissions', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar permissões: ' . $e->getMessage()
            ];
        }
    }
}
