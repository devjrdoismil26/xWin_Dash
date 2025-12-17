<?php

namespace App\Domains\Auth\Application\UseCases;

use App\Domains\Auth\Application\Queries\GetUserSessionsQuery;
use App\Domains\Auth\Application\Handlers\GetUserSessionsHandler;
use App\Domains\Auth\Application\Services\AuthApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetUserSessionsUseCase
{
    public function __construct(
        private GetUserSessionsHandler $getUserSessionsHandler,
        private AuthApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetUserSessionsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'auth', 'view_sessions');

            // Executar query via handler
            $result = $this->getUserSessionsHandler->handle($query);

            Log::info('User sessions retrieved successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Sessões recuperadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving user sessions', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar sessões: ' . $e->getMessage()
            ];
        }
    }
}
