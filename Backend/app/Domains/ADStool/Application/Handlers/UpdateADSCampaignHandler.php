<?php

namespace App\Domains\ADStool\Application\Handlers;

use App\Domains\ADStool\Application\Commands\UpdateADSCampaignCommand;
use App\Domains\ADStool\Domain\Repositories\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\Domain\Services\ADSCampaignServiceInterface;
use App\Domains\ADStool\Domain\Services\ExternalAdProviderServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\ADStool\Domain\Events\ADSCampaignUpdatedEvent;
use App\Domains\ADStool\Domain\ValueObjects\ADSCampaignId;
use App\Domains\ADStool\Domain\ValueObjects\Budget;
use App\Domains\ADStool\Domain\ValueObjects\CampaignStatus;
use App\Domains\ADStool\Domain\ValueObjects\Targeting;
use App\Domains\ADStool\Domain\ValueObjects\Schedule;
use App\Domains\ADStool\Domain\Exceptions\ADSCampaignNotFoundException;
use App\Domains\ADStool\Domain\Exceptions\InvalidCampaignUpdateException;
use Illuminate\Support\Facades\Log;

class UpdateADSCampaignHandler
{
    public function __construct(
        private ADSCampaignRepositoryInterface $campaignRepository,
        private ADSCampaignServiceInterface $campaignService,
        private ExternalAdProviderServiceInterface $externalAdProvider,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function handle(UpdateADSCampaignCommand $command): void
    {
        try {
            // Buscar a campanha existente
            $campaignId = new ADSCampaignId($command->campaignId);
            $existingCampaign = $this->campaignRepository->findById($campaignId);

            if (!$existingCampaign) {
                throw new ADSCampaignNotFoundException("Campaign with ID {$command->campaignId} not found");
            }

            // Validar se a campanha pode ser atualizada
            if (!$this->campaignService->canUpdateCampaign($existingCampaign)) {
                throw new InvalidCampaignUpdateException("Campaign cannot be updated in current status");
            }

            // Preparar dados para atualização
            $updateData = $this->prepareUpdateData($command, $existingCampaign);

            // Atualizar no provedor externo se necessário
            if ($this->shouldUpdateExternalProvider($command)) {
                $this->externalAdProvider->updateCampaign(
                    $existingCampaign->getExternalId(),
                    $updateData
                );
            }

            // Atualizar no repositório local
            $updatedCampaign = $this->campaignRepository->update($campaignId, $updateData);

            // Disparar evento de atualização
            $this->eventDispatcher->dispatch(
                new ADSCampaignUpdatedEvent(
                    $updatedCampaign->getId(),
                    $command->userId,
                    $updateData
                )
            );

            Log::info('ADS Campaign updated successfully', [
                'campaign_id' => $command->campaignId,
                'user_id' => $command->userId,
                'updated_fields' => array_keys($updateData)
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update ADS campaign', [
                'campaign_id' => $command->campaignId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function prepareUpdateData(UpdateADSCampaignCommand $command, $existingCampaign): array
    {
        $updateData = [];

        if ($command->name !== null) {
            $updateData['name'] = $command->name;
        }

        if ($command->description !== null) {
            $updateData['description'] = $command->description;
        }

        if ($command->budget !== null) {
            $updateData['budget'] = new Budget($command->budget);
        }

        if ($command->status !== null) {
            $updateData['status'] = new CampaignStatus($command->status);
        }

        if ($command->targeting !== null) {
            $updateData['targeting'] = new Targeting($command->targeting);
        }

        if ($command->schedule !== null) {
            $updateData['schedule'] = new Schedule($command->schedule);
        }

        if ($command->creativeIds !== null) {
            $updateData['creative_ids'] = $command->creativeIds;
        }

        if ($command->accountId !== null) {
            $updateData['account_id'] = $command->accountId;
        }

        $updateData['updated_at'] = now();

        return $updateData;
    }

    private function shouldUpdateExternalProvider(UpdateADSCampaignCommand $command): bool
    {
        // Atualizar no provedor externo se a campanha estiver ativa
        // e se campos críticos foram alterados
        $criticalFields = ['budget', 'status', 'targeting', 'schedule'];

        foreach ($criticalFields as $field) {
            if ($command->$field !== null) {
                return true;
            }
        }

        return false;
    }
}
