<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Queries\GetIntegrationStatusQuery;
use App\Domains\Integrations\Services\IntegrationService;
use App\Domains\Integrations\Repositories\IntegrationRepository;
use App\Domains\Integrations\Exceptions\IntegrationNotFoundException;

class GetIntegrationStatusHandler
{
    public function __construct(
        private IntegrationService $integrationService,
        private IntegrationRepository $integrationRepository
    ) {
    }

    public function handle(GetIntegrationStatusQuery $query): array
    {
        $integration = $this->integrationRepository->findById($query->integrationId);

        if (!$integration) {
            throw new IntegrationNotFoundException(
                "Integration with ID {$query->integrationId} not found"
            );
        }

        // Verificar status de saúde da integração
        $healthStatus = $this->integrationService->checkIntegrationHealth($integration);

        return [
            'integration_id' => $integration->id,
            'name' => $integration->name,
            'type' => $integration->type,
            'provider' => $integration->provider,
            'is_active' => $integration->is_active,
            'status' => $integration->status,
            'health_score' => $integration->health_score,
            'health_status' => $healthStatus['status'],
            'health_details' => $healthStatus['details'],
            'last_sync_at' => $integration->last_sync_at?->toISOString(),
            'error_count' => $integration->error_count,
            'last_error' => $integration->last_error,
            'last_error_at' => $integration->last_error_at?->toISOString(),
            'uptime_percentage' => $healthStatus['uptime_percentage'] ?? null,
            'response_time_avg' => $healthStatus['response_time_avg'] ?? null,
            'checked_at' => now()->toISOString()
        ];
    }
}
