<?php

namespace App\Domains\ADStool\Application\UseCases;

use App\Domains\ADStool\Application\Commands\DeleteADSCampaignCommand;
use App\Domains\ADStool\Application\Handlers\DeleteADSCampaignHandler;
use App\Domains\ADStool\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\ADStool\Domain\Events\ADSCampaignDeletedEvent;
use Illuminate\Support\Facades\Log;

class DeleteADSCampaignUseCase
{
    public function __construct(
        private DeleteADSCampaignHandler $deleteHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(DeleteADSCampaignCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para remoção da campanha'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateCampaignDeletion($command);
            if (!$crossModuleValidation['valid']) {
                return [
                    'success' => false,
                    'errors' => $crossModuleValidation['errors'],
                    'message' => 'Regras de negócio não atendidas'
                ];
            }

            // Executar remoção
            $this->deleteHandler->handle($command);

            // Disparar evento de remoção
            $this->eventDispatcher->dispatch(
                new ADSCampaignDeletedEvent(
                    $command->campaignId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('ADS Campaign deleted successfully via Use Case', [
                'campaign_id' => $command->campaignId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'message' => 'Campanha removida com sucesso',
                'data' => [
                    'campaign_id' => $command->campaignId,
                    'deleted_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in DeleteADSCampaignUseCase', [
                'error' => $exception->getMessage(),
                'campaign_id' => $command->campaignId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção da campanha'],
                'message' => 'Falha ao remover campanha'
            ];
        }
    }
}
