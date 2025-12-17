<?php

namespace App\Domains\Integrations\Application\Handlers;

use App\Domains\Integrations\Application\Queries\ListIntegrationsQuery;
use App\Domains\Integrations\Repositories\IntegrationRepository;

class ListIntegrationsHandler
{
    public function __construct(
        private IntegrationRepository $integrationRepository
    ) {
    }

    public function handle(ListIntegrationsQuery $query): array
    {
        $filters = [
            'type' => $query->type,
            'provider' => $query->provider,
            'is_active' => $query->isActive,
            'status' => $query->status,
            'user_id' => $query->userId
        ];

        $integrations = $this->integrationRepository->findByFilters(
            $filters,
            $query->limit,
            $query->offset,
            $query->sortBy,
            $query->sortDirection
        );

        $total = $this->integrationRepository->countByFilters($filters);

        return [
            'integrations' => $integrations->map(function ($integration) {
                return [
                    'id' => $integration->id,
                    'name' => $integration->name,
                    'type' => $integration->type,
                    'provider' => $integration->provider,
                    'is_active' => $integration->is_active,
                    'status' => $integration->status,
                    'health_score' => $integration->health_score,
                    'last_sync_at' => $integration->last_sync_at?->toISOString(),
                    'created_at' => $integration->created_at->toISOString(),
                    'error_count' => $integration->error_count
                ];
            })->toArray(),
            'pagination' => [
                'total' => $total,
                'limit' => $query->limit,
                'offset' => $query->offset,
                'has_more' => ($query->offset + $query->limit) < $total
            ]
        ];
    }
}
