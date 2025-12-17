<?php

namespace App\Domains\AI\Application\UseCases;

use App\Domains\AI\Application\Commands\GenerateContentCommand;
use App\Domains\AI\Application\Handlers\GenerateContentHandler;
use App\Domains\AI\Application\Services\AIApplicationService;
use App\Domains\Shared\Application\Services\CrossModuleValidationService;
use App\Domains\Shared\Application\Services\CrossModuleEventDispatcher;
use Illuminate\Support\Facades\Log;

class GenerateContentUseCase
{
    public function __construct(
        private GenerateContentHandler $generateContentHandler,
        private AIApplicationService $applicationService,
        private CrossModuleValidationService $validationService,
        private CrossModuleEventDispatcher $eventDispatcher
    ) {
    }

    public function execute(GenerateContentCommand $command): array
    {
        try {
            // Validar regras de negócio cross-module
            $this->validationService->validateAIContentGeneration($command->toArray());

            // Executar comando via handler
            $result = $this->generateContentHandler->handle($command);

            // Disparar eventos de domínio
            $this->eventDispatcher->dispatch('ai.content_generated', [
                'type' => $command->type,
                'model' => $result['model']
            ]);

            Log::info('AI content generated successfully', [
                'type' => $command->type,
                'model' => $result['model']
            ]);

            return [
                'success' => true,
                'data' => $result,
                'message' => 'Conteúdo gerado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error generating AI content', [
                'type' => $command->type,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao gerar conteúdo: ' . $e->getMessage()
            ];
        }
    }
}
