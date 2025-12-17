<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Commands\AssignTagsToLeadCommand;
use App\Domains\Categorization\Services\TagService;
use App\Domains\Categorization\Repositories\TagRepository;
use App\Domains\Categorization\Exceptions\TagAssignmentException;
use Illuminate\Support\Facades\Log;

class AssignTagsToLeadHandler
{
    public function __construct(
        private TagService $tagService,
        private TagRepository $tagRepository
    ) {
    }

    public function handle(AssignTagsToLeadCommand $command): array
    {
        try {
            // Validar se todos os tags existem
            $tags = $this->tagRepository->findByIds($command->tagIds);

            if (count($tags) !== count($command->tagIds)) {
                $foundIds = $tags->pluck('id')->toArray();
                $missingIds = array_diff($command->tagIds, $foundIds);

                throw new TagAssignmentException(
                    "Tags not found: " . implode(', ', $missingIds)
                );
            }

            // Se replaceExisting, remover todas as tags existentes primeiro
            if ($command->replaceExisting) {
                $this->tagRepository->removeAllTagsFromLead($command->leadId);
                Log::info("Removed existing tags from lead", [
                    'lead_id' => $command->leadId
                ]);
            }

            // Associar as tags ao lead
            $this->tagRepository->assignTagsToLead($command->leadId, $command->tagIds);

            // Log da associação
            Log::info("Tags assigned to lead", [
                'lead_id' => $command->leadId,
                'tag_ids' => $command->tagIds,
                'user_id' => $command->userId,
                'replace_existing' => $command->replaceExisting
            ]);

            return [
                'success' => true,
                'lead_id' => $command->leadId,
                'assigned_tags' => $tags->map(function ($tag) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->name,
                        'color' => $tag->color
                    ];
                })->toArray(),
                'assigned_at' => now()->toISOString()
            ];
        } catch (TagAssignmentException $e) {
            Log::error("Tag assignment failed", [
                'lead_id' => $command->leadId,
                'tag_ids' => $command->tagIds,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during tag assignment", [
                'lead_id' => $command->leadId,
                'tag_ids' => $command->tagIds,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new TagAssignmentException(
                "Failed to assign tags to lead: " . $e->getMessage()
            );
        }
    }
}
