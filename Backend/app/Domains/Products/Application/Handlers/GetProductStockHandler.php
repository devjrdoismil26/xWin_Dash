<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Queries\GetProductStockQuery;
use App\Domains\Products\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductService;
use App\Domains\Products\Domain\Services\StockService;
use Illuminate\Support\Facades\Log;

class GetProductStockHandler
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductService $productService,
        private StockService $stockService
    ) {
    }

    public function handle(GetProductStockQuery $query): ?array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Verificar se o produto existe
            $product = $this->productRepository->findById($query->productId);
            if (!$product) {
                throw new \Exception('Produto não encontrado');
            }

            // Buscar informações de estoque
            $stockInfo = $this->stockService->getProductStock($product);

            // Enriquecer com histórico se solicitado
            if ($query->includeHistory) {
                $stockInfo['history'] = $this->stockService->getStockHistory($product);
            }

            Log::info('Product stock retrieved successfully', [
                'product_id' => $query->productId
            ]);

            return $stockInfo;
        } catch (\Exception $e) {
            Log::error('Error retrieving product stock', [
                'product_id' => $query->productId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetProductStockQuery $query): void
    {
        if (empty($query->productId)) {
            throw new \InvalidArgumentException('ID do produto é obrigatório');
        }
    }
}
