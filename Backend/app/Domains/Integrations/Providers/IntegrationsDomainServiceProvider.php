<?php

namespace App\Domains\Integrations\Providers;

use App\Domains\Integrations\Domain\ApiCredentialRepositoryInterface;
use App\Domains\Integrations\Infrastructure\Persistence\Eloquent\ApiCredentialRepository;
use Illuminate\Support\ServiceProvider;

class IntegrationsDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            ApiCredentialRepositoryInterface::class,
            ApiCredentialRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
