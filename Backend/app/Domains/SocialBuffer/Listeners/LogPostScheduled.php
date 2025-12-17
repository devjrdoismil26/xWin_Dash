<?php

namespace App\Domains\SocialBuffer\Listeners;

use App\Domains\SocialBuffer\Events\PostScheduled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log as LoggerFacade;

class LogPostScheduled implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(PostScheduled $event): void
    {
        LoggerFacade::info('Post Scheduled', [
            'post_id' => $event->post->id,
            'schedule_id' => $event->schedule->id,
            'scheduled_at' => $event->schedule->scheduled_at,
        ]);
    }
}
