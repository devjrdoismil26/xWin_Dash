<?php

namespace App\Domains\Workflows\Application\UseCases;

use App\Domains\Workflows\Application\Queries\ListWorkflowsQuery;
use App\Domains\Workflows\Application\Handlers\ListWorkflowsHandler;
use App\Domains\Workflows\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class ListWorkflowsUseCase
{
    public function __construct(
        private ListWorkflowsHandler $listHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(ListWorkflowsQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para listagem de workflows'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateUserWorkflowAccess($query->userId);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado aos workflows'
                ];
            }

            // Executar listagem
            $workflows = $this->listHandler->handle($query);

            Log::info('Workflows listed successfully via Use Case', [
                'user_id' => $query->userId,
                'total_results' => $workflows->total()
            ]);

            return [
                'success' => true,
                'message' => 'Workflows listados com sucesso',
                'data' => [
                    'workflows' => $workflows->items(),
                    'pagination' => [
                        'current_page' => $workflows->currentPage(),
                        'per_page' => $workflows->perPage(),
                        'total' => $workflows->total(),
                        'last_page' => $workflows->lastPage(),
                        'has_more' => $workflows->hasMorePages()
                    ]
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ListWorkflowsUseCase', [
                'error' => $exception->getMessage(),
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem de workflows'],
                'message' => 'Falha ao listar workflows'
            ];
        }
    }
}
