<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Queries\GetUniverseInstanceQuery;
use App\Domains\Universe\Application\Handlers\GetUniverseInstanceHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class GetUniverseInstanceUseCase
{
    public function __construct(
        private GetUniverseInstanceHandler $getHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(GetUniverseInstanceQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para busca da instância'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateUniverseInstanceAccess($query);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado à instância'
                ];
            }

            // Executar busca
            $instance = $this->getHandler->handle($query);

            Log::info('Universe Instance retrieved successfully via Use Case', [
                'instance_id' => $query->instanceId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'message' => 'Instância obtida com sucesso',
                'data' => $instance
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in GetUniverseInstanceUseCase', [
                'error' => $exception->getMessage(),
                'instance_id' => $query->instanceId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção da instância'],
                'message' => 'Falha ao obter instância'
            ];
        }
    }
}
