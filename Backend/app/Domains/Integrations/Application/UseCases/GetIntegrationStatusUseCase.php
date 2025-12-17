<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Queries\GetIntegrationStatusQuery;
use App\Domains\Integrations\Application\Handlers\GetIntegrationStatusHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class GetIntegrationStatusUseCase
{
    public function __construct(
        private GetIntegrationStatusHandler $getIntegrationStatusHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(GetIntegrationStatusQuery $query): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($query->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para visualizar status de integrações
            if (!$this->permissionService->canViewIntegrationStatus($user, $query->integrationId)) {
                throw new \Exception("User does not have permission to view this integration status");
            }

            // Executar busca do status da integração
            $result = $this->getIntegrationStatusHandler->handle($query);

            // Log da consulta
            Log::info("Integration status retrieved", [
                'integration_id' => $query->integrationId,
                'user_id' => $query->userId,
                'health_status' => $result['health_status']
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to get integration status", [
                'integration_id' => $query->integrationId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
