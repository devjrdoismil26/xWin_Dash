<?php

namespace App\Providers\Shared\EventSystem;

use Illuminate\Support\ServiceProvider;
use App\Shared\Events\EventDispatcher;
use App\Shared\Events\EventStore;

/**
 * 🎯 Event System Service Provider
 * 
 * Registra serviços do sistema de eventos
 */
class EventSystemServiceProvider extends ServiceProvider
{
    /**
     * Indica se o provider deve ser carregado apenas quando necessário
     */
    protected $defer = true;

    /**
     * Lista de serviços fornecidos por este provider
     */
    public function provides(): array
    {
        return [
            EventStore::class,
            EventDispatcher::class,
            'domain.events',
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Register event system services
        $this->app->singleton(EventStore::class, function ($app) {
            return new EventStore();
        });

        $this->app->singleton(EventDispatcher::class, function ($app) {
            return new EventDispatcher($app->make(EventStore::class));
        });

        // Register alias for easier access
        $this->app->alias(EventDispatcher::class, 'domain.events');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('shared.event_system.enabled', true)) {
            // Register console commands
            if ($this->app->runningInConsole()) {
                $this->commands([
                    \App\Shared\Console\Commands\CleanupOldSagasCommand::class,
                ]);
            }

            // Setup event system
            $this->setupEventSystem();
        }
    }

    /**
     * Setup event system.
     */
    protected function setupEventSystem(): void
    {
        // Register event listeners for domain events
        $this->registerEventListeners();
    }

    /**
     * Register event listeners for domain events.
     */
    protected function registerEventListeners(): void
    {
        // Register domain event listeners
        // Event::listen(DomainEvent::class, DomainEventListener::class);
    }
}