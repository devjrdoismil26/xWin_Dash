<?php

namespace App\Domains\Categorization\Services;

use App\Domains\Categorization\Contracts\TagServiceInterface;
use App\Domains\Categorization\Infrastructure\Persistence\Eloquent\TagModel as Tag;
use Illuminate\Support\Collection;

class TagService implements TagServiceInterface
{
    /**
     * Finds existing tags by name or creates new ones if they don't exist.
     *
     * @param array $tagNames an array of tag names
     *
     * @return Collection a collection of Tag models
     */
    public function findOrCreateTags(array $tagNames): Collection
    {
        return collect($tagNames)->map(function ($tagName) {
            return Tag::firstOrCreate(['name' => $tagName]);
        });
    }
}
