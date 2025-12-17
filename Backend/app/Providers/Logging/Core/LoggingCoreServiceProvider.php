<?php

namespace App\Providers\Logging\Core;

use Illuminate\Support\ServiceProvider;

/**
 * 📝 Logging Core Service Provider
 * 
 * Registra serviços core de logging
 */
class LoggingCoreServiceProvider extends ServiceProvider
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
            \App\Services\Logging\LogManager::class,
            \App\Services\Logging\LogFormatter::class,
            \App\Services\Logging\LogLevelService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para log manager
        $this->app->bind(\App\Services\Logging\LogManager::class, function ($app) {
            return new \App\Services\Logging\LogManager();
        });

        // Binding para log formatter
        $this->app->bind(\App\Services\Logging\LogFormatter::class, function ($app) {
            return new \App\Services\Logging\LogFormatter();
        });

        // Binding para log level service
        $this->app->bind(\App\Services\Logging\LogLevelService::class, function ($app) {
            return new \App\Services\Logging\LogLevelService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('logging.core.enabled', true)) {
            // Registrar listeners de eventos core
            // Event::listen(LoggingCoreEvent::class, LoggingCoreListener::class);
        }
    }
}