<?php

namespace App\Domains\Categorization\Contracts;

use Illuminate\Support\Collection;

interface TagServiceInterface
{
    /**
     * Finds existing tags by name or creates new ones if they don't exist.
     *
     * @param array $tagNames an array of tag names
     *
     * @return Collection a collection of Tag models
     */
    public function findOrCreateTags(array $tagNames): Collection;
}
