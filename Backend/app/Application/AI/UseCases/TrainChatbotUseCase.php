<?php

namespace App\Application\AI\UseCases;

use App\Application\AI\Commands\TrainChatbotCommand;
use App\Domains\AI\Services\ChatService;
use App\Domains\AI\Domain\Chatbot;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class TrainChatbotUseCase
{
    protected ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Executa o caso de uso para treinar um chatbot.
     *
     * @param TrainChatbotCommand $command
     * @return Chatbot
     * @throws BusinessRuleException
     */
    public function execute(TrainChatbotCommand $command): Chatbot
    {
        $chatbot = $this->chatService->getChatbotById($command->chatbotId);
        
        if (!$chatbot) {
            throw new BusinessRuleException('Chatbot not found');
        }

        if (!$chatbot->isActive()) {
            throw new BusinessRuleException('Cannot train inactive chatbot');
        }

        if ($chatbot->isTraining()) {
            throw new BusinessRuleException('Chatbot is already being trained');
        }

        try {
            // Start training
            $chatbot->startTraining();
            $this->chatService->updateChatbot($command->chatbotId, [
                'status' => $chatbot->status,
                'updated_at' => $chatbot->updatedAt
            ]);

            // Add training data if provided
            if (!empty($command->trainingData)) {
                $chatbot->addTrainingData($command->trainingData);
                $this->chatService->updateChatbot($command->chatbotId, [
                    'training_data' => $chatbot->trainingData,
                    'updated_at' => $chatbot->updatedAt
                ]);
            }

            // Simulate training process (in real implementation, this would call AI training service)
            $this->simulateTrainingProcess($chatbot);

            // Finish training
            $chatbot->finishTraining();
            $updatedChatbot = $this->chatService->updateChatbot($command->chatbotId, [
                'status' => $chatbot->status,
                'last_trained_at' => $chatbot->lastTrainedAt,
                'updated_at' => $chatbot->updatedAt
            ]);

            Log::info("Chatbot {$command->chatbotId} training completed successfully");

            return $updatedChatbot;

        } catch (\Exception $e) {
            // Mark as failed and return to active status
            $chatbot->activate();
            $this->chatService->updateChatbot($command->chatbotId, [
                'status' => $chatbot->status,
                'updated_at' => $chatbot->updatedAt
            ]);

            Log::error("Chatbot {$command->chatbotId} training failed: {$e->getMessage()}");
            
            throw new BusinessRuleException("Chatbot training failed: {$e->getMessage()}");
        }
    }

    /**
     * Simula o processo de treinamento (em implementação real, chamaria serviço de treinamento de IA).
     *
     * @param Chatbot $chatbot
     */
    private function simulateTrainingProcess(Chatbot $chatbot): void
    {
        // Simulate training time based on training data size
        $trainingDataSize = count($chatbot->trainingData ?? []);
        $trainingTime = min(30, max(5, $trainingDataSize / 10)); // 5-30 seconds
        
        sleep($trainingTime);
    }
}