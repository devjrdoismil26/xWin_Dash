<?php

namespace App\Domains\SocialBuffer\Listeners;

use App\Domains\SocialBuffer\Events\PostPublished;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log as LoggerFacade;

class LogPostPublished implements ShouldQueue
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
    public function handle(PostPublished $event): void
    {
        LoggerFacade::info('Post Published', [
            'post_id' => $event->post->id,
        ]);
    }
}
