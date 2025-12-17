<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Queries\GetDashboardQuery;
use App\Domains\Analytics\Domain\Repositories\DashboardRepositoryInterface;
use App\Domains\Analytics\Domain\Services\DashboardService;
use Illuminate\Support\Facades\Log;

class GetDashboardHandler
{
    public function __construct(
        private DashboardRepositoryInterface $dashboardRepository,
        private DashboardService $dashboardService
    ) {
    }

    public function handle(GetDashboardQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o dashboard
            $dashboard = $this->dashboardRepository->findById($query->dashboardId);

            if (!$dashboard) {
                return null;
            }

            // Enriquecer com dados se solicitado
            $result = $dashboard->toArray();

            if ($query->includeData) {
                $result['data'] = $this->dashboardService->getDashboardData(
                    $dashboard,
                    $query->dateFrom,
                    $query->dateTo
                );
            }

            Log::info('Dashboard retrieved successfully', [
                'dashboard_id' => $query->dashboardId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving dashboard', [
                'dashboard_id' => $query->dashboardId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetDashboardQuery $query): void
    {
        if (empty($query->dashboardId)) {
            throw new \InvalidArgumentException('ID do dashboard é obrigatório');
        }
    }
}
