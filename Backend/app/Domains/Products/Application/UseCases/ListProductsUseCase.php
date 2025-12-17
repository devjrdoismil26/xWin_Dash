<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Queries\ListProductsQuery;
use App\Domains\Products\Application\Handlers\ListProductsHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListProductsUseCase
{
    public function __construct(
        private ListProductsHandler $listProductsHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListProductsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'products', 'list_products');

            // Executar query via handler
            $result = $this->listProductsHandler->handle($query);

            Log::info('Products listed successfully', [
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Produtos listados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing products', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar produtos: ' . $e->getMessage()
            ];
        }
    }
}
