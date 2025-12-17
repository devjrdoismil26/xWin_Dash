<?php

namespace App\Domains\SocialBuffer\Providers\Core;

use Illuminate\Support\ServiceProvider;

/**
 * 📱 Social Buffer Core Service Provider
 * 
 * Registra serviços core do Social Buffer
 */
class SocialBufferCoreServiceProvider extends ServiceProvider
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
            \App\Domains\SocialBuffer\Domain\PostRepositoryInterface::class,
            \App\Domains\SocialBuffer\Domain\ScheduleRepositoryInterface::class,
            \App\Domains\SocialBuffer\Contracts\PostServiceInterface::class,
            \App\Domains\SocialBuffer\Contracts\ScheduleServiceInterface::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para post repository
        $this->app->bind(
            \App\Domains\SocialBuffer\Domain\PostRepositoryInterface::class,
            \App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\PostRepository::class
        );

        // Binding para schedule repository
        $this->app->bind(
            \App\Domains\SocialBuffer\Domain\ScheduleRepositoryInterface::class,
            \App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\ScheduleRepository::class
        );

        // Binding para post service
        $this->app->bind(
            \App\Domains\SocialBuffer\Contracts\PostServiceInterface::class,
            \App\Domains\SocialBuffer\Services\PostService::class
        );

        // Binding para schedule service
        $this->app->bind(
            \App\Domains\SocialBuffer\Contracts\ScheduleServiceInterface::class,
            \App\Domains\SocialBuffer\Services\ScheduleService::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.social_buffer.enabled', true) && config('modules.social_buffer.core_enabled', true)) {
            // Registrar listeners de eventos core
            // Event::listen(SocialBufferCoreEvent::class, SocialBufferCoreListener::class);
        }
    }
}