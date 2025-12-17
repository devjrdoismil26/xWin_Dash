<?php

namespace App\Providers\Logging\External;

use Illuminate\Support\ServiceProvider;

/**
 * 🌐 Logging External Service Provider
 * 
 * Registra serviços de logging externo
 */
class LoggingExternalServiceProvider extends ServiceProvider
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
            \App\Services\Logging\External\ExternalLogService::class,
            \App\Services\Logging\External\WebhookLogService::class,
            \App\Services\Logging\External\ApiLogService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para external log service
        $this->app->bind(\App\Services\Logging\External\ExternalLogService::class, function ($app) {
            return new \App\Services\Logging\External\ExternalLogService();
        });

        // Binding para webhook log service
        $this->app->bind(\App\Services\Logging\External\WebhookLogService::class, function ($app) {
            return new \App\Services\Logging\External\WebhookLogService();
        });

        // Binding para API log service
        $this->app->bind(\App\Services\Logging\External\ApiLogService::class, function ($app) {
            return new \App\Services\Logging\External\ApiLogService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('logging.external.enabled', true)) {
            // Registrar listeners de eventos externos
            // Event::listen(ExternalLoggingEvent::class, ExternalLoggingListener::class);
        }
    }
}