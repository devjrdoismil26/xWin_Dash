<?php

namespace App\Domains\SocialBuffer\Listeners;

use App\Domains\SocialBuffer\Events\PostEngagementThreshold;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log as LoggerFacade;

class LogPostEngagementThreshold implements ShouldQueue
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
    public function handle(PostEngagementThreshold $event): void
    {
        LoggerFacade::info('Post Engagement Threshold Reached', [
            'post_id' => $event->post->id,
            'metric' => $event->metric,
            'value' => $event->value,
        ]);
    }
}
