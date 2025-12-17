<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Queries\ListUniverseTemplatesQuery;
use App\Domains\Universe\Application\Handlers\ListUniverseTemplatesHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class ListUniverseTemplatesUseCase
{
    public function __construct(
        private ListUniverseTemplatesHandler $listHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(ListUniverseTemplatesQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para listagem de templates'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateUserUniverseTemplateAccess($query->userId);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado aos templates'
                ];
            }

            // Executar listagem
            $templates = $this->listHandler->handle($query);

            Log::info('Universe Templates listed successfully via Use Case', [
                'user_id' => $query->userId,
                'total_results' => $templates->total()
            ]);

            return [
                'success' => true,
                'message' => 'Templates listados com sucesso',
                'data' => [
                    'templates' => $templates->items(),
                    'pagination' => [
                        'current_page' => $templates->currentPage(),
                        'per_page' => $templates->perPage(),
                        'total' => $templates->total(),
                        'last_page' => $templates->lastPage(),
                        'has_more' => $templates->hasMorePages()
                    ]
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ListUniverseTemplatesUseCase', [
                'error' => $exception->getMessage(),
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem de templates'],
                'message' => 'Falha ao listar templates'
            ];
        }
    }
}
