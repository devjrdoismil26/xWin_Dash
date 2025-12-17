<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Application\Queries\GetTaskQuery;
use App\Domains\Projects\Application\Handlers\GetTaskHandler;
use App\Domains\Projects\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class GetTaskUseCase
{
    public function __construct(
        private GetTaskHandler $getHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(GetTaskQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para busca da tarefa'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateTaskAccess($query);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado à tarefa'
                ];
            }

            // Executar busca
            $task = $this->getHandler->handle($query);

            Log::info('Task retrieved successfully via Use Case', [
                'task_id' => $query->taskId,
                'project_id' => $query->projectId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'message' => 'Tarefa obtida com sucesso',
                'data' => $task
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in GetTaskUseCase', [
                'error' => $exception->getMessage(),
                'task_id' => $query->taskId,
                'project_id' => $query->projectId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção da tarefa'],
                'message' => 'Falha ao obter tarefa'
            ];
        }
    }
}
