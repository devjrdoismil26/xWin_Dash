<?php

namespace App\Domains\Activity\Application\UseCases;

use App\Domains\Activity\Application\Queries\GetEntityActivityQuery;
use App\Domains\Activity\Application\Handlers\GetEntityActivityHandler;
use App\Domains\Activity\Application\Services\ActivityApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetEntityActivityUseCase
{
    public function __construct(
        private GetEntityActivityHandler $getEntityActivityHandler,
        private ActivityApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetEntityActivityQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'activity', 'view_entity_activity');

            // Executar query via handler
            $result = $this->getEntityActivityHandler->handle($query);

            Log::info('Entity activity retrieved successfully', [
                'entity_type' => $query->entityType,
                'entity_id' => $query->entityId,
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Atividade da entidade recuperada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving entity activity', [
                'entity_type' => $query->entityType,
                'entity_id' => $query->entityId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar atividade da entidade: ' . $e->getMessage()
            ];
        }
    }
}
