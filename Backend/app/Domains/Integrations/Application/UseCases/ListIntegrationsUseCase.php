<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Queries\ListIntegrationsQuery;
use App\Domains\Integrations\Application\Handlers\ListIntegrationsHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class ListIntegrationsUseCase
{
    public function __construct(
        private ListIntegrationsHandler $listIntegrationsHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(ListIntegrationsQuery $query): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($query->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para listar integrações
            if (!$this->permissionService->canListIntegrations($user)) {
                throw new \Exception("User does not have permission to list integrations");
            }

            // Aplicar filtros de permissão baseados no usuário
            $this->applyUserBasedFilters($query, $user);

            // Executar listagem das integrações
            $result = $this->listIntegrationsHandler->handle($query);

            // Log da consulta
            Log::info("Integrations listed", [
                'user_id' => $query->userId,
                'filters' => [
                    'type' => $query->type,
                    'provider' => $query->provider,
                    'is_active' => $query->isActive
                ],
                'total_found' => $result['pagination']['total']
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to list integrations", [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function applyUserBasedFilters(ListIntegrationsQuery $query, $user): void
    {
        // Se o usuário não for admin, filtrar apenas integrações que ele pode acessar
        if (!$user->is_admin) {
            $query->userId = $user->id;
        }
    }
}
