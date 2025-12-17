<?php

namespace App\Domains\EmailMarketing\Application\UseCases;

use App\Domains\EmailMarketing\Application\Commands\DeleteEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Handlers\DeleteEmailCampaignHandler;
use App\Domains\EmailMarketing\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\EmailMarketing\Domain\Events\EmailCampaignDeletedEvent;
use Illuminate\Support\Facades\Log;

class DeleteEmailCampaignUseCase
{
    public function __construct(
        private DeleteEmailCampaignHandler $deleteHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(DeleteEmailCampaignCommand $command): array
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
            $crossModuleValidation = $this->crossModuleValidator->validateEmailCampaignDeletion($command);
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
                new EmailCampaignDeletedEvent(
                    $command->campaignId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('Email Campaign deleted successfully via Use Case', [
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
            Log::error('Error in DeleteEmailCampaignUseCase', [
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
