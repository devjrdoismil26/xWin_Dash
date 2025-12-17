<?php

namespace App\Domains\Leads\Application\Handlers;

use App\Domains\Leads\Application\Queries\ListLeadsQuery;
use App\Domains\Leads\Domain\Repositories\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Services\LeadService;
use Illuminate\Support\Facades\Log;

class ListLeadsHandler
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
        private LeadService $leadService
    ) {
    }

    public function handle(ListLeadsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'search' => $query->search,
                'status' => $query->status,
                'source' => $query->source,
                'assigned_to' => $query->assignedTo,
                'tags' => $query->tags,
                'min_score' => $query->minScore,
                'max_score' => $query->maxScore,
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
                'per_page' => $query->perPage ?? 15,
                'sort_by' => $query->sortBy ?? 'created_at',
                'sort_direction' => $query->sortDirection ?? 'desc'
            ];

            // Buscar leads
            $result = $this->leadRepository->findByFilters($filters, $paginationOptions);

            // Enriquecer com dados adicionais se solicitado
            if ($query->includeActivities) {
                foreach ($result['data'] as &$lead) {
                    $lead['recent_activities'] = $this->leadService->getLeadActivities($lead, 5);
                }
            }

            Log::info('Leads listed successfully', [
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing leads', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListLeadsQuery $query): void
    {
        // Query de listagem não precisa de validações específicas
    }
}
