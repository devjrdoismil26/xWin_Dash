<?php

namespace App\Application\Aura\UseCases;

use App\Application\Aura\Commands\EscalateChatCommand;
use App\Domains\Aura\Services\AuraChatService;
use App\Domains\Aura\Domain\AuraChat;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class EscalateChatUseCase
{
    protected AuraChatService $chatService;

    public function __construct(AuraChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Executa o caso de uso para escalar um chat.
     *
     * @param EscalateChatCommand $command
     * @return AuraChat
     * @throws BusinessRuleException
     */
    public function execute(EscalateChatCommand $command): AuraChat
    {
        $chat = $this->chatService->getChatById($command->chatId);
        
        if (!$chat) {
            throw new BusinessRuleException('Chat not found');
        }

        if (!$chat->canBeEscalated()) {
            throw new BusinessRuleException('Chat cannot be escalated in its current status');
        }

        try {
            // Escalate the chat
            $chat->escalate();
            
            // Save the chat
            $updatedChat = $this->chatService->updateChat($command->chatId, [
                'status' => $chat->status,
                'priority' => $chat->priority,
                'updated_at' => $chat->updatedAt
            ]);

            Log::info("Chat {$command->chatId} escalated to priority: {$chat->priority}");

            return $updatedChat;

        } catch (\Exception $e) {
            Log::error("Failed to escalate chat {$command->chatId}: {$e->getMessage()}");
            throw new BusinessRuleException("Failed to escalate chat: {$e->getMessage()}");
        }
    }
}