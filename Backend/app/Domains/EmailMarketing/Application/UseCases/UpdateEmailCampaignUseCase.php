<?php

namespace App\Domains\EmailMarketing\Application\UseCases;

use App\Domains\EmailMarketing\Application\Commands\UpdateEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Handlers\UpdateEmailCampaignHandler;
use App\Domains\EmailMarketing\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\EmailMarketing\Domain\Events\EmailCampaignUpdatedEvent;
use Illuminate\Support\Facades\Log;

class UpdateEmailCampaignUseCase
{
    public function __construct(
        private UpdateEmailCampaignHandler $updateHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(UpdateEmailCampaignCommand $command): array
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
            $crossModuleValidation = $this->crossModuleValidator->validateEmailCampaignUpdate($command);
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
                new EmailCampaignUpdatedEvent(
                    $command->campaignId,
                    $command->userId,
                    $command->toArray()
                )
            );

            Log::info('Email Campaign updated successfully via Use Case', [
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
            Log::error('Error in UpdateEmailCampaignUseCase', [
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
