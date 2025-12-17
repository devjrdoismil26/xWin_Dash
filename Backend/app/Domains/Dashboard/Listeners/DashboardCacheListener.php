<?php

namespace App\Domains\Dashboard\Listeners;

use App\Domains\Dashboard\Events\DashboardUpdated;
use Illuminate\Support\Facades\Cache;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

/**
 * Dashboard Cache Listener
 * 
 * Listens to dashboard events and manages cache invalidation.
 */
class DashboardCacheListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the dashboard updated event.
     * 
     * @param DashboardUpdated $event
     * @return void
     */
    public function handle(DashboardUpdated $event): void
    {
        $dashboardId = $event->dashboard->id;
        
        // Invalidate dashboard cache
        Cache::forget("dashboard.{$dashboardId}");
        Cache::forget("dashboard.{$dashboardId}.widgets");
        Cache::forget("dashboard.{$dashboardId}.metrics");
        
        // Invalidate user dashboard list cache
        if ($event->dashboard->user_id) {
            Cache::forget("user.{$event->dashboard->user_id}.dashboards");
        }
    }
}
