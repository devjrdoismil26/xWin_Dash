<?php

namespace App\Domains\AI\Application\Services;

use App\Domains\AI\Application\Commands\GenerateContentCommand;
use App\Domains\AI\Application\Commands\CreateChatbotCommand;
use App\Domains\AI\Application\Commands\UpdateChatbotCommand;
use App\Domains\AI\Application\Commands\DeleteChatbotCommand;
use App\Domains\AI\Application\Commands\ProcessChatMessageCommand;
use App\Domains\AI\Application\Queries\GetChatbotQuery;
use App\Domains\AI\Application\Queries\ListChatbotsQuery;
use App\Domains\AI\Application\Queries\GetChatHistoryQuery;
use App\Domains\AI\Application\UseCases\GenerateContentUseCase;
use App\Domains\AI\Application\UseCases\CreateChatbotUseCase;
use App\Domains\AI\Application\UseCases\UpdateChatbotUseCase;
use App\Domains\AI\Application\UseCases\DeleteChatbotUseCase;
use App\Domains\AI\Application\UseCases\ProcessChatMessageUseCase;
use App\Domains\AI\Application\UseCases\GetChatbotUseCase;
use App\Domains\AI\Application\UseCases\ListChatbotsUseCase;
use App\Domains\AI\Application\UseCases\GetChatHistoryUseCase;
use Illuminate\Support\Facades\Log;

class AIApplicationService
{
    public function __construct(
        private GenerateContentUseCase $generateContentUseCase,
        private CreateChatbotUseCase $createChatbotUseCase,
        private UpdateChatbotUseCase $updateChatbotUseCase,
        private DeleteChatbotUseCase $deleteChatbotUseCase,
        private ProcessChatMessageUseCase $processChatMessageUseCase,
        private GetChatbotUseCase $getChatbotUseCase,
        private ListChatbotsUseCase $listChatbotsUseCase,
        private GetChatHistoryUseCase $getChatHistoryUseCase
    ) {
    }

    public function generateContent(array $data): array
    {
        $command = new GenerateContentCommand(
            prompt: $data['prompt'],
            type: $data['type'],
            parameters: $data['parameters'] ?? null,
            model: $data['model'] ?? null,
            maxTokens: $data['max_tokens'] ?? null,
            context: $data['context'] ?? null
        );

        return $this->generateContentUseCase->execute($command);
    }

    public function createChatbot(array $data): array
    {
        $command = new CreateChatbotCommand(
            name: $data['name'],
            description: $data['description'],
            personality: $data['personality'] ?? null,
            knowledgeBase: $data['knowledge_base'] ?? null,
            settings: $data['settings'] ?? null,
            isActive: $data['is_active'] ?? true
        );

        return $this->createChatbotUseCase->execute($command);
    }

    public function updateChatbot(int $chatbotId, array $data): array
    {
        $command = new UpdateChatbotCommand(
            chatbotId: $chatbotId,
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            personality: $data['personality'] ?? null,
            knowledgeBase: $data['knowledge_base'] ?? null,
            settings: $data['settings'] ?? null,
            isActive: $data['is_active'] ?? null
        );

        return $this->updateChatbotUseCase->execute($command);
    }

    public function deleteChatbot(int $chatbotId, bool $forceDelete = false): array
    {
        $command = new DeleteChatbotCommand(
            chatbotId: $chatbotId,
            forceDelete: $forceDelete
        );

        return $this->deleteChatbotUseCase->execute($command);
    }

    public function processChatMessage(int $chatbotId, string $message, ?string $sessionId = null, ?array $context = null, ?string $userId = null): array
    {
        $command = new ProcessChatMessageCommand(
            chatbotId: $chatbotId,
            message: $message,
            sessionId: $sessionId,
            context: $context,
            userId: $userId
        );

        return $this->processChatMessageUseCase->execute($command);
    }

    public function getChatbot(int $chatbotId, bool $includeStats = false, bool $includeConversations = false): array
    {
        $query = new GetChatbotQuery(
            chatbotId: $chatbotId,
            includeStats: $includeStats,
            includeConversations: $includeConversations
        );

        return $this->getChatbotUseCase->execute($query);
    }

    public function listChatbots(array $filters = [], int $page = 1, int $perPage = 15, string $sortBy = 'created_at', string $sortDirection = 'desc'): array
    {
        $query = new ListChatbotsQuery(
            search: $filters['search'] ?? null,
            isActive: $filters['is_active'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            sortDirection: $sortDirection
        );

        return $this->listChatbotsUseCase->execute($query);
    }

    public function getChatHistory(int $chatbotId, ?string $sessionId = null, ?string $userId = null, int $page = 1, int $perPage = 20): array
    {
        $query = new GetChatHistoryQuery(
            chatbotId: $chatbotId,
            sessionId: $sessionId,
            userId: $userId,
            page: $page,
            perPage: $perPage
        );

        return $this->getChatHistoryUseCase->execute($query);
    }
}
