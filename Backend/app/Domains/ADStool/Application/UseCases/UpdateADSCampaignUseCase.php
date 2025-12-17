<?php

namespace App\Domains\ADStool\Application\UseCases;

use App\Domains\ADStool\Application\Commands\UpdateADSCampaignCommand;
use App\Domains\ADStool\Application\Handlers\UpdateADSCampaignHandler;
use App\Domains\ADStool\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\ADStool\Domain\Events\ADSCampaignUpdatedEvent;
use Illuminate\Support\Facades\Log;

class UpdateADSCampaignUseCase
{
    public function __construct(
        private UpdateADSCampaignHandler $updateHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(UpdateADSCampaignCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para atualização da campanha'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateCampaignUpdate($command);
            if (!$crossModuleValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $crossModuleValidation['errors'],
                    'message' => 'Regras de negócio não atendidas'
                ];
            }

            // Executar atualização
            $this->updateHandler->handle($command);

            // Disparar evento de atualização
            $this->eventDispatcher->dispatch(
                new ADSCampaignUpdatedEvent(
                    $command->campaignId,
                    $command->userId,
                    $command->toArray()
                )
            );

            Log::info('ADS Campaign updated successfully via Use Case', [
                'campaign_id' => $command->campaignId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'message' => 'Campanha atualizada com sucesso',
                'data' => [
                    'campaign_id' => $command->campaignId,
                    'updated_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in UpdateADSCampaignUseCase', [
                'error' => $exception->getMessage(),
                'campaign_id' => $command->campaignId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização da campanha'],
                'message' => 'Falha ao atualizar campanha'
            ];
        }
    }
}
