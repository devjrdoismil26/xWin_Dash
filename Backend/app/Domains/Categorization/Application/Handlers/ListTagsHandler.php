<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Queries\ListTagsQuery;
use App\Domains\Categorization\Repositories\TagRepository;

class ListTagsHandler
{
    public function __construct(
        private TagRepository $tagRepository
    ) {
    }

    public function handle(ListTagsQuery $query): array
    {
        $filters = [
            'project_id' => $query->projectId,
            'search' => $query->search,
            'color' => $query->color
        ];

        $tags = $this->tagRepository->findByFilters(
            $filters,
            $query->limit,
            $query->offset,
            $query->sortBy,
            $query->sortDirection
        );

        $total = $this->tagRepository->countByFilters($filters);

        return [
            'tags' => $tags->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'color' => $tag->color,
                    'description' => $tag->description,
                    'project_id' => $tag->project_id,
                    'lead_count' => $this->tagRepository->getUsageCount($tag->id),
                    'created_at' => $tag->created_at->toISOString(),
                    'updated_at' => $tag->updated_at->toISOString()
                ];
            })->toArray(),
            'pagination' => [
                'total' => $total,
                'limit' => $query->limit,
                'offset' => $query->offset,
                'has_more' => ($query->offset + $query->limit) < $total
            ]
        ];
    }
}
