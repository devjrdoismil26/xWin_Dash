<?php

namespace App\Domains\Dashboard\Application\Services;

use Illuminate\Support\Facades\Broadcast;

class RealTimeService
{
    public function broadcastMetricUpdate(string $userId, string $metricName, $value): void
    {
        Broadcast::channel("dashboard.{$userId}", [
            'event' => 'metric.updated',
            'metric' => $metricName,
            'value' => $value,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    public function broadcastWidgetUpdate(string $userId, string $widgetId, array $data): void
    {
        Broadcast::channel("dashboard.{$userId}", [
            'event' => 'widget.updated',
            'widget_id' => $widgetId,
            'data' => $data,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    public function broadcastLayoutUpdate(string $userId, array $layout): void
    {
        Broadcast::channel("dashboard.{$userId}", [
            'event' => 'layout.updated',
            'layout' => $layout,
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
