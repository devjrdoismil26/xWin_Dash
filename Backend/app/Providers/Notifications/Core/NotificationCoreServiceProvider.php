<?php

namespace App\Providers\Notifications\Core;

use Illuminate\Support\ServiceProvider;

/**
 * 🔔 Notification Core Service Provider
 * 
 * Registra serviços core de notificação
 */
class NotificationCoreServiceProvider extends ServiceProvider
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
            \App\Services\Notifications\NotificationManager::class,
            \App\Services\Notifications\NotificationQueue::class,
            \App\Services\Notifications\NotificationValidator::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para notification manager
        $this->app->bind(\App\Services\Notifications\NotificationManager::class, function ($app) {
            return new \App\Services\Notifications\NotificationManager();
        });

        // Binding para notification queue
        $this->app->bind(\App\Services\Notifications\NotificationQueue::class, function ($app) {
            return new \App\Services\Notifications\NotificationQueue();
        });

        // Binding para notification validator
        $this->app->bind(\App\Services\Notifications\NotificationValidator::class, function ($app) {
            return new \App\Services\Notifications\NotificationValidator();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('notifications.core.enabled', true)) {
            // Registrar listeners de eventos core
            // Event::listen(NotificationCoreEvent::class, NotificationCoreListener::class);
        }
    }
}