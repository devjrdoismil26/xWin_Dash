<?php

namespace App\Providers\Notifications\Sms;

use Illuminate\Support\ServiceProvider;

/**
 * 📱 Notification SMS Service Provider
 * 
 * Registra serviços de notificação por SMS
 */
class NotificationSmsServiceProvider extends ServiceProvider
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
            \App\Services\Notifications\Sms\SmsNotificationService::class,
            \App\Services\Notifications\Sms\SmsProviderService::class,
            \App\Services\Notifications\Sms\SmsDeliveryService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para SMS notification service
        $this->app->bind(\App\Services\Notifications\Sms\SmsNotificationService::class, function ($app) {
            return new \App\Services\Notifications\Sms\SmsNotificationService();
        });

        // Binding para SMS provider service
        $this->app->bind(\App\Services\Notifications\Sms\SmsProviderService::class, function ($app) {
            return new \App\Services\Notifications\Sms\SmsProviderService();
        });

        // Binding para SMS delivery service
        $this->app->bind(\App\Services\Notifications\Sms\SmsDeliveryService::class, function ($app) {
            return new \App\Services\Notifications\Sms\SmsDeliveryService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('notifications.sms.enabled', true)) {
            // Registrar listeners de eventos de SMS
            // Event::listen(SmsNotificationEvent::class, SmsNotificationListener::class);
        }
    }
}