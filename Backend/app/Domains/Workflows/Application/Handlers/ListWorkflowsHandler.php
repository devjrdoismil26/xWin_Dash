<?php

namespace App\Domains\Workflows\Application\Handlers;

use App\Domains\Workflows\Application\Queries\ListWorkflowsQuery;
use App\Domains\Workflows\Domain\Repositories\WorkflowRepositoryInterface;
use App\Domains\Workflows\Domain\Services\WorkflowServiceInterface;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowStatus;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowType;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class ListWorkflowsHandler
{
    public function __construct(
        private WorkflowRepositoryInterface $workflowRepository,
        private WorkflowServiceInterface $workflowService
    ) {
    }

    public function handle(ListWorkflowsQuery $query): LengthAwarePaginator
    {
        try {
            // Preparar filtros
            $filters = $this->prepareFilters($query);

            // Preparar opções de paginação e ordenação
            $paginationOptions = $this->preparePaginationOptions($query);

            // Buscar workflows
            $workflows = $this->workflowRepository->findByFilters(
                $filters,
                $paginationOptions
            );

            // Aplicar transformações se necessário
            if ($query->includeNodes) {
                $workflows = $this->enrichWithNodes($workflows);
            }

            if ($query->includeExecutions) {
                $workflows = $this->enrichWithExecutions($workflows);
            }

            if ($query->includeAnalytics) {
                $workflows = $this->enrichWithAnalytics($workflows);
            }

            Log::info('Workflows listed successfully', [
                'user_id' => $query->userId,
                'filters' => $filters,
                'total_results' => $workflows->total()
            ]);

            return $workflows;
        } catch (\Exception $e) {
            Log::error('Failed to list workflows', [
                'user_id' => $query->userId,
                'filters' => $filters ?? [],
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function prepareFilters(ListWorkflowsQuery $query): array
    {
        $filters = [
            'user_id' => $query->userId
        ];

        if ($query->status !== null) {
            $filters['status'] = new WorkflowStatus($query->status);
        }

        if ($query->type !== null) {
            $filters['type'] = new WorkflowType($query->type);
        }

        if ($query->search !== null) {
            $filters['search'] = $query->search;
        }

        if ($query->tags !== null && !empty($query->tags)) {
            $filters['tags'] = $query->tags;
        }

        if ($query->dateFrom !== null) {
            $filters['date_from'] = $query->dateFrom;
        }

        if ($query->dateTo !== null) {
            $filters['date_to'] = $query->dateTo;
        }

        return $filters;
    }

    private function preparePaginationOptions(ListWorkflowsQuery $query): array
    {
        return [
            'page' => $query->page,
            'per_page' => $query->perPage,
            'sort_by' => $query->sortBy,
            'sort_direction' => $query->sortDirection
        ];
    }

    private function enrichWithNodes(LengthAwarePaginator $workflows): LengthAwarePaginator
    {
        foreach ($workflows->items() as $workflow) {
            try {
                $nodes = $this->workflowService->getWorkflowNodes($workflow->getId());
                $workflow->setNodes($nodes);
            } catch (\Exception $e) {
                Log::warning('Failed to load nodes for workflow', [
                    'workflow_id' => $workflow->getId(),
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $workflows;
    }

    private function enrichWithExecutions(LengthAwarePaginator $workflows): LengthAwarePaginator
    {
        foreach ($workflows->items() as $workflow) {
            try {
                $executions = $this->workflowService->getWorkflowExecutions($workflow->getId());
                $workflow->setExecutions($executions);
            } catch (\Exception $e) {
                Log::warning('Failed to load executions for workflow', [
                    'workflow_id' => $workflow->getId(),
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $workflows;
    }

    private function enrichWithAnalytics(LengthAwarePaginator $workflows): LengthAwarePaginator
    {
        foreach ($workflows->items() as $workflow) {
            try {
                $analytics = $this->workflowService->getWorkflowAnalytics($workflow->getId());
                $workflow->setAnalytics($analytics);
            } catch (\Exception $e) {
                Log::warning('Failed to load analytics for workflow', [
                    'workflow_id' => $workflow->getId(),
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $workflows;
    }
}
