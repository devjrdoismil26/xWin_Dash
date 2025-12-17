<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Commands\CreateProductCategoryCommand;
use App\Domains\Products\Domain\Repositories\ProductCategoryRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductCategoryService;
use Illuminate\Support\Facades\Log;

class CreateProductCategoryHandler
{
    public function __construct(
        private ProductCategoryRepositoryInterface $productCategoryRepository,
        private ProductCategoryService $productCategoryService
    ) {
    }

    public function handle(CreateProductCategoryCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se a categoria pai existe
            if ($command->parentId) {
                $parentCategory = $this->productCategoryRepository->findById($command->parentId);
                if (!$parentCategory) {
                    throw new \Exception('Categoria pai não encontrada');
                }
            }

            // Criar a categoria no domínio
            $category = $this->productCategoryService->createCategory([
                'name' => $command->name,
                'description' => $command->description,
                'parent_id' => $command->parentId,
                'slug' => $command->slug,
                'metadata' => $command->metadata
            ]);

            // Salvar no repositório
            $savedCategory = $this->productCategoryRepository->save($category);

            Log::info('Product category created successfully', [
                'category_id' => $savedCategory->id,
                'name' => $command->name,
                'parent_id' => $command->parentId
            ]);

            return [
                'category' => $savedCategory->toArray(),
                'message' => 'Categoria criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating product category', [
                'name' => $command->name,
                'parent_id' => $command->parentId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateProductCategoryCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome é obrigatório');
        }
    }
}
