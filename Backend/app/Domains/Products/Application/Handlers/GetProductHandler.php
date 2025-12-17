<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Queries\GetProductQuery;
use App\Domains\Products\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductService;
use Illuminate\Support\Facades\Log;

class GetProductHandler
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductService $productService
    ) {
    }

    public function handle(GetProductQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o produto
            $product = $this->productRepository->findById($query->productId);

            if (!$product) {
                return null;
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $product->toArray();

            if ($query->includeCategory) {
                $result['category'] = $this->productService->getProductCategory($product);
            }

            if ($query->includeReviews) {
                $result['reviews'] = $this->productService->getProductReviews($product);
            }

            if ($query->includeAnalytics) {
                $result['analytics'] = $this->productService->getProductAnalytics($product);
            }

            Log::info('Product retrieved successfully', [
                'product_id' => $query->productId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving product', [
                'product_id' => $query->productId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetProductQuery $query): void
    {
        if (empty($query->productId)) {
            throw new \InvalidArgumentException('ID do produto é obrigatório');
        }
    }
}
