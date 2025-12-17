<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Application\Queries\GetTeamMemberQuery;
use App\Domains\Projects\Application\Handlers\GetTeamMemberHandler;
use App\Domains\Projects\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class GetTeamMemberUseCase
{
    public function __construct(
        private GetTeamMemberHandler $getHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(GetTeamMemberQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para busca do membro da equipe'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateTeamMemberAccess($query);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado ao membro da equipe'
                ];
            }

            // Executar busca
            $teamMember = $this->getHandler->handle($query);

            Log::info('Team Member retrieved successfully via Use Case', [
                'project_id' => $query->projectId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'message' => 'Membro da equipe obtido com sucesso',
                'data' => $teamMember
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in GetTeamMemberUseCase', [
                'error' => $exception->getMessage(),
                'project_id' => $query->projectId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção do membro da equipe'],
                'message' => 'Falha ao obter membro da equipe'
            ];
        }
    }
}
