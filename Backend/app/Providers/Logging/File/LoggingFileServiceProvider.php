<?php

namespace App\Providers\Logging\File;

use Illuminate\Support\ServiceProvider;

/**
 * 📁 Logging File Service Provider
 * 
 * Registra serviços de logging em arquivo
 */
class LoggingFileServiceProvider extends ServiceProvider
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
            \App\Services\Logging\File\FileLogService::class,
            \App\Services\Logging\File\FileRotationService::class,
            \App\Services\Logging\File\FileCompressionService::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para file log service
        $this->app->bind(\App\Services\Logging\File\FileLogService::class, function ($app) {
            return new \App\Services\Logging\File\FileLogService();
        });

        // Binding para file rotation service
        $this->app->bind(\App\Services\Logging\File\FileRotationService::class, function ($app) {
            return new \App\Services\Logging\File\FileRotationService();
        });

        // Binding para file compression service
        $this->app->bind(\App\Services\Logging\File\FileCompressionService::class, function ($app) {
            return new \App\Services\Logging\File\FileCompressionService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('logging.file.enabled', true)) {
            // Registrar listeners de eventos de arquivo
            // Event::listen(FileLoggingEvent::class, FileLoggingListener::class);
        }
    }
}