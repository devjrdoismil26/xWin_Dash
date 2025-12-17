<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Queries\GetIntegrationQuery;
use App\Domains\Integrations\Repositories\IntegrationRepository;
use App\Domains\Integrations\Exceptions\IntegrationNotFoundException;

class GetIntegrationHandler
{
    public function __construct(
        private IntegrationRepository $integrationRepository
    ) {
    }

    public function handle(GetIntegrationQuery $query): array
    {
        $integration = $this->integrationRepository->findById($query->integrationId);

        if (!$integration) {
            throw new IntegrationNotFoundException(
                "Integration with ID {$query->integrationId} not found"
            );
        }

        return [
            'id' => $integration->id,
            'name' => $integration->name,
            'type' => $integration->type,
            'provider' => $integration->provider,
            'configuration' => $integration->configuration,
            'is_active' => $integration->is_active,
            'last_sync_at' => $integration->last_sync_at?->toISOString(),
            'created_at' => $integration->created_at->toISOString(),
            'updated_at' => $integration->updated_at->toISOString(),
            'status' => $integration->status,
            'health_score' => $integration->health_score,
            'error_count' => $integration->error_count,
            'last_error' => $integration->last_error,
            'metadata' => $integration->metadata
        ];
    }
}
