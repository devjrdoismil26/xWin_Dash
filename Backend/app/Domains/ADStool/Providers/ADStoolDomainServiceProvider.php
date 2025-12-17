<?php

namespace App\Domains\ADStool\Providers;

use App\Domains\ADStool\Contracts\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\Domain\AccountRepositoryInterface;
use App\Domains\ADStool\Domain\CreativeRepositoryInterface;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\AccountRepository;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\ADSCampaignRepository;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\CreativeRepository;
use Illuminate\Support\ServiceProvider;

class ADStoolDomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(
            AccountRepositoryInterface::class,
            AccountRepository::class,
        );

        $this->app->bind(
            ADSCampaignRepositoryInterface::class,
            ADSCampaignRepository::class,
        );

        $this->app->bind(
            CreativeRepositoryInterface::class,
            CreativeRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    }
}
