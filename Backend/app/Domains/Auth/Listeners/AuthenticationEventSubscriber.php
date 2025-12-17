<?php

namespace App\Domains\Auth\Listeners;

use App\Domains\Auth\Events\UserLoggedIn;
use App\Domains\Auth\Events\UserLoggedOut;
use App\Domains\Users\Events\UserCreated;
use App\Domains\Users\Events\UserUpdated;
use App\Domains\Users\Events\UserDeleted;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Log as LoggerFacade;

class AuthenticationEventSubscriber
{
    /**
     * Handle user login events.
     */
    public function handleUserLoggedIn(UserLoggedIn $event): void
    {
        LoggerFacade::info("User logged in: {$event->userId}", [
            'user_id' => $event->userId,
            'ip_address' => $event->ipAddress,
            'user_agent' => $event->userAgent,
        ]);
    }

    /**
     * Handle user logout events.
     */
    public function handleUserLoggedOut(UserLoggedOut $event): void
    {
        LoggerFacade::info("User logged out: {$event->userId}", [
            'user_id' => $event->userId,
        ]);
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @return array<string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            UserLoggedIn::class => 'handleUserLoggedIn',
            UserLoggedOut::class => 'handleUserLoggedOut',
            UserCreated::class => UserCreatedListener::class,
            UserUpdated::class => UserUpdatedListener::class,
            UserDeleted::class => UserDeletedListener::class,
        ];
    }
}
