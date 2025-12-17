<?php

namespace App\Domains\Projects\Application\UseCases;

use App\Domains\Projects\Application\Queries\ListTeamMembersQuery;
use App\Domains\Projects\Application\Handlers\ListTeamMembersHandler;
use App\Domains\Projects\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class ListTeamMembersUseCase
{
    public function __construct(
        private ListTeamMembersHandler $listHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(ListTeamMembersQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para listagem de membros da equipe'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateUserTeamMemberAccess($query->userId);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado aos membros da equipe'
                ];
            }

            // Executar listagem
            $teamMembers = $this->listHandler->handle($query);

            Log::info('Team Members listed successfully via Use Case', [
                'project_id' => $query->projectId,
                'user_id' => $query->userId,
                'total_results' => $teamMembers->total()
            ]);

            return [
                'success' => true,
                'message' => 'Membros da equipe listados com sucesso',
                'data' => [
                    'team_members' => $teamMembers->items(),
                    'pagination' => [
                        'current_page' => $teamMembers->currentPage(),
                        'per_page' => $teamMembers->perPage(),
                        'total' => $teamMembers->total(),
                        'last_page' => $teamMembers->lastPage(),
                        'has_more' => $teamMembers->hasMorePages()
                    ]
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ListTeamMembersUseCase', [
                'error' => $exception->getMessage(),
                'project_id' => $query->projectId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem de membros da equipe'],
                'message' => 'Falha ao listar membros da equipe'
            ];
        }
    }
}
