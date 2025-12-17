<?php

namespace App\Domains\Dashboard\Application\UseCases;

use App\Domains\Dashboard\Application\Queries\GetDashboardOverviewQuery;
use App\Domains\Dashboard\Application\Handlers\GetDashboardOverviewHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class GetDashboardOverviewUseCase
{
    public function __construct(
        private GetDashboardOverviewHandler $getDashboardOverviewHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(GetDashboardOverviewQuery $query): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($query->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para visualizar dashboard
            if (!$this->permissionService->canViewDashboard($user)) {
                throw new \Exception("User does not have permission to view dashboard");
            }

            // Executar busca do overview
            $result = $this->getDashboardOverviewHandler->handle($query);

            // Log da consulta
            Log::info("Dashboard overview retrieved", [
                'user_id' => $query->userId,
                'date_range' => $query->dateRange,
                'metrics_count' => count($query->metrics ?? [])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to get dashboard overview", [
                'user_id' => $query->userId,
                'date_range' => $query->dateRange,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
