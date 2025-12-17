<?php

namespace App\Domains\Dashboard\Application\UseCases;

use App\Domains\Dashboard\Application\Commands\RefreshDashboardDataCommand;
use App\Domains\Dashboard\Application\Handlers\RefreshDashboardDataHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class RefreshDashboardDataUseCase
{
    public function __construct(
        private RefreshDashboardDataHandler $refreshDashboardDataHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(RefreshDashboardDataCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para atualizar dados do dashboard
            if (!$this->permissionService->canRefreshDashboardData($user)) {
                throw new \Exception("User does not have permission to refresh dashboard data");
            }

            // Verificar rate limiting para refresh
            $this->checkRefreshRateLimit($user);

            // Executar atualização dos dados
            $result = $this->refreshDashboardDataHandler->handle($command);

            // Log da atualização
            Log::info("Dashboard data refreshed successfully", [
                'user_id' => $command->userId,
                'widget_id' => $command->widgetId,
                'data_type' => $command->dataType,
                'refreshed_widgets' => count($result['refreshed_widgets'])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to refresh dashboard data", [
                'user_id' => $command->userId,
                'widget_id' => $command->widgetId,
                'data_type' => $command->dataType,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function checkRefreshRateLimit($user): void
    {
        // Verificar rate limiting para refresh de dados
        // Esta validação seria implementada com base no plano do usuário
        Log::info("Checking refresh rate limit", [
            'user_id' => $user->id
        ]);
    }
}
