<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Commands\CreateProductCommand;
use App\Domains\Products\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductService;
use App\Domains\Products\Domain\Services\ProductValidationService;
use Illuminate\Support\Facades\Log;

class CreateProductHandler
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductService $productService,
        private ProductValidationService $productValidationService
    ) {
    }

    public function handle(CreateProductCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o SKU já existe
            if ($command->sku) {
                $existingProduct = $this->productRepository->findBySku($command->sku);
                if ($existingProduct) {
                    throw new \Exception('SKU já está em uso');
                }
            }

            // Validar regras de negócio
            $this->productValidationService->validateProductCreation($command->toArray());

            // Criar o produto no domínio
            $product = $this->productService->createProduct([
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
            ]);

            // Salvar no repositório
            $savedProduct = $this->productRepository->save($product);

            // Registrar atividade de criação
            $this->productService->logActivity($savedProduct, 'created', 'Produto criado');

            Log::info('Product created successfully', [
                'product_id' => $savedProduct->id,
                'name' => $command->name,
                'sku' => $command->sku
            ]);

            return [
                'product' => $savedProduct->toArray(),
                'message' => 'Produto criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating product', [
                'name' => $command->name,
                'sku' => $command->sku,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateProductCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome é obrigatório');
        }

        if (empty($command->description)) {
            throw new \InvalidArgumentException('Descrição é obrigatória');
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
