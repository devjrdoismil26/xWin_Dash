<?php

namespace App\Application\ADStool\Listeners;

use App\Domains\ADStool\Events\CampaignCreated; // Supondo que este evento exista
use App\Domains\ADStool\Events\CampaignUpdated; // Supondo que este evento exista
use App\Domains\ADStool\Services\AdPlatformIntegrationService; // Nosso serviço de integração
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SyncCampaignToExternalPlatformListener implements ShouldQueue
{
    use InteractsWithQueue;

    protected AdPlatformIntegrationService $integrationService;

    public function __construct(AdPlatformIntegrationService $integrationService)
    {
        $this->integrationService = $integrationService;
    }

    /**
     * Handle the CampaignCreated event.
     *
     * @param CampaignCreated $event
     */
    public function handleCampaignCreated(CampaignCreated $event): void
    {
        Log::info("SyncCampaignToExternalPlatformListener: Sincronizando nova campanha (ID: {$event->campaignData->campaignId}) com a plataforma externa.");
        try {
            // Assumindo que o CampaignCreatedEventDTO contém o ID da campanha
            $campaign = \App\Domains\ADStool\Models\ADSCampaign::find($event->campaignData->campaignId);
            if ($campaign) {
                $this->integrationService->createCampaign($campaign);
                Log::info("Campanha (ID: {$campaign->id}) sincronizada com sucesso na plataforma externa.");
            }
        } catch (\Exception $e) {
            Log::error("Falha ao sincronizar nova campanha (ID: {$event->campaignData->campaignId}) com a plataforma externa: " . $e->getMessage());
            // Lógica para lidar com a falha, como marcar a campanha como 'sync_failed'
        }
    }

    /**
     * Handle the CampaignUpdated event.
     *
     * @param CampaignUpdated $event
     */
    public function handleCampaignUpdated(CampaignUpdated $event): void
    {
        Log::info("SyncCampaignToExternalPlatformListener: Sincronizando campanha atualizada (ID: {$event->campaign->id}) com a plataforma externa.");
        try {
            $this->integrationService->updateCampaign($event->campaign, $event->updatedData); // Assumindo updatedData no evento
            Log::info("Campanha (ID: {$event->campaign->id}) atualizada com sucesso na plataforma externa.");
        } catch (\Exception $e) {
            Log::error("Falha ao sincronizar campanha atualizada (ID: {$event->campaign->id}) com a plataforma externa: " . $e->getMessage());
        }
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param \Illuminate\Events\Dispatcher $events
     *
     * @return array<string, string>
     */
    public function subscribe($events): array
    {
        $events->listen(
            CampaignCreated::class,
            [SyncCampaignToExternalPlatformListener::class, 'handleCampaignCreated'],
        );

        $events->listen(
            CampaignUpdated::class,
            [SyncCampaignToExternalPlatformListener::class, 'handleCampaignUpdated'],
        );

        return [];
    }
}
