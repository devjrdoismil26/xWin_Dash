<?php

namespace App\Domains\ADStool\Providers;

use App\Domains\ADStool\Contracts\AdsPlatformService;
use App\Domains\ADStool\Services\ExternalApi\FacebookAdsService;
use App\Domains\ADStool\Services\ExternalApi\GoogleAdsService;
use Illuminate\Support\ServiceProvider;

class ADStoolServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(GoogleAdsService::class, function ($app) {
            return new GoogleAdsService(config('services.google_ads'));
        });

        $this->app->bind(FacebookAdsService::class, function ($app) {
            return new FacebookAdsService(config('services.facebook_ads'));
        });

        $this->app->tag([GoogleAdsService::class, FacebookAdsService::class], AdsPlatformService::class);
    }

    public function boot(): void
    {
    }
}
