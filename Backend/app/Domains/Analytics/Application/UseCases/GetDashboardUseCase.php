<?php

namespace App\Domains\Analytics\Application\UseCases;

use App\Domains\Analytics\Application\Queries\GetDashboardQuery;
use App\Domains\Analytics\Application\Handlers\GetDashboardHandler;
use App\Domains\Analytics\Application\Services\AnalyticsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetDashboardUseCase
{
    public function __construct(
        private GetDashboardHandler $getDashboardHandler,
        private AnalyticsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetDashboardQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'analytics', 'view_dashboard');

            // Executar query via handler
            $result = $this->getDashboardHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Dashboard não encontrado'
                ];
            }

            Log::info('Analytics dashboard retrieved successfully', [
                'dashboard_id' => $query->dashboardId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Dashboard recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving analytics dashboard', [
                'dashboard_id' => $query->dashboardId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar dashboard: ' . $e->getMessage()
            ];
        }
    }
}
