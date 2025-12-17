<?php

namespace App\Domains\Workflows\Application\UseCases;

use App\Domains\Workflows\Application\Queries\GetWorkflowQuery;
use App\Domains\Workflows\Application\Handlers\GetWorkflowHandler;
use App\Domains\Workflows\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class GetWorkflowUseCase
{
    public function __construct(
        private GetWorkflowHandler $getHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(GetWorkflowQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para busca do workflow'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateWorkflowAccess($query);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado ao workflow'
                ];
            }

            // Executar busca
            $workflow = $this->getHandler->handle($query);

            Log::info('Workflow retrieved successfully via Use Case', [
                'workflow_id' => $query->workflowId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'message' => 'Workflow obtido com sucesso',
                'data' => $workflow
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in GetWorkflowUseCase', [
                'error' => $exception->getMessage(),
                'workflow_id' => $query->workflowId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção do workflow'],
                'message' => 'Falha ao obter workflow'
            ];
        }
    }
}
