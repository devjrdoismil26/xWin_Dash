<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Commands\UpdateTagCommand;
use App\Domains\Categorization\Services\TagService;
use App\Domains\Categorization\Repositories\TagRepository;
use App\Domains\Categorization\Exceptions\TagNotFoundException;
use App\Domains\Categorization\Exceptions\TagUpdateException;
use Illuminate\Support\Facades\Log;

class UpdateTagHandler
{
    public function __construct(
        private TagService $tagService,
        private TagRepository $tagRepository
    ) {
    }

    public function handle(UpdateTagCommand $command): array
    {
        try {
            // Buscar a tag existente
            $tag = $this->tagRepository->findById($command->tagId);

            if (!$tag) {
                throw new TagNotFoundException(
                    "Tag with ID {$command->tagId} not found"
                );
            }

            // Validar nome único se estiver sendo alterado
            if ($command->name && $command->name !== $tag->name) {
                $this->validateUniqueTagName($tag->project_id, $command->name, $command->tagId);
            }

            // Preparar dados para atualização
            $updateData = $command->toArray();
            unset($updateData['user_id']); // Remover user_id dos dados de atualização

            // Atualizar a tag
            $this->tagRepository->update($command->tagId, $updateData);

            // Buscar a tag atualizada
            $updatedTag = $this->tagRepository->findById($command->tagId);

            // Log da atualização
            Log::info("Tag updated", [
                'tag_id' => $command->tagId,
                'user_id' => $command->userId,
                'updated_fields' => array_keys($updateData)
            ]);

            return [
                'success' => true,
                'tag_id' => $updatedTag->id,
                'name' => $updatedTag->name,
                'color' => $updatedTag->color,
                'description' => $updatedTag->description,
                'project_id' => $updatedTag->project_id,
                'updated_at' => $updatedTag->updated_at->toISOString()
            ];
        } catch (TagNotFoundException $e) {
            Log::error("Tag not found for update", [
                'tag_id' => $command->tagId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (TagUpdateException $e) {
            Log::error("Tag update failed", [
                'tag_id' => $command->tagId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during tag update", [
                'tag_id' => $command->tagId,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new TagUpdateException(
                "Failed to update tag: " . $e->getMessage()
            );
        }
    }

    private function validateUniqueTagName(string $projectId, string $name, string $excludeTagId): void
    {
        $existingTag = $this->tagRepository->findByNameAndProject($name, $projectId);

        if ($existingTag && $existingTag->id !== $excludeTagId) {
            throw new TagUpdateException(
                "A tag with the name '{$name}' already exists in this project"
            );
        }
    }
}
