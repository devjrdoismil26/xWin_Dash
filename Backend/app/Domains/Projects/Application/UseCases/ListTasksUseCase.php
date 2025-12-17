<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Application\Queries\ListTasksQuery;
use App\Domains\Projects\Application\Handlers\ListTasksHandler;
use App\Domains\Projects\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class ListTasksUseCase
{
    public function __construct(
        private ListTasksHandler $listHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(ListTasksQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para listagem de tarefas'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateUserTaskAccess($query->userId);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado às tarefas'
                ];
            }

            // Executar listagem
            $tasks = $this->listHandler->handle($query);

            Log::info('Tasks listed successfully via Use Case', [
                'project_id' => $query->projectId,
                'user_id' => $query->userId,
                'total_results' => $tasks->total()
            ]);

            return [
                'success' => true,
                'message' => 'Tarefas listadas com sucesso',
                'data' => [
                    'tasks' => $tasks->items(),
                    'pagination' => [
                        'current_page' => $tasks->currentPage(),
                        'per_page' => $tasks->perPage(),
                        'total' => $tasks->total(),
                        'last_page' => $tasks->lastPage(),
                        'has_more' => $tasks->hasMorePages()
                    ]
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ListTasksUseCase', [
                'error' => $exception->getMessage(),
                'project_id' => $query->projectId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem de tarefas'],
                'message' => 'Falha ao listar tarefas'
            ];
        }
    }
}
