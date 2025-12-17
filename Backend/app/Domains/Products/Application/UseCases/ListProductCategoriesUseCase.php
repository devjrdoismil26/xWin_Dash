<?php

namespace App\Domains\Products\Application\UseCases;

use App\Domains\Products\Application\Queries\ListProductCategoriesQuery;
use App\Domains\Products\Application\Handlers\ListProductCategoriesHandler;
use App\Domains\Products\Application\Services\ProductsApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class ListProductCategoriesUseCase
{
    public function __construct(
        private ListProductCategoriesHandler $listProductCategoriesHandler,
        private ProductsApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(ListProductCategoriesQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'products', 'list_categories');

            // Executar query via handler
            $result = $this->listProductCategoriesHandler->handle($query);

            Log::info('Product categories listed successfully', [
                'count' => count($result['data'] ?? [])
            ]);

            return [
                'success' => true,
                'data' => $result['data'] ?? [],
                'pagination' => $result['pagination'] ?? null,
                'message' => 'Categorias listadas com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error listing product categories', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao listar categorias: ' . $e->getMessage()
            ];
        }
    }
}
