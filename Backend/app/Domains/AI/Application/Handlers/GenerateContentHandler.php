<?php

namespace App\Domains\AI\Application\Handlers;

use App\Domains\AI\Application\Commands\GenerateContentCommand;
use App\Domains\AI\Domain\Services\AIContentGenerationService;
use App\Domains\AI\Domain\Services\AIModelService;
use Illuminate\Support\Facades\Log;

class GenerateContentHandler
{
    public function __construct(
        private AIContentGenerationService $contentGenerationService,
        private AIModelService $modelService
    ) {
    }

    public function handle(GenerateContentCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Selecionar modelo apropriado
            $model = $command->model ?? $this->modelService->getBestModelForType($command->type);

            // Gerar conteúdo
            $result = $this->contentGenerationService->generateContent([
                'prompt' => $command->prompt,
                'type' => $command->type,
                'model' => $model,
                'parameters' => $command->parameters,
                'max_tokens' => $command->maxTokens,
                'context' => $command->context
            ]);

            Log::info('Content generated successfully', [
                'type' => $command->type,
                'model' => $model
            ]);

            return [
                'content' => $result,
                'model' => $model,
                'message' => 'Conteúdo gerado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error generating content', [
                'type' => $command->type,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(GenerateContentCommand $command): void
    {
        if (empty($command->prompt)) {
            throw new \InvalidArgumentException('Prompt é obrigatório');
        }

        if (empty($command->type)) {
            throw new \InvalidArgumentException('Tipo é obrigatório');
        }

        $validTypes = ['text', 'image', 'code', 'email'];
        if (!in_array($command->type, $validTypes)) {
            throw new \InvalidArgumentException('Tipo inválido');
        }
    }
}
