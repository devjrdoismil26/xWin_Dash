<?php

namespace App\Providers\Integrations\Communication;

use Illuminate\Support\ServiceProvider;
use App\Services\RateLimiterService;
use App\Services\CircuitBreakerService;
use App\Services\RetryService;

/**
 * 💬 Communication Integration Service Provider
 * 
 * Registra serviços de integração com plataformas de comunicação
 */
class CommunicationIntegrationServiceProvider extends ServiceProvider
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
            \App\Domains\Aura\Services\WhatsAppTemplateService::class,
            \App\Domains\Aura\Services\WhatsAppInteractiveService::class,
            \App\Services\Communication\TelegramService::class,
            \App\Services\Communication\EmailService::class,
            \App\Services\Communication\SmsService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // WhatsApp Services
        $this->app->bind(\App\Domains\Aura\Services\WhatsAppTemplateService::class, function ($app) {
            return new \App\Domains\Aura\Services\WhatsAppTemplateService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        $this->app->bind(\App\Domains\Aura\Services\WhatsAppInteractiveService::class, function ($app) {
            return new \App\Domains\Aura\Services\WhatsAppInteractiveService(
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Telegram Service
        $this->app->bind(\App\Services\Communication\TelegramService::class, function ($app) {
            return new \App\Services\Communication\TelegramService(
                config('services.telegram.bot_token'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // Email Service
        $this->app->bind(\App\Services\Communication\EmailService::class, function ($app) {
            return new \App\Services\Communication\EmailService(
                config('mail.mailers.smtp.host'),
                config('mail.mailers.smtp.port'),
                config('mail.mailers.smtp.username'),
                config('mail.mailers.smtp.password'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });

        // SMS Service
        $this->app->bind(\App\Services\Communication\SmsService::class, function ($app) {
            return new \App\Services\Communication\SmsService(
                config('services.sms.provider'),
                config('services.sms.api_key'),
                $app->make(RateLimiterService::class),
                $app->make(CircuitBreakerService::class),
                $app->make(RetryService::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('integrations.communication.enabled', true)) {
            // Registrar listeners de eventos específicos de comunicação
            // Event::listen(CommunicationEvent::class, CommunicationListener::class);
        }
    }
}