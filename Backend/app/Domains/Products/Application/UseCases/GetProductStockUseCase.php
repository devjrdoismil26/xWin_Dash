<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Queries\GetProductStockQuery;
use App\Domains\Products\Application\Handlers\GetProductStockHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetProductStockUseCase
{
    public function __construct(
        private GetProductStockHandler $getProductStockHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetProductStockQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'products', 'view_product_stock');

            // Executar query via handler
            $result = $this->getProductStockHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Informações de estoque não encontradas'
                ];
            }

            Log::info('Product stock retrieved successfully', [
                'product_id' => $query->productId
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Estoque recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving product stock', [
                'product_id' => $query->productId,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar estoque: ' . $e->getMessage()
            ];
        }
    }
}
