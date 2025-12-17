<?php

namespace App\Domains\Categorization\Application\Services;

use App\Domains\Categorization\Application\Commands\CreateTagCommand;
use App\Domains\Categorization\Application\Commands\UpdateTagCommand;
use App\Domains\Categorization\Application\Commands\DeleteTagCommand;
use App\Domains\Categorization\Application\Commands\AssignTagsToLeadCommand;
use App\Domains\Categorization\Application\Commands\RemoveTagsFromLeadCommand;
use App\Domains\Categorization\Application\Queries\GetTagQuery;
use App\Domains\Categorization\Application\Queries\ListTagsQuery;
use App\Domains\Categorization\Application\Queries\GetPopularTagsQuery;
use App\Domains\Categorization\Application\Queries\GetLeadTagsQuery;
use App\Domains\Categorization\Application\UseCases\CreateTagUseCase;
use App\Domains\Categorization\Application\UseCases\AssignTagsToLeadUseCase;
use App\Domains\Categorization\Application\UseCases\GetPopularTagsUseCase;
use App\Domains\Categorization\Application\UseCases\ListTagsUseCase;

class CategorizationApplicationService
{
    public function __construct(
        private CreateTagUseCase $createTagUseCase,
        private AssignTagsToLeadUseCase $assignTagsToLeadUseCase,
        private GetPopularTagsUseCase $getPopularTagsUseCase,
        private ListTagsUseCase $listTagsUseCase
    ) {
    }

    public function createTag(CreateTagCommand $command): array
    {
        return $this->createTagUseCase->execute($command);
    }

    public function assignTagsToLead(AssignTagsToLeadCommand $command): array
    {
        return $this->assignTagsToLeadUseCase->execute($command);
    }

    public function getPopularTags(GetPopularTagsQuery $query): array
    {
        return $this->getPopularTagsUseCase->execute($query);
    }

    public function listTags(ListTagsQuery $query): array
    {
        return $this->listTagsUseCase->execute($query);
    }

    // Métodos de conveniência para operações comuns
    public function createTagWithRandomColor(int $userId, string $name, string $projectId, ?string $description = null): array
    {
        $colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
            '#E67E22', '#2ECC71', '#F39C12', '#E74C3C'
        ];

        $command = new CreateTagCommand(
            userId: $userId,
            name: $name,
            projectId: $projectId,
            color: $colors[array_rand($colors)],
            description: $description
        );

        return $this->createTag($command);
    }

    public function assignSingleTagToLead(int $userId, string $leadId, string $tagId): array
    {
        $command = new AssignTagsToLeadCommand(
            userId: $userId,
            leadId: $leadId,
            tagIds: [$tagId],
            replaceExisting: false
        );

        return $this->assignTagsToLead($command);
    }

    public function replaceLeadTags(int $userId, string $leadId, array $tagIds): array
    {
        $command = new AssignTagsToLeadCommand(
            userId: $userId,
            leadId: $leadId,
            tagIds: $tagIds,
            replaceExisting: true
        );

        return $this->assignTagsToLead($command);
    }

    public function getProjectTags(int $userId, string $projectId, int $limit = 50): array
    {
        $query = new ListTagsQuery(
            userId: $userId,
            projectId: $projectId,
            limit: $limit,
            offset: 0
        );

        return $this->listTags($query);
    }

    public function searchTags(int $userId, string $searchTerm, ?string $projectId = null): array
    {
        $query = new ListTagsQuery(
            userId: $userId,
            projectId: $projectId,
            search: $searchTerm,
            limit: 20,
            offset: 0
        );

        return $this->listTags($query);
    }

    public function getMostPopularTags(int $userId, ?string $projectId = null, int $limit = 10): array
    {
        $query = new GetPopularTagsQuery(
            userId: $userId,
            projectId: $projectId,
            limit: $limit,
            period: 'month'
        );

        return $this->getPopularTags($query);
    }

    public function findOrCreateTags(int $userId, string $projectId, array $tagNames): array
    {
        $createdTags = [];
        $existingTags = [];

        foreach ($tagNames as $tagName) {
            try {
                // Tentar buscar tag existente
                $searchQuery = new ListTagsQuery(
                    userId: $userId,
                    projectId: $projectId,
                    search: $tagName,
                    limit: 1,
                    offset: 0
                );

                $searchResult = $this->listTags($searchQuery);

                if (!empty($searchResult['tags'])) {
                    $existingTags[] = $searchResult['tags'][0];
                } else {
                    // Criar nova tag
                    $createCommand = new CreateTagCommand(
                        userId: $userId,
                        name: $tagName,
                        projectId: $projectId
                    );

                    $createdTag = $this->createTag($createCommand);
                    $createdTags[] = $createdTag;
                }
            } catch (\Exception $e) {
                // Log do erro mas continue com as outras tags
                \Log::warning("Failed to find or create tag", [
                    'tag_name' => $tagName,
                    'project_id' => $projectId,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return [
            'created_tags' => $createdTags,
            'existing_tags' => $existingTags,
            'total_processed' => count($tagNames)
        ];
    }
}
