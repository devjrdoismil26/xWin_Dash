<?php

namespace App\Domains\Media\Events;

use App\Domains\Media\Models\Folder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FolderUpdated
{
    use Dispatchable;
    use SerializesModels;

    public Folder $folder;

    /**
     * Create a new event instance.
     */
    public function __construct(Folder $folder)
    {
        $this->folder = $folder;
    }
}
