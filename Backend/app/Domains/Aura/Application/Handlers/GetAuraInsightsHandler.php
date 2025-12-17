<?php

namespace App\Domains\Aura\Application\Handlers;

use App\Domains\Aura\Application\Queries\GetAuraInsightsQuery;
use App\Domains\Aura\Domain\Services\AuraInsightsService;
use Illuminate\Support\Facades\Log;

class GetAuraInsightsHandler
{
    public function __construct(
        private AuraInsightsService $auraInsightsService
    ) {
    }

    public function handle(GetAuraInsightsQuery $query): array
    {
        try {
            // Validar dados da query
            $this->validateQuery($query);

            // Coletar insights
            $insights = $this->auraInsightsService->getInsights([
                'chat_id' => $query->chatId,
                'insight_type' => $query->insightType,
                'date_from' => $query->dateFrom,
                'date_to' => $query->dateTo,
                'filters' => $query->filters
            ]);

            Log::info('Aura insights retrieved successfully', [
                'chat_id' => $query->chatId,
                'insight_type' => $query->insightType
            ]);

            return [
                'insights' => $insights,
                'message' => 'Insights recuperados com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error retrieving Aura insights', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateQuery(GetAuraInsightsQuery $query): void
    {
        // Query de insights não precisa de validações específicas
    }
}
