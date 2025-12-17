<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        // Eventos específicos do xWin Dash
        $this->registerXWinEvents();
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }

    /**
     * Register xWin Dash specific events
     */
    private function registerXWinEvents(): void
    {
        // Eventos de projeto
        Event::listen('project.created', 'App\Listeners\ProjectCreatedListener');
        Event::listen('project.updated', 'App\Listeners\ProjectUpdatedListener');
        Event::listen('project.deleted', 'App\Listeners\ProjectDeletedListener');

        // Eventos de usuário
        Event::listen('user.created', 'App\Listeners\UserCreatedListener');
        Event::listen('user.updated', 'App\Listeners\UserUpdatedListener');

        // Eventos de workflow
        Event::listen('workflow.executed', 'App\Listeners\WorkflowExecutedListener');
        Event::listen('workflow.failed', 'App\Listeners\WorkflowFailedListener');

        // Eventos de integração
        Event::listen('integration.synced', 'App\Listeners\IntegrationSyncedListener');
        Event::listen('integration.failed', 'App\Listeners\IntegrationFailedListener');
    }
}