<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Commands\RemoveTagsFromLeadCommand;
use App\Domains\Categorization\Services\TagService;
use App\Domains\Categorization\Repositories\TagRepository;
use App\Domains\Categorization\Exceptions\TagRemovalException;
use Illuminate\Support\Facades\Log;

class RemoveTagsFromLeadHandler
{
    public function __construct(
        private TagService $tagService,
        private TagRepository $tagRepository
    ) {
    }

    public function handle(RemoveTagsFromLeadCommand $command): array
    {
        try {
            // Validar se todos os tags existem
            $tags = $this->tagRepository->findByIds($command->tagIds);

            if (count($tags) !== count($command->tagIds)) {
                $foundIds = $tags->pluck('id')->toArray();
                $missingIds = array_diff($command->tagIds, $foundIds);

                throw new TagRemovalException(
                    "Tags not found: " . implode(', ', $missingIds)
                );
            }

            // Remover as tags do lead
            $removedCount = $this->tagRepository->removeTagsFromLead($command->leadId, $command->tagIds);

            // Log da remoção
            Log::info("Tags removed from lead", [
                'lead_id' => $command->leadId,
                'tag_ids' => $command->tagIds,
                'user_id' => $command->userId,
                'removed_count' => $removedCount
            ]);

            return [
                'success' => true,
                'lead_id' => $command->leadId,
                'removed_tags' => $tags->map(function ($tag) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->name,
                        'color' => $tag->color
                    ];
                })->toArray(),
                'removed_count' => $removedCount,
                'removed_at' => now()->toISOString()
            ];
        } catch (TagRemovalException $e) {
            Log::error("Tag removal failed", [
                'lead_id' => $command->leadId,
                'tag_ids' => $command->tagIds,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during tag removal", [
                'lead_id' => $command->leadId,
                'tag_ids' => $command->tagIds,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new TagRemovalException(
                "Failed to remove tags from lead: " . $e->getMessage()
            );
        }
    }
}
