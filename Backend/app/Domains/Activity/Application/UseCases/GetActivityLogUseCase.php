<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Queries\GetActivityLogQuery;
use App\Domains\Activity\Application\Handlers\GetActivityLogHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetActivityLogUseCase
{
    public function __construct(
        private GetActivityLogHandler $getActivityLogHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetActivityLogQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'activity', 'view_log');

            // Executar query via handler
            $result = $this->getActivityLogHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Log de atividade não encontrado'
                ];
            }

            Log::info('Activity log retrieved successfully', [
                'activity_id' => $query->activityId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Log de atividade recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving activity log', [
                'activity_id' => $query->activityId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar log de atividade: ' . $e->getMessage()
            ];
        }
    }
}
