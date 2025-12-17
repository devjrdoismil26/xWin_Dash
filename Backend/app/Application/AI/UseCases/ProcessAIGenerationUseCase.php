<?php

namespace App\Application\AI\UseCases;

use App\Application\AI\Commands\ProcessAIGenerationCommand;
use App\Domains\AI\Services\AIService;
use App\Domains\AI\Services\AIProviderManager;
use App\Domains\AI\Domain\AIGeneration;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class ProcessAIGenerationUseCase
{
    protected AIService $aiService;
    protected AIProviderManager $providerManager;

    public function __construct(
        AIService $aiService,
        AIProviderManager $providerManager
    ) {
        $this->aiService = $aiService;
        $this->providerManager = $providerManager;
    }

    /**
     * Executa o caso de uso para processar uma geração de IA.
     *
     * @param ProcessAIGenerationCommand $command
     * @return AIGeneration
     * @throws BusinessRuleException
     */
    public function execute(ProcessAIGenerationCommand $command): AIGeneration
    {
        $generation = $this->aiService->getGenerationById($command->generationId);
        
        if (!$generation) {
            throw new BusinessRuleException('AI Generation not found');
        }

        if (!$generation->canBeProcessed()) {
            throw new BusinessRuleException('AI Generation cannot be processed in its current status');
        }

        try {
            // Mark as processing
            $generation->markAsProcessing();
            $this->aiService->updateGeneration($command->generationId, [
                'status' => $generation->status,
                'updated_at' => $generation->updatedAt
            ]);

            // Get the appropriate provider
            $provider = $this->providerManager->getProvider($generation->provider);
            
            if (!$provider) {
                throw new BusinessRuleException("Provider {$generation->provider} not available");
            }

            // Process the generation
            $result = $provider->generate($generation->prompt, $generation->model, $generation->parameters ?? []);

            if ($result['success']) {
                // Mark as completed
                $generation->markAsCompleted(
                    $result['content'],
                    $result['usage_meta'] ?? null
                );
                
                Log::info("AI Generation {$command->generationId} completed successfully");
            } else {
                // Mark as failed
                $generation->markAsFailed($result['error_message']);
                
                Log::error("AI Generation {$command->generationId} failed: {$result['error_message']}");
            }

            // Save the generation
            $updatedGeneration = $this->aiService->updateGeneration($command->generationId, [
                'status' => $generation->status,
                'response_content' => $generation->responseContent,
                'usage_meta' => $generation->usageMeta,
                'error_message' => $generation->errorMessage,
                'updated_at' => $generation->updatedAt
            ]);

            return $updatedGeneration;

        } catch (\Exception $e) {
            // Mark as failed
            $generation->markAsFailed($e->getMessage());
            
            $this->aiService->updateGeneration($command->generationId, [
                'status' => $generation->status,
                'error_message' => $generation->errorMessage,
                'updated_at' => $generation->updatedAt
            ]);

            Log::error("AI Generation {$command->generationId} failed with exception: {$e->getMessage()}");
            
            throw new BusinessRuleException("AI Generation processing failed: {$e->getMessage()}");
        }
    }
}