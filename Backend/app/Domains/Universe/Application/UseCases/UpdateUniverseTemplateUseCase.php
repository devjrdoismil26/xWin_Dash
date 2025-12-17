<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Commands\UpdateUniverseTemplateCommand;
use App\Domains\Universe\Application\Handlers\UpdateUniverseTemplateHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Universe\Domain\Events\UniverseTemplateUpdatedEvent;
use Illuminate\Support\Facades\Log;

class UpdateUniverseTemplateUseCase
{
    public function __construct(
        private UpdateUniverseTemplateHandler $updateHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(UpdateUniverseTemplateCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para atualização do template'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateUniverseTemplateUpdate($command);
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
                new UniverseTemplateUpdatedEvent(
                    $command->templateId,
                    $command->userId,
                    $command->toArray()
                )
            );

            Log::info('Universe Template updated successfully via Use Case', [
                'template_id' => $command->templateId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'message' => 'Template atualizado com sucesso',
                'data' => [
                    'template_id' => $command->templateId,
                    'updated_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in UpdateUniverseTemplateUseCase', [
                'error' => $exception->getMessage(),
                'template_id' => $command->templateId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização do template'],
                'message' => 'Falha ao atualizar template'
            ];
        }
    }
}
