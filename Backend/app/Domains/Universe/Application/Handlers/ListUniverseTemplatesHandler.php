<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Queries\ListUniverseTemplatesQuery;
use App\Domains\Universe\Domain\Repositories\UniverseTemplateRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseTemplateService;
use Illuminate\Support\Facades\Log;

class ListUniverseTemplatesHandler
{
    public function __construct(
        private UniverseTemplateRepositoryInterface $universeTemplateRepository,
        private UniverseTemplateService $universeTemplateService
    ) {
    }

    public function handle(ListUniverseTemplatesQuery $query): array
    {
        try {
            // Preparar filtros
            $filters = [
                'user_id' => $query->userId,
                'category' => $query->category,
                'is_public' => $query->isPublic,
                'tags' => $query->tags,
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

            // Buscar templates
            $result = $this->universeTemplateRepository->findByFilters($filters, $paginationOptions);

            // Enriquecer dados se solicitado
            if ($query->includeInstances || $query->includeUsage) {
                foreach ($result['data'] as &$template) {
                    if ($query->includeInstances) {
                        $template['instances'] = $this->universeTemplateService->getTemplateInstances($template, $query->instancesLimit ?? 5);
                    }
                    if ($query->includeUsage) {
                        $template['usage_stats'] = $this->universeTemplateService->getTemplateUsageStats($template);
                    }
                }
            }

            Log::info('Universe templates listed successfully', [
                'user_id' => $query->userId,
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing universe templates', [
                'user_id' => $query->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
