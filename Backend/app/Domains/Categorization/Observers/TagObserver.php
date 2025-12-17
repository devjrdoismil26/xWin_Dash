<?php

namespace App\Domains\Categorization\Observers;

use App\Domains\Categorization\Events\TagCreated;
use App\Domains\Categorization\Events\TagDeleted;
use App\Domains\Categorization\Events\TagUpdated;
use App\Domains\Categorization\Infrastructure\Persistence\Eloquent\TagModel as Tag;

class TagObserver
{
    /**
     * Handle the Tag "created" event.
     */
    public function created(Tag $tag): void
    {
        event(new TagCreated($tag));
    }

    /**
     * Handle the Tag "updated" event.
     */
    public function updated(Tag $tag): void
    {
        event(new TagUpdated($tag));
    }

    /**
     * Handle the Tag "deleted" event.
     */
    public function deleted(Tag $tag): void
    {
        event(new TagDeleted($tag));
    }
}
