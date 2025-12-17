<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Queries\GetAnalyticsDataQuery;
use App\Domains\Analytics\Application\Handlers\GetAnalyticsDataHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetAnalyticsDataUseCase
{
    public function __construct(
        private GetAnalyticsDataHandler $getAnalyticsDataHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetAnalyticsDataQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'analytics', 'view_data');

            // Executar query via handler
            $result = $this->getAnalyticsDataHandler->handle($query);

            Log::info('Analytics data retrieved successfully', [
                'metrics_count' => count($query->metrics)
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Dados analíticos recuperados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving analytics data', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar dados analíticos: ' . $e->getMessage()
            ];
        }
    }
}
