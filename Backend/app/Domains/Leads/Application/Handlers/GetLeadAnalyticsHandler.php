<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Queries\GetLeadAnalyticsQuery;
use App\Domains\Leads\Domain\Services\LeadAnalyticsService;
use Illuminate\Support\Facades\Log;

class GetLeadAnalyticsHandler
{
    public function __construct(
        private LeadAnalyticsService $leadAnalyticsService
    ) {
    }

    public function handle(GetLeadAnalyticsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'date_from' => $query->dateFrom,
                'date_to' => $query->dateTo,
                'source' => $query->source,
                'status' => $query->status,
                'assigned_to' => $query->assignedTo
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Buscar analytics
            $analytics = $this->leadAnalyticsService->getAnalytics($filters);

            Log::info('Lead analytics retrieved successfully', [
                'filters' => $filters
            ]);

            return $analytics;
        } catch (\Exception $e) {
            Log::error('Error retrieving lead analytics', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetLeadAnalyticsQuery $query): void
    {
        // Query de analytics não precisa de validações específicas
    }
}
