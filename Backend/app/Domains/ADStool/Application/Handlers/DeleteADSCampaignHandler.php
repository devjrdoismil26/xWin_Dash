<?php

namespace App\Domains\ADStool\Application\Handlers;

use App\Domains\ADStool\Application\Commands\DeleteADSCampaignCommand;
use App\Domains\ADStool\Domain\Repositories\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\Domain\Services\ADSCampaignServiceInterface;
use App\Domains\ADStool\Domain\Services\ExternalAdProviderServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\ADStool\Domain\Events\ADSCampaignDeletedEvent;
use App\Domains\ADStool\Domain\ValueObjects\ADSCampaignId;
use App\Domains\ADStool\Domain\Exceptions\ADSCampaignNotFoundException;
use App\Domains\ADStool\Domain\Exceptions\InvalidCampaignDeletionException;
use Illuminate\Support\Facades\Log;

class DeleteADSCampaignHandler
{
    public function __construct(
        private ADSCampaignRepositoryInterface $campaignRepository,
        private ADSCampaignServiceInterface $campaignService,
        private ExternalAdProviderServiceInterface $externalAdProvider,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function handle(DeleteADSCampaignCommand $command): void
    {
        try {
            // Buscar a campanha existente
            $campaignId = new ADSCampaignId($command->campaignId);
            $existingCampaign = $this->campaignRepository->findById($campaignId);

            if (!$existingCampaign) {
                throw new ADSCampaignNotFoundException("Campaign with ID {$command->campaignId} not found");
            }

            // Validar se a campanha pode ser deletada
            if (!$this->campaignService->canDeleteCampaign($existingCampaign, $command->forceDelete)) {
                throw new InvalidCampaignDeletionException("Campaign cannot be deleted in current status");
            }

            // Parar a campanha no provedor externo se estiver ativa
            if ($existingCampaign->isActive() && $existingCampaign->getExternalId()) {
                try {
                    $this->externalAdProvider->stopCampaign($existingCampaign->getExternalId());
                } catch (\Exception $e) {
                    Log::warning('Failed to stop campaign in external provider', [
                        'campaign_id' => $command->campaignId,
                        'external_id' => $existingCampaign->getExternalId(),
                        'error' => $e->getMessage()
                    ]);

                    if (!$command->forceDelete) {
                        throw $e;
                    }
                }
            }

            // Deletar do provedor externo se necessário
            if ($existingCampaign->getExternalId() && $command->forceDelete) {
                try {
                    $this->externalAdProvider->deleteCampaign($existingCampaign->getExternalId());
                } catch (\Exception $e) {
                    Log::warning('Failed to delete campaign from external provider', [
                        'campaign_id' => $command->campaignId,
                        'external_id' => $existingCampaign->getExternalId(),
                        'error' => $e->getMessage()
                    ]);
                }
            }

            // Deletar do repositório local
            $this->campaignRepository->delete($campaignId);

            // Disparar evento de deleção
            $this->eventDispatcher->dispatch(
                new ADSCampaignDeletedEvent(
                    $campaignId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('ADS Campaign deleted successfully', [
                'campaign_id' => $command->campaignId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete,
                'reason' => $command->reason
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete ADS campaign', [
                'campaign_id' => $command->campaignId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
