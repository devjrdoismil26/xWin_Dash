<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Queries\GetMetricQuery;
use App\Domains\Analytics\Application\Handlers\GetMetricHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetMetricUseCase
{
    public function __construct(
        private GetMetricHandler $getMetricHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetMetricQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'analytics', 'view_metric');

            // Executar query via handler
            $result = $this->getMetricHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Métrica não encontrada'
                ];
            }

            Log::info('Analytics metric retrieved successfully', [
                'metric_id' => $query->metricId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Métrica recuperada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving analytics metric', [
                'metric_id' => $query->metricId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar métrica: ' . $e->getMessage()
            ];
        }
    }
}
