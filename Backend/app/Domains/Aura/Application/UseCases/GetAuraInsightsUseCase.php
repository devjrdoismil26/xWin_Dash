<?php

namespace App\Domains\Aura\Application\UseCases;

use App\Domains\Aura\Application\Queries\GetAuraInsightsQuery;
use App\Domains\Aura\Application\Handlers\GetAuraInsightsHandler;
use App\Domains\Aura\Application\Services\AuraApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;

class GetAuraInsightsUseCase
{
    public function __construct(
        private GetAuraInsightsHandler $getAuraInsightsHandler,
        private AuraApplicationService $applicationService,
        private CrossModuleValidationService $validationService
    ) {
    }

    public function execute(GetAuraInsightsQuery $query): array
    {
        try {
            // Validar permissões cross-module
            $this->validationService->validateUserAccess(null, 'aura', 'view_insights');

            // Executar query via handler
            $result = $this->getAuraInsightsHandler->handle($query);

            Log::info('Aura insights retrieved successfully', [
                'chat_id' => $query->chatId,
                'insight_type' => $query->insightType
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Insights Aura recuperados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving Aura insights', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao recuperar insights Aura: ' . $e->getMessage()
            ];
        }
    }
}
