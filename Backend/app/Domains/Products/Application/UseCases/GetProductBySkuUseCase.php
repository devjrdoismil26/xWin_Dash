<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Queries\GetProductBySkuQuery;
use App\Domains\Products\Application\Handlers\GetProductBySkuHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetProductBySkuUseCase
{
    public function __construct(
        private GetProductBySkuHandler $getProductBySkuHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetProductBySkuQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'products', 'view_product_by_sku');

            // Executar query via handler
            $result = $this->getProductBySkuHandler->handle($query);

            if (!$result) {
                return [
                    'success' => false,
                    'message' => 'Produto não encontrado'
                ];
            }

            Log::info('Product retrieved by SKU successfully', [
                'sku' => $query->sku
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Produto recuperado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving product by SKU', [
                'sku' => $query->sku,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar produto: ' . $e->getMessage()
            ];
        }
    }
}
