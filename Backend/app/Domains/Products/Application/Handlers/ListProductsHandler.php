<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Queries\ListProductsQuery;
use App\Domains\Products\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductService;
use Illuminate\Support\Facades\Log;

class ListProductsHandler
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductService $productService
    ) {
    }

    public function handle(ListProductsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Preparar filtros
            $filters = [
                'search' => $query->search,
                'category' => $query->category,
                'min_price' => $query->minPrice,
                'max_price' => $query->maxPrice,
                'is_active' => $query->isActive,
                'is_digital' => $query->isDigital,
                'tags' => $query->tags,
                'min_stock' => $query->minStock,
                'max_stock' => $query->maxStock,
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

            // Buscar produtos
            $result = $this->productRepository->findByFilters($filters, $paginationOptions);

            // Enriquecer com dados adicionais se solicitado
            if ($query->includeVariants) {
                foreach ($result['data'] as &$product) {
                    $product['variants'] = $this->productService->getProductVariants($product);
                }
            }

            Log::info('Products listed successfully', [
                'count' => count($result['data']),
                'filters' => $filters
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error listing products', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(ListProductsQuery $query): void
    {
        // Query de listagem não precisa de validações específicas
    }
}
