<?php

namespace App\Domains\Aura\Application\Services;

use App\Domains\Aura\Application\Commands\CreateAuraChatCommand;
use App\Domains\Aura\Application\Commands\UpdateAuraChatCommand;
use App\Domains\Aura\Application\Commands\DeleteAuraChatCommand;
use App\Domains\Aura\Application\Commands\SendAuraMessageCommand;
use App\Domains\Aura\Application\Commands\ProcessAuraWorkflowCommand;
use App\Domains\Aura\Application\Queries\GetAuraChatQuery;
use App\Domains\Aura\Application\Queries\ListAuraChatsQuery;
use App\Domains\Aura\Application\Queries\GetAuraMessagesQuery;
use App\Domains\Aura\Application\Queries\GetAuraInsightsQuery;
use App\Domains\Aura\Application\UseCases\CreateAuraChatUseCase;
use App\Domains\Aura\Application\UseCases\UpdateAuraChatUseCase;
use App\Domains\Aura\Application\UseCases\DeleteAuraChatUseCase;
use App\Domains\Aura\Application\UseCases\SendAuraMessageUseCase;
use App\Domains\Aura\Application\UseCases\ProcessAuraWorkflowUseCase;
use App\Domains\Aura\Application\UseCases\GetAuraChatUseCase;
use App\Domains\Aura\Application\UseCases\ListAuraChatsUseCase;
use App\Domains\Aura\Application\UseCases\GetAuraMessagesUseCase;
use App\Domains\Aura\Application\UseCases\GetAuraInsightsUseCase;
use Illuminate\Support\Facades\Log;

class AuraApplicationService
{
    public function __construct(
        private CreateAuraChatUseCase $createAuraChatUseCase,
        private UpdateAuraChatUseCase $updateAuraChatUseCase,
        private DeleteAuraChatUseCase $deleteAuraChatUseCase,
        private SendAuraMessageUseCase $sendAuraMessageUseCase,
        private ProcessAuraWorkflowUseCase $processAuraWorkflowUseCase,
        private GetAuraChatUseCase $getAuraChatUseCase,
        private ListAuraChatsUseCase $listAuraChatsUseCase,
        private GetAuraMessagesUseCase $getAuraMessagesUseCase,
        private GetAuraInsightsUseCase $getAuraInsightsUseCase
    ) {
    }

    public function createAuraChat(array $data): array
    {
        $command = new CreateAuraChatCommand(
            title: $data['title'],
            description: $data['description'] ?? null,
            personality: $data['personality'] ?? null,
            context: $data['context'] ?? null,
            settings: $data['settings'] ?? null,
            isActive: $data['is_active'] ?? true
        );

        return $this->createAuraChatUseCase->execute($command);
    }

    public function updateAuraChat(int $chatId, array $data): array
    {
        $command = new UpdateAuraChatCommand(
            chatId: $chatId,
            title: $data['title'] ?? null,
            description: $data['description'] ?? null,
            personality: $data['personality'] ?? null,
            context: $data['context'] ?? null,
            settings: $data['settings'] ?? null,
            isActive: $data['is_active'] ?? null
        );

        return $this->updateAuraChatUseCase->execute($command);
    }

    public function deleteAuraChat(int $chatId, bool $forceDelete = false): array
    {
        $command = new DeleteAuraChatCommand(
            chatId: $chatId,
            forceDelete: $forceDelete
        );

        return $this->deleteAuraChatUseCase->execute($command);
    }

    public function sendAuraMessage(int $chatId, string $message, ?string $messageType = 'text', ?array $attachments = null, ?array $context = null): array
    {
        $command = new SendAuraMessageCommand(
            chatId: $chatId,
            message: $message,
            messageType: $messageType,
            attachments: $attachments,
            context: $context
        );

        return $this->sendAuraMessageUseCase->execute($command);
    }

    public function processAuraWorkflow(string $workflowType, array $data, ?string $trigger = null, ?array $context = null, ?array $parameters = null): array
    {
        $command = new ProcessAuraWorkflowCommand(
            workflowType: $workflowType,
            data: $data,
            trigger: $trigger,
            context: $context,
            parameters: $parameters
        );

        return $this->processAuraWorkflowUseCase->execute($command);
    }

    public function getAuraChat(int $chatId, bool $includeMessages = false, bool $includeContext = false, ?int $messageLimit = 50): array
    {
        $query = new GetAuraChatQuery(
            chatId: $chatId,
            includeMessages: $includeMessages,
            includeContext: $includeContext,
            messageLimit: $messageLimit
        );

        return $this->getAuraChatUseCase->execute($query);
    }

    public function listAuraChats(array $filters = [], int $page = 1, int $perPage = 15, string $sortBy = 'created_at', string $sortDirection = 'desc'): array
    {
        $query = new ListAuraChatsQuery(
            search: $filters['search'] ?? null,
            personality: $filters['personality'] ?? null,
            isActive: $filters['is_active'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            sortDirection: $sortDirection
        );

        return $this->listAuraChatsUseCase->execute($query);
    }

    public function getAuraMessages(int $chatId, ?string $messageType = null, ?string $dateFrom = null, ?string $dateTo = null, int $page = 1, int $perPage = 20): array
    {
        $query = new GetAuraMessagesQuery(
            chatId: $chatId,
            messageType: $messageType,
            dateFrom: $dateFrom,
            dateTo: $dateTo,
            page: $page,
            perPage: $perPage
        );

        return $this->getAuraMessagesUseCase->execute($query);
    }

    public function getAuraInsights(?int $chatId = null, ?string $insightType = null, ?string $dateFrom = null, ?string $dateTo = null, ?array $filters = null): array
    {
        $query = new GetAuraInsightsQuery(
            chatId: $chatId,
            insightType: $insightType,
            dateFrom: $dateFrom,
            dateTo: $dateTo,
            filters: $filters
        );

        return $this->getAuraInsightsUseCase->execute($query);
    }
}
