<?php

namespace App\Domains\Users\Application\UseCases;

use App\Domains\Users\Application\Queries\GetUserActivityQuery;
use App\Domains\Users\Application\Handlers\GetUserActivityHandler;
use App\Domains\Users\Application\Services\UsersApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetUserActivityUseCase
{
    public function __construct(
        private GetUserActivityHandler $getUserActivityHandler,
        private UsersApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetUserActivityQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'users', 'view_user_activity');

            // Executar query via handler
            $result = $this->getUserActivityHandler->handle($query);

            Log::info('User activity retrieved successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Atividade do usuário recuperada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving user activity', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar atividade do usuário: ' . $e->getMessage()
            ];
        }
    }
}
