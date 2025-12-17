<?php

namespace App\Application\AI\UseCases;

use App\Application\AI\Commands\RetryAIGenerationCommand;
use App\Domains\AI\Services\AIService;
use App\Domains\AI\Domain\AIGeneration;
use App\Shared\Exceptions\BusinessRuleException;

class RetryAIGenerationUseCase
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Executa o caso de uso para tentar novamente uma geração de IA que falhou.
     *
     * @param RetryAIGenerationCommand $command
     * @return AIGeneration
     * @throws BusinessRuleException
     */
    public function execute(RetryAIGenerationCommand $command): AIGeneration
    {
        $generation = $this->aiService->getGenerationById($command->generationId);
        
        if (!$generation) {
            throw new BusinessRuleException('AI Generation not found');
        }

        if (!$generation->canBeRetried()) {
            throw new BusinessRuleException('AI Generation cannot be retried in its current status');
        }

        // Check retry limit
        if ($command->retryCount >= $command->maxRetries) {
            throw new BusinessRuleException('Maximum retry attempts reached');
        }

        // Retry the generation
        $generation->retry();
        
        // Save the generation
        $updatedGeneration = $this->aiService->updateGeneration($command->generationId, [
            'status' => $generation->status,
            'error_message' => $generation->errorMessage,
            'updated_at' => $generation->updatedAt
        ]);

        return $updatedGeneration;
    }
}