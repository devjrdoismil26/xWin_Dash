<?php

namespace App\Domains\Dashboard\Providers;

use App\Domains\Dashboard\Listeners\DashboardCacheListener;
use App\Domains\Leads\Events\LeadCreated;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            DashboardCacheListener::class,
        ],
        LeadCreated::class => [
            DashboardCacheListener::class,
        ],
    ];

    public function boot(): void
    {
        \App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardWidgetModel::observe(\App\Domains\Dashboard\Observers\DashboardWidgetObserver::class);
    }
}
