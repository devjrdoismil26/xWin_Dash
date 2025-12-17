<?php

namespace App\Domains\ADStool\Providers;

use App\Domains\ADStool\Services\AdPlatformIntegrationService;
use App\Domains\ADStool\Integrations\FacebookAdsIntegrationService;
use App\Domains\ADStool\Integrations\GoogleAdsIntegrationService;
use Illuminate\Support\ServiceProvider;

class AdPlatformIntegrationServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(AdPlatformIntegrationService::class, function ($app) {
            $account = $app->make('request')->route('account');

            return match ($account->platform) {
                'google' => $app->make(GoogleAdsIntegrationService::class, ['account' => $account]),
                'facebook' => $app->make(FacebookAdsIntegrationService::class, ['account' => $account]),
                default => throw new \Exception('Unsupported ad platform'),
            };
        });
    }
}
