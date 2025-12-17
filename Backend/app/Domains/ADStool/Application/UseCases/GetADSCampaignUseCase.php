<?php

namespace App\Domains\ADStool\Application\UseCases;

use App\Domains\ADStool\Application\Queries\GetADSCampaignQuery;
use App\Domains\ADStool\Application\Handlers\GetADSCampaignHandler;
use App\Domains\ADStool\Domain\Services\CrossModuleValidationServiceInterface;
use Illuminate\Support\Facades\Log;

class GetADSCampaignUseCase
{
    public function __construct(
        private GetADSCampaignHandler $getHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator
    ) {
    }

    public function execute(GetADSCampaignQuery $query): array
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
            $permissionValidation = $this->crossModuleValidator->validateCampaignAccess($query);
            if (!$permissionValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $permissionValidation['errors'],
                    'message' => 'Acesso negado à campanha'
                ];
            }

            // Executar busca
            $campaign = $this->getHandler->handle($query);

            Log::info('ADS Campaign retrieved successfully via Use Case', [
                'campaign_id' => $query->campaignId,
                'user_id' => $query->userId
            ]);

            return [
                'success' => true,
                'message' => 'Campanha obtida com sucesso',
                'data' => $campaign
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in GetADSCampaignUseCase', [
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
