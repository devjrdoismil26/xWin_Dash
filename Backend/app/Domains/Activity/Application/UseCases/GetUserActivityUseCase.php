<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Queries\GetUserActivityQuery;
use App\Domains\Activity\Application\Handlers\GetUserActivityHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetUserActivityUseCase
{
    public function __construct(
        private GetUserActivityHandler $getUserActivityHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetUserActivityQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess($query->userId, 'activity', 'view_user_activity');

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
