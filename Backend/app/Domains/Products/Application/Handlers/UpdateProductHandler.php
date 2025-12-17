<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Commands\UpdateProductCommand;
use App\Domains\Products\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductService;
use App\Domains\Products\Domain\Services\ProductValidationService;
use Illuminate\Support\Facades\Log;

class UpdateProductHandler
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductService $productService,
        private ProductValidationService $productValidationService
    ) {
    }

    public function handle(UpdateProductCommand $command): array
    {
        try {
            // Buscar o produto existente
            $product = $this->productRepository->findById($command->productId);

            if (!$product) {
                throw new \Exception('Produto não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o SKU já existe (se foi alterado)
            if ($command->sku && $command->sku !== $product->sku) {
                $existingProduct = $this->productRepository->findBySku($command->sku);
                if ($existingProduct) {
                    throw new \Exception('SKU já está em uso por outro produto');
                }
            }

            // Validar regras de negócio
            $this->productValidationService->validateProductUpdate($command->toArray());

            // Atualizar o produto
            $updateData = array_filter([
                'name' => $command->name,
                'description' => $command->description,
                'sku' => $command->sku,
                'price' => $command->price,
                'cost' => $command->cost,
                'stock' => $command->stock,
                'category' => $command->category,
                'images' => $command->images,
                'specifications' => $command->specifications,
                'tags' => $command->tags,
                'is_active' => $command->isActive,
                'is_digital' => $command->isDigital,
                'variants' => $command->variants
            ], function ($value) {
                return $value !== null;
            });

            $updatedProduct = $this->productService->updateProduct($product, $updateData);

            // Salvar no repositório
            $savedProduct = $this->productRepository->save($updatedProduct);

            // Registrar atividade de atualização
            $this->productService->logActivity($savedProduct, 'updated', 'Produto atualizado');

            Log::info('Product updated successfully', [
                'product_id' => $command->productId
            ]);

            return [
                'product' => $savedProduct->toArray(),
                'message' => 'Produto atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating product', [
                'product_id' => $command->productId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateProductCommand $command): void
    {
        if (empty($command->productId)) {
            throw new \InvalidArgumentException('ID do produto é obrigatório');
        }

        if ($command->price !== null && $command->price < 0) {
            throw new \InvalidArgumentException('Preço não pode ser negativo');
        }

        if ($command->cost !== null && $command->cost < 0) {
            throw new \InvalidArgumentException('Custo não pode ser negativo');
        }

        if ($command->stock !== null && $command->stock < 0) {
            throw new \InvalidArgumentException('Estoque não pode ser negativo');
        }
    }
}
