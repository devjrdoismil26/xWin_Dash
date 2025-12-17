<?php

namespace App\Domains\Media\Observers;

use App\Domains\Media\Events\MediaCreated;
use App\Domains\Media\Events\MediaDeleted;
use App\Domains\Media\Events\MediaUpdated;
use App\Domains\Media\Models\Media;

class MediaObserver
{
    /**
     * Handle the Media "created" event.
     */
    public function created(Media $media): void
    {
        event(new MediaCreated($media));
    }

    /**
     * Handle the Media "updated" event.
     */
    public function updated(Media $media): void
    {
        event(new MediaUpdated($media));
    }

    /**
     * Handle the Media "deleted" event.
     */
    public function deleted(Media $media): void
    {
        event(new MediaDeleted($media));
    }
}
