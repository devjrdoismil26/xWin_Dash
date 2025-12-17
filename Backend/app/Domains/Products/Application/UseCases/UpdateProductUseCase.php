<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Commands\UpdateProductCommand;
use App\Domains\Products\Application\Handlers\UpdateProductHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateProductUseCase
{
    public function __construct(
        private UpdateProductHandler $updateProductHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateProductCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateProductUpdate($command->toArray());

            // Executar comando via handler
            $result = $this->updateProductHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('product.updated', [
                'product_id' => $command->productId,
                'changes' => $command->toArray()
            ]);

            Log::info('Product updated successfully', [
                'product_id' => $command->productId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Produto atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating product', [
                'product_id' => $command->productId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar produto: ' . $e->getMessage()
            ];
        }
    }
}
