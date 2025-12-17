<?php

namespace App\Domains\ADStool\Listeners;

use App\Domains\ADStool\DTOs\CampaignAlertInfoDTO;
use App\Domains\ADStool\Events\CampaignBudgetAlert;
use App\Domains\ADStool\Events\CampaignPerformanceUpdated;
use App\Domains\ADStool\Models\ADSCampaign;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * Listener que verifica se um alerta de orçamento deve ser disparado após a atualização do desempenho de uma campanha.
 */
class CheckBudgetAlertListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param CampaignPerformanceUpdated $event
     */
    public function handle(CampaignPerformanceUpdated $event): void
    {
        Log::info('CheckBudgetAlertListener acionado para a campanha ID: ' . $event->performanceData->campaignId);

        $campaign = ADSCampaign::find($event->performanceData->campaignId);
        if (!$campaign) {
            return;
        }

        // Lógica de verificação de orçamento (exemplo simples)
        $totalSpend = $event->performanceData->metrics->spend;
        $budget = $campaign->daily_budget ?? $campaign->lifetime_budget;
        $threshold = 0.9; // 90%

        if ($budget && ($totalSpend >= ($budget * $threshold))) {
            Log::info('Disparando CampaignBudgetAlert para a campanha ID: ' . $campaign->id);

            $thresholdPercent = (int)($threshold * 100);
            $alertInfo = new CampaignAlertInfoDTO(
                $campaign->id,
                $campaign->name,
                'BUDGET_THRESHOLD_REACHED',
                "A campanha '{$campaign->name}' atingiu {$thresholdPercent}% do seu orçamento de {$budget}.",
                ['total_spend' => $totalSpend, 'budget' => $budget],
            );

            CampaignBudgetAlert::dispatch($alertInfo);
        }
    }
}
