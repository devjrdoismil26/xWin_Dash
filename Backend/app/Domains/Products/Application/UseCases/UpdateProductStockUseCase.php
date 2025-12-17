<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Commands\UpdateProductStockCommand;
use App\Domains\Products\Application\Handlers\UpdateProductStockHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class UpdateProductStockUseCase
{
    public function __construct(
        private UpdateProductStockHandler $updateProductStockHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(UpdateProductStockCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateStockUpdate($command->toArray());

            // Executar comando via handler
            $result = $this->updateProductStockHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('product.stock_updated', [
                'product_id' => $command->productId,
                'operation' => $command->operation,
                'quantity' => $command->quantity
            ]);

            Log::info('Product stock updated successfully', [
                'product_id' => $command->productId,
                'operation' => $command->operation
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Estoque atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating product stock', [
                'product_id' => $command->productId,
                'operation' => $command->operation,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao atualizar estoque: ' . $e->getMessage()
            ];
        }
    }
}
