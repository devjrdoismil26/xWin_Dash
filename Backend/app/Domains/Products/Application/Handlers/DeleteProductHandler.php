<?php

namespace App\Domains\Products\Application\Handlers;

use App\Domains\Products\Application\Commands\DeleteProductCommand;
use App\Domains\Products\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Products\Domain\Services\ProductService;
use Illuminate\Support\Facades\Log;

class DeleteProductHandler
{
    public function __construct(
        private ProductRepositoryInterface $productRepository,
        private ProductService $productService
    ) {
    }

    public function handle(DeleteProductCommand $command): array
    {
        try {
            // Buscar o produto existente
            $product = $this->productRepository->findById($command->productId);

            if (!$product) {
                throw new \Exception('Produto não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há dados associados
            $hasAssociatedData = $this->productService->hasAssociatedData($product);

            if ($hasAssociatedData && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir produto com dados associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Limpar dados associados se necessário
            if ($command->forceDelete) {
                $this->productService->cleanupAssociatedData($product);
            }

            // Excluir o produto
            $this->productRepository->delete($command->productId);

            Log::info('Product deleted successfully', [
                'product_id' => $command->productId
            ]);

            return [
                'message' => 'Produto excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting product', [
                'product_id' => $command->productId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteProductCommand $command): void
    {
        if (empty($command->productId)) {
            throw new \InvalidArgumentException('ID do produto é obrigatório');
        }
    }
}
