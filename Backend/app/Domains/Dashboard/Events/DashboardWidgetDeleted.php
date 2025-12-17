<?php

namespace App\Domains\Dashboard\Events;

use App\Domains\Dashboard\Models\DashboardWidget;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DashboardWidgetDeleted
{
    use Dispatchable;
    use SerializesModels;

    public DashboardWidget $widget;

    /**
     * Create a new event instance.
     */
    public function __construct(DashboardWidget $widget)
    {
        $this->widget = $widget;
    }
}
