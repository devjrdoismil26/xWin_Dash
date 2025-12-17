<?php

namespace App\Domains\EmailMarketing\Providers\Integration;

use Illuminate\Support\ServiceProvider;

/**
 * 🔗 Email Integration Service Provider
 * 
 * Registra serviços de integração externa do email marketing
 */
class EmailIntegrationServiceProvider extends ServiceProvider
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
            \App\Domains\EmailMarketing\Contracts\EmailSubscriberRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailUnsubscribeRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailLinkRepositoryInterface::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para subscriber repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailSubscriberRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSubscriberRepository::class
        );

        // Binding para unsubscribe repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailUnsubscribeRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailUnsubscribeRepository::class
        );

        // Binding para link repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailLinkRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailLinkRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.email_marketing.enabled', true) && config('modules.email_marketing.integrations_enabled', true)) {
            // Carregar rotas apenas se necessário
            if (config('modules.email_marketing.load_routes', true)) {
                $this->loadRoutesFrom(__DIR__ . '/../../Http/routes.php');
            }

            // Registrar listeners de eventos de integração
            // Event::listen(EmailIntegrationEvent::class, EmailIntegrationListener::class);
        }
    }
}