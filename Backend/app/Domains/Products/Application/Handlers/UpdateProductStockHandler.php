<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Commands\UpdateProductStockCommand;
use App\Domains\Products\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductService;
use App\Domains\Products\Domain\Services\StockService;
use Illuminate\Support\Facades\Log;

class UpdateProductStockHandler
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductService $productService,
        private StockService $stockService
    ) {
    }

    public function handle(UpdateProductStockCommand $command): array
    {
        try {
            // Buscar o produto existente
            $product = $this->productRepository->findById($command->productId);

            if (!$product) {
                throw new \Exception('Produto não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Atualizar estoque
            $stockResult = $this->stockService->updateStock([
                'product' => $product,
                'quantity' => $command->quantity,
                'operation' => $command->operation,
                'reason' => $command->reason
            ]);

            // Atualizar produto com novo estoque
            $updatedProduct = $this->productService->updateProductStock($product, $stockResult['new_stock']);

            // Salvar no repositório
            $savedProduct = $this->productRepository->save($updatedProduct);

            // Registrar atividade de atualização de estoque
            $this->productService->logActivity(
                $savedProduct,
                'stock_updated',
                "Estoque atualizado: {$command->operation} {$command->quantity} unidades",
                $command->reason
            );

            Log::info('Product stock updated successfully', [
                'product_id' => $command->productId,
                'operation' => $command->operation,
                'quantity' => $command->quantity
            ]);

            return [
                'product' => $savedProduct->toArray(),
                'stock_result' => $stockResult,
                'message' => 'Estoque atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating product stock', [
                'product_id' => $command->productId,
                'operation' => $command->operation,
                'quantity' => $command->quantity,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateProductStockCommand $command): void
    {
        if (empty($command->productId)) {
            throw new \InvalidArgumentException('ID do produto é obrigatório');
        }

        if (empty($command->quantity)) {
            throw new \InvalidArgumentException('Quantidade é obrigatória');
        }

        if ($command->quantity < 0) {
            throw new \InvalidArgumentException('Quantidade não pode ser negativa');
        }

        $validOperations = ['add', 'subtract', 'set'];
        if (!in_array($command->operation, $validOperations)) {
            throw new \InvalidArgumentException('Operação inválida');
        }
    }
}
