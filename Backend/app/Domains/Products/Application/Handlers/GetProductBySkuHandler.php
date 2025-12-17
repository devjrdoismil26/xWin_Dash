<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Queries\GetProductBySkuQuery;
use App\Domains\Products\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductService;
use Illuminate\Support\Facades\Log;

class GetProductBySkuHandler
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductService $productService
    ) {
    }

    public function handle(GetProductBySkuQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Buscar o produto por SKU
            $product = $this->productRepository->findBySku($query->sku);

            if (!$product) {
                return null;
            }

            // Enriquecer com dados adicionais se solicitado
            $result = $product->toArray();

            if ($query->includeVariants) {
                $result['variants'] = $this->productService->getProductVariants($product);
            }

            Log::info('Product retrieved by SKU successfully', [
                'sku' => $query->sku
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Error retrieving product by SKU', [
                'sku' => $query->sku,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetProductBySkuQuery $query): void
    {
        if (empty($query->sku)) {
            throw new \InvalidArgumentException('SKU é obrigatório');
        }
    }
}
