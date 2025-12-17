<?php

namespace App\Providers\Notifications\Email;

use Illuminate\Support\ServiceProvider;

/**
 * 📧 Notification Email Service Provider
 * 
 * Registra serviços de notificação por email
 */
class NotificationEmailServiceProvider extends ServiceProvider
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
            \App\Services\Notifications\Email\EmailNotificationService::class,
            \App\Services\Notifications\Email\EmailTemplateService::class,
            \App\Services\Notifications\Email\EmailDeliveryService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para email notification service
        $this->app->bind(\App\Services\Notifications\Email\EmailNotificationService::class, function ($app) {
            return new \App\Services\Notifications\Email\EmailNotificationService();
        });

        // Binding para email template service
        $this->app->bind(\App\Services\Notifications\Email\EmailTemplateService::class, function ($app) {
            return new \App\Services\Notifications\Email\EmailTemplateService();
        });

        // Binding para email delivery service
        $this->app->bind(\App\Services\Notifications\Email\EmailDeliveryService::class, function ($app) {
            return new \App\Services\Notifications\Email\EmailDeliveryService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('notifications.email.enabled', true)) {
            // Registrar listeners de eventos de email
            // Event::listen(EmailNotificationEvent::class, EmailNotificationListener::class);
        }
    }
}