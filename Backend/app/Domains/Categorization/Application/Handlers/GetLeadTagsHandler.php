<?php

namespace App\Domains\Categorization\Application\Handlers;

use App\Domains\Categorization\Application\Queries\GetLeadTagsQuery;
use App\Domains\Categorization\Repositories\TagRepository;

class GetLeadTagsHandler
{
    public function __construct(
        private TagRepository $tagRepository
    ) {
    }

    public function handle(GetLeadTagsQuery $query): array
    {
        $tags = $this->tagRepository->findByLeadId($query->leadId);

        return [
            'lead_id' => $query->leadId,
            'tags' => $tags->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'color' => $tag->color,
                    'description' => $tag->description,
                    'project_id' => $tag->project_id,
                    'assigned_at' => $tag->pivot->created_at->toISOString()
                ];
            })->toArray(),
            'total_tags' => $tags->count()
        ];
    }
}
