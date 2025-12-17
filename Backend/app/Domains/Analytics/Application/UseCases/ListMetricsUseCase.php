<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Queries\ListMetricsQuery;
use App\Domains\Analytics\Application\Handlers\ListMetricsHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListMetricsUseCase
{
    public function __construct(
        private ListMetricsHandler $listMetricsHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListMetricsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'analytics', 'list_metrics');

            // Executar query via handler
            $result = $this->listMetricsHandler->handle($query);

            Log::info('Analytics metrics listed successfully', [
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Métricas listadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing analytics metrics', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar métricas: ' . $e->getMessage()
            ];
        }
    }
}
