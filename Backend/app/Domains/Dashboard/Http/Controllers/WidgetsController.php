<?php

namespace App\Domains\Dashboard\Http\Controllers;

use App\Domains\Dashboard\Application\Actions\CreateWidgetAction;
use App\Domains\Dashboard\Application\DTOs\WidgetDTO;
use App\Domains\Dashboard\Application\Services\WidgetService;
use App\Domains\Dashboard\Models\DashboardWidget;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WidgetsController extends Controller
{
    public function __construct(
        private readonly WidgetService $widgetService,
        private readonly CreateWidgetAction $createWidgetAction
    ) {
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function index(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $widgets = $this->widgetService->getAllWidgets();
        return response()->json($widgets);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('createWidget', DashboardWidget::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'config' => 'required|array',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $dto = WidgetDTO::fromArray($validated);
        $widget = $this->createWidgetAction->execute($dto);

        return response()->json($widget, 201);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function show(string $id): JsonResponse
    {
        // SECURITY: Verificar autorização
        $widget = DashboardWidget::findOrFail($id);
        $this->authorize('view', $widget);
        
        $widgetData = $this->widgetService->getWidgetById($id);
        
        if (!$widgetData) {
            return response()->json(['message' => 'Widget not found'], 404);
        }

        return response()->json($widgetData);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // SECURITY: Verificar autorização
        $widget = DashboardWidget::findOrFail($id);
        $this->authorize('updateWidget', $widget);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:100',
            'config' => 'sometimes|array',
            'order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $dto = WidgetDTO::fromArray(array_merge(['id' => $id], $validated));
        $this->widgetService->updateWidget($id, $dto);

        return response()->json(['message' => 'Widget updated successfully']);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function destroy(string $id): JsonResponse
    {
        // SECURITY: Verificar autorização
        $widget = DashboardWidget::findOrFail($id);
        $this->authorize('deleteWidget', $widget);
        
        $this->widgetService->deleteWidget($id);
        return response()->json(['message' => 'Widget deleted successfully']);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function reorder(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('update', DashboardWidget::class);
        
        $validated = $request->validate([
            'widget_ids' => 'required|array',
            'widget_ids.*' => 'required|string|exists:widgets,id',
        ]);

        $this->widgetService->reorderWidgets($validated['widget_ids']);
        return response()->json(['message' => 'Widgets reordered successfully']);
    }
}
