<?php

namespace App\Application\SocialBuffer\Commands;

use App\Domains\SocialBuffer\Models\Schedule;

class PublishScheduledPostCommand
{
    public function __construct(
        public readonly Schedule $schedule,
    ) {
    }
}
