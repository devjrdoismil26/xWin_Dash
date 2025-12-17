<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Queries\GetLeadActivitiesQuery;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use Illuminate\Support\Facades\Log;

class GetLeadActivitiesHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService
    ) {
    }

    public function handle(GetLeadActivitiesQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Verificar se o lead existe
            $lead = $this->leadRepository->findById($query->leadId);
            if (!$lead) {
                throw new \Exception('Lead não encontrado');
            }

            // Preparar filtros
            $filters = [
                'lead_id' => $query->leadId,
                'activity_type' => $query->activityType,
                'date_from' => $query->dateFrom,
                'date_to' => $query->dateTo
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Preparar opções de paginação
            $paginationOptions = [
                'page' => $query->page ?? 1,
                'per_page' => $query->perPage ?? 20,
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar atividades
            $result = $this->leadService->getLeadActivities($lead, $filters, $paginationOptions);

            Log::info('Lead activities retrieved successfully', [
                'lead_id' => $query->leadId,
                'count' => count($result['data'] ?? [])
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving lead activities', [
                'lead_id' => $query->leadId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetLeadActivitiesQuery $query): void
    {
        if (empty($query->leadId)) {
            throw new \InvalidArgumentException('ID do lead é obrigatório');
        }
    }
}
