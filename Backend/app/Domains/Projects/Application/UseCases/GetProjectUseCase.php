<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Application\Queries\GetProjectQuery;
use App\Domains\Projects\Application\Handlers\GetProjectHandler;
use App\Domains\Projects\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class GetProjectUseCase
{
    public function __construct(
        private GetProjectHandler $getHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(GetProjectQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para busca do projeto'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateProjectAccess($query);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado ao projeto'
                ];
            }

            // Executar busca
            $project = $this->getHandler->handle($query);

            Log::info('Project retrieved successfully via Use Case', [
                'project_id' => $query->projectId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'message' => 'Projeto obtido com sucesso',
                'data' => $project
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in GetProjectUseCase', [
                'error' => $exception->getMessage(),
                'project_id' => $query->projectId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção do projeto'],
                'message' => 'Falha ao obter projeto'
            ];
        }
    }
}
