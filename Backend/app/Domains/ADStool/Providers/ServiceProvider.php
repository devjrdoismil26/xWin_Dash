<?php

namespace App\Domains\ADStool\Providers;

use App\Domains\ADStool\Contracts\AdPlatformIntegrationInterface;
use App\Domains\ADStool\Contracts\ADSCampaignRepositoryInterface;
use App\Domains\ADStool\Contracts\AdsPlatformService as AdsPlatformServiceInterface;
use App\Domains\ADStool\Contracts\CampaignServiceInterface;
use App\Domains\ADStool\Domain\AccountRepositoryInterface;
use App\Domains\ADStool\Domain\CreativeRepositoryInterface;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\AccountRepository;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\ADSCampaignRepository;
use App\Domains\ADStool\Infrastructure\Persistence\Eloquent\CreativeRepository;
use App\Domains\ADStool\Services\AdPlatformIntegrationService;
use App\Domains\ADStool\Services\AdPlatformService;
use App\Domains\ADStool\Services\CampaignService;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ServiceProvider extends BaseServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(ADSCampaignRepositoryInterface::class, ADSCampaignRepository::class);
        $this->app->bind(CampaignServiceInterface::class, CampaignService::class);
        $this->app->bind(AdPlatformIntegrationInterface::class, AdPlatformIntegrationService::class);
        $this->app->bind(AdsPlatformServiceInterface::class, AdPlatformService::class);
        $this->app->bind(AccountRepositoryInterface::class, AccountRepository::class);
        $this->app->bind(CreativeRepositoryInterface::class, CreativeRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Http/routes.php');
    }
}
