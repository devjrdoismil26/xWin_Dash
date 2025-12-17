<?php

namespace App\Domains\Dashboard\Application\UseCases;

use App\Domains\Dashboard\Application\Commands\ExportDashboardDataCommand;
use App\Domains\Dashboard\Application\Handlers\ExportDashboardDataHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class ExportDashboardDataUseCase
{
    public function __construct(
        private ExportDashboardDataHandler $exportDashboardDataHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(ExportDashboardDataCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para exportar dados
            if (!$this->permissionService->canExportDashboardData($user)) {
                throw new \Exception("User does not have permission to export dashboard data");
            }

            // Verificar limite de exportações
            $this->checkExportLimit($user);

            // Executar exportação
            $result = $this->exportDashboardDataHandler->handle($command);

            // Log da exportação
            Log::info("Dashboard data exported successfully", [
                'user_id' => $command->userId,
                'format' => $command->format,
                'file_path' => $result['file_path'],
                'widget_count' => $result['widget_count']
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to export dashboard data", [
                'user_id' => $command->userId,
                'format' => $command->format,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function checkExportLimit($user): void
    {
        // Verificar se o usuário não excedeu o limite de exportações
        // Esta validação seria implementada com base no plano do usuário
        Log::info("Checking export limit", [
            'user_id' => $user->id
        ]);
    }
}
