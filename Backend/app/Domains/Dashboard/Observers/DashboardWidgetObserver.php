<?php

namespace App\Domains\Dashboard\Observers;

use App\Domains\Dashboard\Events\DashboardWidgetCreated;
use App\Domains\Dashboard\Events\DashboardWidgetDeleted;
use App\Domains\Dashboard\Events\DashboardWidgetUpdated;
use App\Domains\Dashboard\Models\DashboardWidget;

class DashboardWidgetObserver
{
    /**
     * Handle the DashboardWidget "created" event.
     */
    public function created(DashboardWidget $dashboardWidget): void
    {
        event(new DashboardWidgetCreated($dashboardWidget));
    }

    /**
     * Handle the DashboardWidget "updated" event.
     */
    public function updated(DashboardWidget $dashboardWidget): void
    {
        event(new DashboardWidgetUpdated($dashboardWidget));
    }

    /**
     * Handle the DashboardWidget "deleted" event.
     */
    public function deleted(DashboardWidget $dashboardWidget): void
    {
        event(new DashboardWidgetDeleted($dashboardWidget));
    }
}
