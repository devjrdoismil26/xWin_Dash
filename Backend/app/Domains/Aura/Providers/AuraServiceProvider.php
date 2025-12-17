<?php

namespace App\Domains\Aura\Providers;

use App\Domains\Aura\Contracts\WhatsAppServiceInterface;
use App\Domains\Aura\Infrastructure\Services\MetaWhatsAppService;
use Illuminate\Support\ServiceProvider;

class AuraServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            WhatsAppServiceInterface::class,
            MetaWhatsAppService::class,
        );

        // Register all Aura repositories (from AuraDomainServiceProvider)
        $this->app->bind(
            \App\Domains\Aura\Domain\AuraChatRepositoryInterface::class,
            \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraChatRepository::class,
        );

        $this->app->bind(
            \App\Domains\Aura\Domain\AuraConnectionRepositoryInterface::class,
            \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraConnectionRepository::class,
        );

        $this->app->bind(
            \App\Domains\Aura\Domain\AuraFlowRepositoryInterface::class,
            \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowRepository::class,
        );

        $this->app->bind(
            \App\Domains\Aura\Domain\AuraFlowNodeRepositoryInterface::class,
            \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowNodeRepository::class,
        );

        $this->app->bind(
            \App\Domains\Aura\Domain\AuraMessageRepositoryInterface::class,
            \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraMessageRepository::class,
        );

        $this->app->bind(
            \App\Domains\Aura\Domain\AuraStatsRepositoryInterface::class,
            \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraStatsRepository::class,
        );

        $this->app->bind(
            \App\Domains\Aura\Domain\AuraTemplateRepositoryInterface::class,
            \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraTemplateRepository::class,
        );

        $this->app->bind(
            \App\Domains\Aura\Domain\AuraUraSessionRepositoryInterface::class,
            \App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraUraSessionRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Load routes if they exist (from AuraDomainServiceProvider)
        $routesPath = __DIR__ . '/../Http/routes.php';
        if (file_exists($routesPath)) {
            $this->loadRoutesFrom($routesPath);
        }
        // As rotas do Aura também estão definidas no routes/api.php para evitar duplicação
    }
}
