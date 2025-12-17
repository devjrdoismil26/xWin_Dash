<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Queries\GetProductQuery;
use App\Domains\Products\Application\Handlers\GetProductHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetProductUseCase
{
    public function __construct(
        private GetProductHandler $getProductHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetProductQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'products', 'view_product');

            // Executar query via handler
            $result = $this->getProductHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Produto não encontrado'
                ];
            }

            Log::info('Product retrieved successfully', [
                'product_id' => $query->productId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Produto recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving product', [
                'product_id' => $query->productId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar produto: ' . $e->getMessage()
            ];
        }
    }
}
