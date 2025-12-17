<?php

namespace App\Application\AI\UseCases;

use App\Application\AI\Commands\CreateChatbotCommand;
use App\Domains\AI\Services\ChatService;
use App\Domains\AI\Domain\Chatbot;
use App\Shared\Exceptions\BusinessRuleException;

class CreateChatbotUseCase
{
    protected ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Executa o caso de uso para criar um novo chatbot.
     *
     * @param CreateChatbotCommand $command
     * @return Chatbot
     * @throws BusinessRuleException
     */
    public function execute(CreateChatbotCommand $command): Chatbot
    {
        // Validate chatbot configuration
        $this->validateChatbotConfiguration($command);

        // Create the chatbot
        $chatbot = $this->chatService->createChatbot([
            'user_id' => $command->userId,
            'name' => $command->name,
            'description' => $command->description,
            'type' => $command->type,
            'configuration' => $command->configuration,
            'welcome_message' => $command->welcomeMessage,
            'fallback_message' => $command->fallbackMessage,
            'max_conversations' => $command->maxConversations,
        ]);

        return $chatbot;
    }

    /**
     * Valida a configuração do chatbot.
     *
     * @param CreateChatbotCommand $command
     * @throws BusinessRuleException
     */
    private function validateChatbotConfiguration(CreateChatbotCommand $command): void
    {
        // Check if user can create more chatbots
        $userChatbots = $this->chatService->getChatbotsByUser($command->userId);
        $maxChatbots = $command->maxChatbotsPerUser ?? 10;

        if (count($userChatbots) >= $maxChatbots) {
            throw new BusinessRuleException("User has reached the maximum limit of {$maxChatbots} chatbots");
        }

        // Validate chatbot type
        if (!in_array($command->type, Chatbot::getValidTypes())) {
            throw new BusinessRuleException("Invalid chatbot type: {$command->type}");
        }

        // Validate configuration based on type
        $this->validateTypeSpecificConfiguration($command->type, $command->configuration);
    }

    /**
     * Valida configurações específicas do tipo de chatbot.
     *
     * @param string $type
     * @param array $configuration
     * @throws BusinessRuleException
     */
    private function validateTypeSpecificConfiguration(string $type, array $configuration): void
    {
        switch ($type) {
            case Chatbot::TYPE_CUSTOMER_SERVICE:
                if (!isset($configuration['response_timeout'])) {
                    throw new BusinessRuleException('Customer service chatbot must have response_timeout configuration');
                }
                break;

            case Chatbot::TYPE_SALES:
                if (!isset($configuration['conversion_goals'])) {
                    throw new BusinessRuleException('Sales chatbot must have conversion_goals configuration');
                }
                break;

            case Chatbot::TYPE_LEAD_GENERATION:
                if (!isset($configuration['lead_capture_fields'])) {
                    throw new BusinessRuleException('Lead generation chatbot must have lead_capture_fields configuration');
                }
                break;

            case Chatbot::TYPE_FAQ:
                if (!isset($configuration['knowledge_base'])) {
                    throw new BusinessRuleException('FAQ chatbot must have knowledge_base configuration');
                }
                break;
        }
    }
}