<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Queries\GetTagQuery;
use App\Domains\Categorization\Repositories\TagRepository;
use App\Domains\Categorization\Exceptions\TagNotFoundException;

class GetTagHandler
{
    public function __construct(
        private TagRepository $tagRepository
    ) {
    }

    public function handle(GetTagQuery $query): array
    {
        $tag = $this->tagRepository->findById($query->tagId);

        if (!$tag) {
            throw new TagNotFoundException(
                "Tag with ID {$query->tagId} not found"
            );
        }

        $result = [
            'id' => $tag->id,
            'name' => $tag->name,
            'color' => $tag->color,
            'description' => $tag->description,
            'project_id' => $tag->project_id,
            'created_at' => $tag->created_at->toISOString(),
            'updated_at' => $tag->updated_at->toISOString()
        ];

        if ($query->includeLeadCount) {
            $result['lead_count'] = $this->tagRepository->getUsageCount($tag->id);
        }

        return $result;
    }
}
