<?php

namespace App\Application\Aura\UseCases;

use App\Application\Aura\Commands\CloseChatCommand;
use App\Domains\Aura\Services\AuraChatService;
use App\Domains\Aura\Domain\AuraChat;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class CloseChatUseCase
{
    protected AuraChatService $chatService;

    public function __construct(AuraChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Executa o caso de uso para fechar um chat.
     *
     * @param CloseChatCommand $command
     * @return AuraChat
     * @throws BusinessRuleException
     */
    public function execute(CloseChatCommand $command): AuraChat
    {
        $chat = $this->chatService->getChatById($command->chatId);
        
        if (!$chat) {
            throw new BusinessRuleException('Chat not found');
        }

        if (!$chat->canBeClosed()) {
            throw new BusinessRuleException('Chat cannot be closed in its current status');
        }

        try {
            // Close the chat
            $chat->close($command->reason);
            
            // Save the chat
            $updatedChat = $this->chatService->updateChat($command->chatId, [
                'status' => $chat->status,
                'closed_at' => $chat->closedAt,
                'close_reason' => $chat->closeReason,
                'updated_at' => $chat->updatedAt
            ]);

            Log::info("Chat {$command->chatId} closed with reason: {$command->reason}");

            return $updatedChat;

        } catch (\Exception $e) {
            Log::error("Failed to close chat {$command->chatId}: {$e->getMessage()}");
            throw new BusinessRuleException("Failed to close chat: {$e->getMessage()}");
        }
    }
}