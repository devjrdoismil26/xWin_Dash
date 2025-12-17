<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Commands\DeleteTagCommand;
use App\Domains\Categorization\Services\TagService;
use App\Domains\Categorization\Repositories\TagRepository;
use App\Domains\Categorization\Exceptions\TagNotFoundException;
use App\Domains\Categorization\Exceptions\TagDeletionException;
use Illuminate\Support\Facades\Log;

class DeleteTagHandler
{
    public function __construct(
        private TagService $tagService,
        private TagRepository $tagRepository
    ) {
    }

    public function handle(DeleteTagCommand $command): array
    {
        try {
            // Buscar a tag existente
            $tag = $this->tagRepository->findById($command->tagId);

            if (!$tag) {
                throw new TagNotFoundException(
                    "Tag with ID {$command->tagId} not found"
                );
            }

            // Verificar se a tag está sendo usada
            $usageCount = $this->tagRepository->getUsageCount($command->tagId);

            if ($usageCount > 0 && !$command->forceDelete) {
                throw new TagDeletionException(
                    "Cannot delete tag that is being used by {$usageCount} leads. Use force delete to proceed."
                );
            }

            // Se force delete, remover todas as associações primeiro
            if ($command->forceDelete && $usageCount > 0) {
                $this->tagRepository->removeAllAssociations($command->tagId);
                Log::info("Removed all tag associations", [
                    'tag_id' => $command->tagId,
                    'associations_removed' => $usageCount
                ]);
            }

            // Deletar a tag
            $this->tagRepository->delete($command->tagId);

            // Log da deleção
            Log::info("Tag deleted", [
                'tag_id' => $command->tagId,
                'user_id' => $command->userId,
                'force_delete' => $command->forceDelete,
                'usage_count' => $usageCount
            ]);

            return [
                'success' => true,
                'tag_id' => $command->tagId,
                'deleted_at' => now()->toISOString(),
                'associations_removed' => $command->forceDelete ? $usageCount : 0
            ];
        } catch (TagNotFoundException $e) {
            Log::error("Tag not found for deletion", [
                'tag_id' => $command->tagId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (TagDeletionException $e) {
            Log::error("Tag deletion failed", [
                'tag_id' => $command->tagId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during tag deletion", [
                'tag_id' => $command->tagId,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new TagDeletionException(
                "Failed to delete tag: " . $e->getMessage()
            );
        }
    }
}
