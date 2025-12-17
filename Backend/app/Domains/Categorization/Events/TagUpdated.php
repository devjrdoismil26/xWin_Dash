<?php

namespace App\Domains\Categorization\Events;

use App\Domains\Categorization\Infrastructure\Persistence\Eloquent\TagModel as Tag;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TagUpdated
{
    use Dispatchable;
    use SerializesModels;

    public Tag $tag;

    /**
     * Create a new event instance.
     */
    public function __construct(Tag $tag)
    {
        $this->tag = $tag;
    }
}
