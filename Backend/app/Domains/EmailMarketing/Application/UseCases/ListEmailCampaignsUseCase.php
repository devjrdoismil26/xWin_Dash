<?php

namespace App\Domains\EmailMarketing\Application\UseCases;

use App\Domains\EmailMarketing\Application\Queries\ListEmailCampaignsQuery;
use App\Domains\EmailMarketing\Application\Handlers\ListEmailCampaignsHandler;
use App\Domains\EmailMarketing\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class ListEmailCampaignsUseCase
{
    public function __construct(
        private ListEmailCampaignsHandler $listHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(ListEmailCampaignsQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para listagem de campanhas'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateUserEmailCampaignAccess($query->userId);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado às campanhas'
                ];
            }

            // Executar listagem
            $campaigns = $this->listHandler->handle($query);

            Log::info('Email Campaigns listed successfully via Use Case', [
                'user_id' => $query->userId,
                'total_results' => $campaigns->total()
            ]);

            return [
                'success' => true,
                'message' => 'Campanhas listadas com sucesso',
                'data' => [
                    'campaigns' => $campaigns->items(),
                    'pagination' => [
                        'current_page' => $campaigns->currentPage(),
                        'per_page' => $campaigns->perPage(),
                        'total' => $campaigns->total(),
                        'last_page' => $campaigns->lastPage(),
                        'has_more' => $campaigns->hasMorePages()
                    ]
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in ListEmailCampaignsUseCase', [
                'error' => $exception->getMessage(),
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem de campanhas'],
                'message' => 'Falha ao listar campanhas'
            ];
        }
    }
}
