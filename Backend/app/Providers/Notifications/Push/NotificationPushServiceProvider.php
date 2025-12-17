<?php

namespace App\Providers\Notifications\Push;

use Illuminate\Support\ServiceProvider;

/**
 * 📲 Notification Push Service Provider
 * 
 * Registra serviços de notificação push
 */
class NotificationPushServiceProvider extends ServiceProvider
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
            \App\Services\Notifications\Push\PushNotificationService::class,
            \App\Services\Notifications\Push\PushTokenService::class,
            \App\Services\Notifications\Push\PushDeliveryService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para push notification service
        $this->app->bind(\App\Services\Notifications\Push\PushNotificationService::class, function ($app) {
            return new \App\Services\Notifications\Push\PushNotificationService();
        });

        // Binding para push token service
        $this->app->bind(\App\Services\Notifications\Push\PushTokenService::class, function ($app) {
            return new \App\Services\Notifications\Push\PushTokenService();
        });

        // Binding para push delivery service
        $this->app->bind(\App\Services\Notifications\Push\PushDeliveryService::class, function ($app) {
            return new \App\Services\Notifications\Push\PushDeliveryService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('notifications.push.enabled', true)) {
            // Registrar listeners de eventos de push
            // Event::listen(PushNotificationEvent::class, PushNotificationListener::class);
        }
    }
}