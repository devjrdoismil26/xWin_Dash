<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Commands\CreateProductCommand;
use App\Domains\Products\Application\Handlers\CreateProductHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class CreateProductUseCase
{
    public function __construct(
        private CreateProductHandler $createProductHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(CreateProductCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateProductCreation($command->toArray());

            // Executar comando via handler
            $result = $this->createProductHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('product.created', [
                'product_id' => $result['product']['id'],
                'name' => $command->name,
                'category' => $command->category
            ]);

            Log::info('Product created successfully', [
                'product_id' => $result['product']['id'],
                'name' => $command->name
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Produto criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating product', [
                'name' => $command->name,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao criar produto: ' . $e->getMessage()
            ];
        }
    }
}
