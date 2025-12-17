<?php

namespace App\Domains\Media\Observers;

use App\Domains\Media\Events\FolderCreated;
use App\Domains\Media\Events\FolderDeleted;
use App\Domains\Media\Events\FolderUpdated;
use App\Domains\Media\Models\Folder;

class FolderObserver
{
    /**
     * Handle the Folder "created" event.
     */
    public function created(Folder $folder): void
    {
        event(new FolderCreated($folder));
    }

    /**
     * Handle the Folder "updated" event.
     */
    public function updated(Folder $folder): void
    {
        event(new FolderUpdated($folder));
    }

    /**
     * Handle the Folder "deleted" event.
     */
    public function deleted(Folder $folder): void
    {
        event(new FolderDeleted($folder));
    }
}
