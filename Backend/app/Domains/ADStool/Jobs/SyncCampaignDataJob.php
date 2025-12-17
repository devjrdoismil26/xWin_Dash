<?php

namespace App\Domains\ADStool\Jobs;

use App\Domains\ADStool\Events\CampaignPerformanceUpdated;
use App\Domains\ADStool\Models\ADSCampaign;
use App\Domains\ADStool\Services\AdPlatformIntegrationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job para sincronizar os dados de desempenho (métricas) de uma campanha específica.
 *
 * Este job é enfileirado para buscar os dados mais recentes de uma campanha
 * em uma plataforma externa e atualizar o registro local.
 */
class SyncCampaignDataJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @var int o ID da campanha no nosso sistema
     */
    protected int $campaignId;

    /**
     * Create a new job instance.
     *
     * @param int $campaignId
     */
    public function __construct(int $campaignId)
    {
        $this->campaignId = $campaignId;
    }

    /**
     * Execute the job.
     *
     * @param AdPlatformIntegrationService $integrationService
     */
    public function handle(AdPlatformIntegrationService $integrationService): void
    {
        Log::info("Iniciando sincronização de dados para a campanha ID: {$this->campaignId}");

        try {
            $campaign = ADSCampaign::find($this->campaignId);
            if (!$campaign) {
                throw new \Exception("Campaign with ID {$this->campaignId} not found");
            }

            // A lógica de integração buscaria as métricas da plataforma
            // para esta campanha específica.
            // $performanceUpdate = $integrationService->syncCampaignPerformance($campaign);

            // Implementação temporária
            $performanceUpdate = null;

            // Dispara um evento para notificar o resto do sistema sobre a atualização
            // if ($performanceUpdate) {
            //     CampaignPerformanceUpdated::dispatch($performanceUpdate);
            // }

            Log::info("Sincronização de dados concluída para a campanha ID: {$this->campaignId}");
        } catch (\Exception $e) {
            Log::error("Falha na sincronização de dados para a campanha ID: {$this->campaignId}", [
                'error' => $e->getMessage(),
            ]);

            $this->fail($e);
        }
    }
}
