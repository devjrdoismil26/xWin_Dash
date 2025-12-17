<?php

namespace App\Domains\Universe\Application\UseCases;

use App\Domains\Universe\Application\Commands\DeleteUniverseTemplateCommand;
use App\Domains\Universe\Application\Handlers\DeleteUniverseTemplateHandler;
use App\Domains\Universe\Domain\Services\CrossModuleValidationServiceInterface;
use App\Domains\Shared\Domain\Services\EventDispatcherInterface;
use App\Domains\Universe\Domain\Events\UniverseTemplateDeletedEvent;
use Illuminate\Support\Facades\Log;

class DeleteUniverseTemplateUseCase
{
    public function __construct(
        private DeleteUniverseTemplateHandler $deleteHandler,
        private CrossModuleValidationServiceInterface $crossModuleValidator,
        private EventDispatcherInterface $eventDispatcher
    ) {
    }

    public function execute(DeleteUniverseTemplateCommand $command): array
    {
        try {
            // Validar comando
            if (!$command->isValid()) {
                return [
                    'success' => false,
                    'errors' => $command->getValidationErrors(),
                    'message' => 'Dados inválidos para remoção do template'
                ];
            }

            // Validar regras de negócio cross-module
            $crossModuleValidation = $this->crossModuleValidator->validateUniverseTemplateDeletion($command);
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
                new UniverseTemplateDeletedEvent(
                    $command->templateId,
                    $command->userId,
                    $command->reason,
                    $command->forceDelete
                )
            );

            Log::info('Universe Template deleted successfully via Use Case', [
                'template_id' => $command->templateId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete
            ]);

            return [
                'success' => true,
                'message' => 'Template removido com sucesso',
                'data' => [
                    'template_id' => $command->templateId,
                    'deleted_at' => now()->toISOString()
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in DeleteUniverseTemplateUseCase', [
                'error' => $exception->getMessage(),
                'template_id' => $command->templateId,
                'user_id' => $command->userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante remoção do template'],
                'message' => 'Falha ao remover template'
            ];
        }
    }
}
