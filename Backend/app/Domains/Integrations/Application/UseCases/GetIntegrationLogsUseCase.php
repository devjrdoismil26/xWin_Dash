<?php

namespace App\Domains\Integrations\Application\UseCases;

use App\Domains\Integrations\Application\Queries\GetIntegrationLogsQuery;
use App\Domains\Integrations\Application\Handlers\GetIntegrationLogsHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use Illuminate\Support\Facades\Log;

class GetIntegrationLogsUseCase
{
    public function __construct(
        private GetIntegrationLogsHandler $getIntegrationLogsHandler,
        private UserService $userService,
        private PermissionService $permissionService
    ) {
    }

    public function execute(GetIntegrationLogsQuery $query): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($query->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar permissão para visualizar logs de integrações
            if (!$this->permissionService->canViewIntegrationLogs($user, $query->integrationId)) {
                throw new \Exception("User does not have permission to view this integration logs");
            }

            // Validar filtros de data
            $this->validateDateFilters($query);

            // Executar busca dos logs da integração
            $result = $this->getIntegrationLogsHandler->handle($query);

            // Log da consulta
            Log::info("Integration logs retrieved", [
                'integration_id' => $query->integrationId,
                'user_id' => $query->userId,
                'filters' => [
                    'level' => $query->level,
                    'action' => $query->action,
                    'date_from' => $query->dateFrom,
                    'date_to' => $query->dateTo
                ],
                'total_logs' => $result['pagination']['total']
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to get integration logs", [
                'integration_id' => $query->integrationId,
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateDateFilters(GetIntegrationLogsQuery $query): void
    {
        if ($query->dateFrom && $query->dateTo) {
            $dateFrom = \Carbon\Carbon::parse($query->dateFrom);
            $dateTo = \Carbon\Carbon::parse($query->dateTo);

            if ($dateFrom->gt($dateTo)) {
                throw new \Exception("Date from cannot be greater than date to");
            }

            // Limitar busca a no máximo 30 dias
            if ($dateFrom->diffInDays($dateTo) > 30) {
                throw new \Exception("Date range cannot exceed 30 days");
            }
        }
    }
}
