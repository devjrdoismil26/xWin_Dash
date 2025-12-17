<?php

namespace App\Domains\EmailMarketing\Providers\Template;

use Illuminate\Support\ServiceProvider;

/**
 * 📝 Email Template Service Provider
 * 
 * Registra serviços de gerenciamento de templates de email
 */
class EmailTemplateServiceProvider extends ServiceProvider
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
            \App\Domains\EmailMarketing\Contracts\EmailTemplateRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailListRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailListSubscriberRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailSegmentRepositoryInterface::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para template repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailTemplateRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailTemplateRepository::class
        );

        // Binding para list repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailListRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListRepository::class
        );

        // Binding para list subscriber repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailListSubscriberRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListSubscriberRepository::class
        );

        // Binding para segment repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailSegmentRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSegmentRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.email_marketing.enabled', true) && config('modules.email_marketing.templates_enabled', true)) {
            // Registrar listeners de eventos de templates
            // Event::listen(EmailTemplateEvent::class, EmailTemplateListener::class);
        }
    }
}