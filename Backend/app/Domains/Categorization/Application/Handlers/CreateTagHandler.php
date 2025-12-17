<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Commands\CreateTagCommand;
use App\Domains\Categorization\Services\TagService;
use App\Domains\Categorization\Repositories\TagRepository;
use App\Domains\Categorization\Exceptions\TagCreationException;
use Illuminate\Support\Facades\Log;

class CreateTagHandler
{
    public function __construct(
        private TagService $tagService,
        private TagRepository $tagRepository
    ) {
    }

    public function handle(CreateTagCommand $command): array
    {
        try {
            // Validar nome único no projeto
            $this->validateUniqueTagName($command->projectId, $command->name);

            // Criar a tag
            $tag = $this->tagRepository->create([
                'name' => $command->name,
                'project_id' => $command->projectId,
                'color' => $command->color,
                'description' => $command->description
            ]);

            // Log da criação
            Log::info("Tag created", [
                'tag_id' => $tag->id,
                'name' => $tag->name,
                'project_id' => $tag->project_id,
                'user_id' => $command->userId
            ]);

            return [
                'success' => true,
                'tag_id' => $tag->id,
                'name' => $tag->name,
                'color' => $tag->color,
                'description' => $tag->description,
                'project_id' => $tag->project_id,
                'created_at' => $tag->created_at->toISOString()
            ];
        } catch (TagCreationException $e) {
            Log::error("Tag creation failed", [
                'name' => $command->name,
                'project_id' => $command->projectId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during tag creation", [
                'name' => $command->name,
                'project_id' => $command->projectId,
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new TagCreationException(
                "Failed to create tag: " . $e->getMessage()
            );
        }
    }

    private function validateUniqueTagName(string $projectId, string $name): void
    {
        $existingTag = $this->tagRepository->findByNameAndProject($name, $projectId);

        if ($existingTag) {
            throw new TagCreationException(
                "A tag with the name '{$name}' already exists in this project"
            );
        }
    }
}
