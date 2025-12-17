<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Commands\DeleteProductCommand;
use App\Domains\Products\Application\Handlers\DeleteProductHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class DeleteProductUseCase
{
    public function __construct(
        private DeleteProductHandler $deleteProductHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(DeleteProductCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateProductDeletion($command->toArray());

            // Executar comando via handler
            $result = $this->deleteProductHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('product.deleted', [
                'product_id' => $command->productId,
                'force_delete' => $command->forceDelete
            ]);

            Log::info('Product deleted successfully', [
                'product_id' => $command->productId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Produto excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting product', [
                'product_id' => $command->productId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao excluir produto: ' . $e->getMessage()
            ];
        }
    }
}
