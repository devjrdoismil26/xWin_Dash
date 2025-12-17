<?php

namespace App\Domains\EmailMarketing\Application\UseCases;

use App\Domains\EmailMarketing\Application\Queries\GetEmailCampaignQuery;
use App\Domains\EmailMarketing\Application\Handlers\GetEmailCampaignHandler;
use App\Domains\EmailMarketing\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class GetEmailCampaignUseCase
{
    public function __construct(
        private GetEmailCampaignHandler $getHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(GetEmailCampaignQuery $query): array
    {
        try {
            // Validar query
            if (!$query->isValid()) {
                return [
                    'success' => false,
                    'errors' => $query->getValidationErrors(),
                    'message' => 'Dados inválidos para busca da campanha'
                ];
            }

            // Validar permissões cross-module
            $permissionValidation = $this->crossModuleValidator->validateEmailCampaignAccess($query);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado à campanha'
                ];
            }

            // Executar busca
            $campaign = $this->getHandler->handle($query);

            Log::info('Email Campaign retrieved successfully via Use Case', [
                'campaign_id' => $query->campaignId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'message' => 'Campanha obtida com sucesso',
                'data' => $campaign
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in GetEmailCampaignUseCase', [
                'error' => $exception->getMessage(),
                'campaign_id' => $query->campaignId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante obtenção da campanha'],
                'message' => 'Falha ao obter campanha'
            ];
        }
    }
}
