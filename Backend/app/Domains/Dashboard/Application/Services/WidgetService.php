<?php

namespace App\Domains\Dashboard\Application\Services;

use App\Domains\Dashboard\Application\DTOs\WidgetDTO;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\WidgetModel as Widget;
use Illuminate\Support\Collection;

class WidgetService
{
    public function getAllWidgets(): Collection
    {
        return Widget::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function getWidgetById(string $id): ?Widget
    {
        return Widget::find($id);
    }

    public function createWidget(WidgetDTO $dto): Widget
    {
        return Widget::create($dto->toArray());
    }

    public function updateWidget(string $id, WidgetDTO $dto): bool
    {
        $widget = Widget::findOrFail($id);
        return $widget->update($dto->toArray());
    }

    public function deleteWidget(string $id): bool
    {
        $widget = Widget::findOrFail($id);
        return $widget->delete();
    }

    public function reorderWidgets(array $widgetIds): bool
    {
        foreach ($widgetIds as $order => $widgetId) {
            Widget::where('id', $widgetId)->update(['order' => $order]);
        }
        return true;
    }

    public function toggleWidgetStatus(string $id): bool
    {
        $widget = Widget::findOrFail($id);
        $widget->is_active = !$widget->is_active;
        return $widget->save();
    }
}
