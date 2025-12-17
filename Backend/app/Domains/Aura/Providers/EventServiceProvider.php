<?php

namespace App\Domains\Aura\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

/**
 * Aura Event Service Provider
 * 
 * Registers event listeners for the Aura domain.
 * Currently empty as events are handled by the main EventServiceProvider.
 * 
 * @todo Implement Aura-specific event listeners when needed
 */
class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // Aura-specific events can be registered here
        // Example:
        // AuraConnectionEstablished::class => [
        //     LogConnectionEvent::class,
        // ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
