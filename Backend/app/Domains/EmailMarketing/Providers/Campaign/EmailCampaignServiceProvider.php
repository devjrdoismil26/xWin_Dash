<?php

namespace App\Domains\EmailMarketing\Providers\Campaign;

use Illuminate\Support\ServiceProvider;

/**
 * 📧 Email Campaign Service Provider
 * 
 * Registra serviços de gerenciamento de campanhas de email
 */
class EmailCampaignServiceProvider extends ServiceProvider
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
            \App\Domains\EmailMarketing\Contracts\EmailCampaignRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailCampaignMetricRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailCampaignSegmentRepositoryInterface::class,
            \App\Domains\EmailMarketing\Contracts\EmailAutomationRepositoryInterface::class,
        ];
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        // Binding para campaign repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailCampaignRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignRepository::class
        );

        // Binding para campaign metric repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailCampaignMetricRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignMetricRepository::class
        );

        // Binding para campaign segment repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailCampaignSegmentRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignSegmentRepository::class
        );

        // Binding para automation repository
        $this->app->bind(
            \App\Domains\EmailMarketing\Contracts\EmailAutomationRepositoryInterface::class,
            \App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailAutomationRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Carregamento condicional baseado em configuração
        if (config('modules.email_marketing.enabled', true) && config('modules.email_marketing.campaigns_enabled', true)) {
            // Registrar listeners de eventos de campanhas
            // Event::listen(EmailCampaignEvent::class, EmailCampaignListener::class);
        }
    }
}