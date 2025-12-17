<?php

namespace App\Domains\Core\Providers;

use App\Domains\Core\Events\NotificationCreated;
use App\Domains\Core\Events\NotificationSentEvent;
use App\Domains\Core\Events\PushNotificationEvent;
use App\Domains\Core\Listeners\InitializeUserApiConfigurations;
use App\Domains\Core\Listeners\ProjectStatusChangedListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<string, array<int, string>>
     */
    protected $listen = [
        NotificationCreated::class => [
            // Listener para quando uma notificação é criada
        ],
        NotificationSentEvent::class => [
            // Listener para quando uma notificação é enviada
        ],
        PushNotificationEvent::class => [
            // Listener para quando uma notificação push é disparada
        ],
    ];

    /**
     * The subscriber classes to register.
     *
     * @var array
     */
    protected $subscribe = [
        // Subscribers must implement a subscribe() method. These are listeners, not subscribers.
        // InitializeUserApiConfigurations::class,
        // ProjectStatusChangedListener::class,
    ];

    /**
     * Register any events for your application.
     */
    public function boot()
    {
        parent::boot();
    }
}
