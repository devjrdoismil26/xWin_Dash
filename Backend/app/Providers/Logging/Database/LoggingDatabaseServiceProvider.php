<?php

namespace App\Providers\Logging\Database;

use Illuminate\Support\ServiceProvider;

/**
 * 🗄️ Logging Database Service Provider
 * 
 * Registra serviços de logging em banco de dados
 */
class LoggingDatabaseServiceProvider extends ServiceProvider
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
            \App\Services\Logging\Database\DatabaseLogService::class,
            \App\Services\Logging\Database\LogTableService::class,
            \App\Services\Logging\Database\LogCleanupService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para database log service
        $this->app->bind(\App\Services\Logging\Database\DatabaseLogService::class, function ($app) {
            return new \App\Services\Logging\Database\DatabaseLogService();
        });

        // Binding para log table service
        $this->app->bind(\App\Services\Logging\Database\LogTableService::class, function ($app) {
            return new \App\Services\Logging\Database\LogTableService();
        });

        // Binding para log cleanup service
        $this->app->bind(\App\Services\Logging\Database\LogCleanupService::class, function ($app) {
            return new \App\Services\Logging\Database\LogCleanupService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('logging.database.enabled', true)) {
            // Registrar listeners de eventos de banco
            // Event::listen(DatabaseLoggingEvent::class, DatabaseLoggingListener::class);
        }
    }
}