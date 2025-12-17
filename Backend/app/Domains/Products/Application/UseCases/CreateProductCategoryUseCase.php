<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Commands\CreateProductCategoryCommand;
use App\Domains\Products\Application\Handlers\CreateProductCategoryHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateProductCategoryUseCase
{
    public function __construct(
        private CreateProductCategoryHandler $createProductCategoryHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateProductCategoryCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateCategoryCreation($command->toArray());

            // Executar comando via handler
            $result = $this->createProductCategoryHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('product.category_created', [
                'category_id' => $result['category']['id'],
                'name' => $command->name,
                'parent_id' => $command->parentId
            ]);

            Log::info('Product category created successfully', [
                'category_id' => $result['category']['id'],
                'name' => $command->name
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Categoria criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating product category', [
                'name' => $command->name,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar categoria: ' . $e->getMessage()
            ];
        }
    }
}
