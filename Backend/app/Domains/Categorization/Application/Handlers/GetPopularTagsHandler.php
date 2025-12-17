<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Queries\GetPopularTagsQuery;
use App\Domains\Categorization\Repositories\TagRepository;

class GetPopularTagsHandler
{
    public function __construct(
        private TagRepository $tagRepository
    ) {
    }

    public function handle(GetPopularTagsQuery $query): array
    {
        $filters = [
            'project_id' => $query->projectId,
            'period' => $query->period
        ];

        $tags = $this->tagRepository->findPopularTags(
            $filters,
            $query->limit
        );

        return [
            'tags' => $tags->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'color' => $tag->color,
                    'description' => $tag->description,
                    'project_id' => $tag->project_id,
                    'usage_count' => $tag->usage_count,
                    'created_at' => $tag->created_at->toISOString()
                ];
            })->toArray(),
            'period' => $query->period,
            'limit' => $query->limit
        ];
    }
}
