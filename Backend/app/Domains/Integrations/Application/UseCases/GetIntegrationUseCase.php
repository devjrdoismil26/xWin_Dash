<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Queries\GetIntegrationQuery;
use App\Domains\Integrations\Application\Handlers\GetIntegrationHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class GetIntegrationUseCase
{
    public function __construct(
        private GetIntegrationHandler $getIntegrationHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(GetIntegrationQuery $query): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($query->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para visualizar integrações
            if (!$this->permissionService->canViewIntegration($user, $query->integrationId)) {
                throw new \Exception("User does not have permission to view this integration");
            }

            // Executar busca da integração
            $result = $this->getIntegrationHandler->handle($query);

            // Log da consulta
            Log::info("Integration retrieved", [
                'integration_id' => $query->integrationId,
                'user_id' => $query->userId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to get integration", [
                'integration_id' => $query->integrationId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
