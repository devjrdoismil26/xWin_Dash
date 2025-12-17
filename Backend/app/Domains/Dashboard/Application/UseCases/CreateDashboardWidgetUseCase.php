<?php

namespace App\Domains\Dashboard\Application\UseCases;

use App\Domains\Dashboard\Application\Commands\CreateDashboardWidgetCommand;
use App\Domains\Dashboard\Application\Handlers\CreateDashboardWidgetHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class CreateDashboardWidgetUseCase
{
    public function __construct(
        private CreateDashboardWidgetHandler $createDashboardWidgetHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(CreateDashboardWidgetCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para criar widgets
            if (!$this->permissionService->canCreateDashboardWidget($user)) {
                throw new \Exception("User does not have permission to create dashboard widgets");
            }

            // Verificar limite de widgets por usuário
            $this->checkWidgetLimit($user);

            // Executar criação do widget
            $result = $this->createDashboardWidgetHandler->handle($command);

            // Log da criação
            Log::info("Dashboard widget created successfully", [
                'widget_id' => $result['widget_id'],
                'name' => $command->name,
                'type' => $command->type,
                'user_id' => $command->userId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to create dashboard widget", [
                'name' => $command->name,
                'type' => $command->type,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function checkWidgetLimit($user): void
    {
        // Verificar se o usuário não excedeu o limite de widgets
        // Esta validação seria implementada com base no plano do usuário
        Log::info("Checking widget limit", [
            'user_id' => $user->id
        ]);
    }
}
