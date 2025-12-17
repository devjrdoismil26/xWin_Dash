<?php

namespace App\Domains\ADStool\Providers;

use App\Application\ADStool\Listeners\SyncCampaignToExternalPlatformListener;
use App\Domains\ADStool\Events\CampaignBudgetAlert;
use App\Domains\ADStool\Events\CampaignPerformanceUpdated;
use App\Domains\ADStool\Listeners\SendCampaignBudgetAlertNotification;
use App\Domains\ADStool\Listeners\SendCampaignPerformanceUpdatedNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        \App\Domains\ADStool\Events\CampaignCreated::class => [
            SyncCampaignToExternalPlatformListener::class,
        ],
        CampaignBudgetAlert::class => [
            SendCampaignBudgetAlertNotification::class,
        ],
        CampaignPerformanceUpdated::class => [
            SendCampaignPerformanceUpdatedNotification::class,
        ],
    ];

    public function boot(): void
    {
        parent::boot();
    }
}
