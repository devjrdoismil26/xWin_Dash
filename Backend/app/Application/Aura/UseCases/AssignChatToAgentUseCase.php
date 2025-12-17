<?php

namespace App\Application\Aura\UseCases;

use App\Application\Aura\Commands\AssignChatToAgentCommand;
use App\Domains\Aura\Services\AuraChatService;
use App\Domains\Aura\Domain\AuraChat;
use App\Shared\Exceptions\BusinessRuleException;
use Illuminate\Support\Facades\Log;

class AssignChatToAgentUseCase
{
    protected AuraChatService $chatService;

    public function __construct(AuraChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Executa o caso de uso para atribuir um chat a um agente.
     *
     * @param AssignChatToAgentCommand $command
     * @return AuraChat
     * @throws BusinessRuleException
     */
    public function execute(AssignChatToAgentCommand $command): AuraChat
    {
        $chat = $this->chatService->getChatById($command->chatId);
        
        if (!$chat) {
            throw new BusinessRuleException('Chat not found');
        }

        if (!$chat->canBeAssigned()) {
            throw new BusinessRuleException('Chat cannot be assigned in its current status');
        }

        // Validate agent availability
        $this->validateAgentAvailability($command->agentId);

        try {
            // Assign chat to agent
            $chat->assignToAgent($command->agentId, $command->agentName);
            
            // Save the chat
            $updatedChat = $this->chatService->updateChat($command->chatId, [
                'assigned_agent_id' => $chat->assignedAgentId,
                'assigned_agent_name' => $chat->assignedAgentName,
                'assigned_at' => $chat->assignedAt,
                'status' => $chat->status,
                'updated_at' => $chat->updatedAt
            ]);

            Log::info("Chat {$command->chatId} assigned to agent {$command->agentId}");

            return $updatedChat;

        } catch (\Exception $e) {
            Log::error("Failed to assign chat {$command->chatId} to agent {$command->agentId}: {$e->getMessage()}");
            throw new BusinessRuleException("Failed to assign chat to agent: {$e->getMessage()}");
        }
    }

    /**
     * Valida se o agente está disponível para receber o chat.
     *
     * @param string $agentId
     * @throws BusinessRuleException
     */
    private function validateAgentAvailability(string $agentId): void
    {
        // Check if agent is online and available
        $agentChats = $this->chatService->getActiveChatsByAgent($agentId);
        $maxChatsPerAgent = 10; // This could be configurable

        if (count($agentChats) >= $maxChatsPerAgent) {
            throw new BusinessRuleException("Agent {$agentId} has reached the maximum number of active chats");
        }

        // Check if agent is online (this would require agent status service)
        // $agentStatus = $this->agentStatusService->getAgentStatus($agentId);
        // if (!$agentStatus->isOnline()) {
        //     throw new BusinessRuleException("Agent {$agentId} is not online");
        // }
    }
}