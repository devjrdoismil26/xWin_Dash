<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Queries\ListProductCategoriesQuery;
use App\Domains\Products\Domain\Repositories\ProductCategoryRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductCategoryService;
use Illuminate\Support\Facades\Log;

class ListProductCategoriesHandler
{
    public function __construct(
        private ProductCategoryRepositoryInterface $productCategoryRepository,
        private ProductCategoryService $productCategoryService
    ) {
    }

    public function handle(ListProductCategoriesQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'parent_id' => $query->parentId,
                'search' => $query->search
            ];

            // Remover filtros vazios
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            // Preparar opções de paginação
            $paginationOptions = [
                'page' => $query->page ?? 1,
                'per_page' => $query->perPage ?? 20,
                'sort_by' => $query->sortBy ?? 'name',
                'sort_direction' => $query->sortDirection ?? 'asc'
            ];

            // Buscar categorias
            $result = $this->productCategoryRepository->findByFilters($filters, $paginationOptions);

            Log::info('Product categories listed successfully', [
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing product categories', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListProductCategoriesQuery $query): void
    {
        // Query de listagem não precisa de validações específicas
    }
}
