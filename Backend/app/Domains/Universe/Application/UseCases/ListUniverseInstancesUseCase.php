<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Queries\ListUniverseInstancesQuery;
use App\Domains\Universe\Application\Handlers\ListUniverseInstancesHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class ListUniverseInstancesUseCase
{
    public function __construct(
        private ListUniverseInstancesHandler $listHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(ListUniverseInstancesQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para listagem de instâncias'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateUserUniverseInstanceAccess($query->userId);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado às instâncias'
                ];
            }

            // Executar listagem
            $instances = $this->listHandler->handle($query);

            Log::info('Universe Instances listed successfully via Use Case', [
                'user_id' => $query->userId,
                'total_results' => $instances->total()
            ]);

            return [
                'success' => true,
                'message' => 'Instâncias listadas com sucesso',
                'data' => [
                    'instances' => $instances->items(),
                    'pagination' => [
                        'current_page' => $instances->currentPage(),
                        'per_page' => $instances->perPage(),
                        'total' => $instances->total(),
                        'last_page' => $instances->lastPage(),
                        'has_more' => $instances->hasMorePages()
                    ]
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ListUniverseInstancesUseCase', [
                'error' => $exception->getMessage(),
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem de instâncias'],
                'message' => 'Falha ao listar instâncias'
            ];
        }
    }
}
