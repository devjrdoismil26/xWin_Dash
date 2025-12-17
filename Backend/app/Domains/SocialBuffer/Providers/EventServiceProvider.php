<?php

namespace App\Domains\SocialBuffer\Providers;

use App\Application\SocialBuffer\Listeners\ProcessPostListener;
use App\Domains\SocialBuffer\Events\PostCreated;
use App\Domains\SocialBuffer\Events\PostEngagementThreshold;
use App\Domains\SocialBuffer\Events\PostPublished;
use App\Domains\SocialBuffer\Events\PostScheduled;
use App\Domains\SocialBuffer\Listeners\LogPostEngagementThreshold;
use App\Domains\SocialBuffer\Listeners\LogPostPublished;
use App\Domains\SocialBuffer\Listeners\LogPostScheduled;
use App\Domains\SocialBuffer\Listeners\SendPostPublishedNotification;
use App\Domains\SocialBuffer\Listeners\SendPostScheduledNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        PostCreated::class => [
            ProcessPostListener::class,
        ],
        PostEngagementThreshold::class => [
            LogPostEngagementThreshold::class,
        ],
        PostPublished::class => [
            LogPostPublished::class,
            SendPostPublishedNotification::class,
        ],
        PostScheduled::class => [
            LogPostScheduled::class,
            SendPostScheduledNotification::class,
        ],
    ];

    public function boot(): void
    {
    }
}
