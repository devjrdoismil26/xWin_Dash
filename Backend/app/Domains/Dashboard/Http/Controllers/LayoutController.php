<?php

namespace App\Domains\Dashboard\Http\Controllers;

use App\Domains\Dashboard\Application\Actions\UpdateLayoutAction;
use App\Domains\Dashboard\Application\DTOs\LayoutDTO;
use App\Domains\Dashboard\Application\Services\LayoutService;
use App\Domains\Dashboard\Models\DashboardWidget;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LayoutController extends Controller
{
    public function __construct(
        private readonly LayoutService $layoutService,
        private readonly UpdateLayoutAction $updateLayoutAction
    ) {
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function show(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $userId = $request->user()->id;
        $layout = $this->layoutService->getLayoutByUserId($userId);

        return response()->json($layout ?? ['layout' => [], 'widgets' => []]);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', DashboardWidget::class);
        
        $validated = $request->validate([
            'layout' => 'required|array',
            'widgets' => 'required|array',
        ]);

        $dto = LayoutDTO::fromArray([
            'user_id' => $request->user()->id,
            'layout' => $validated['layout'],
            'widgets' => $validated['widgets'],
        ]);

        $layout = $this->updateLayoutAction->execute($dto);

        return response()->json($layout, 201);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function update(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('update', DashboardWidget::class);
        
        $validated = $request->validate([
            'layout' => 'sometimes|array',
            'widgets' => 'sometimes|array',
        ]);

        $dto = LayoutDTO::fromArray([
            'user_id' => $request->user()->id,
            'layout' => $validated['layout'] ?? [],
            'widgets' => $validated['widgets'] ?? [],
        ]);

        $layout = $this->updateLayoutAction->execute($dto);

        return response()->json($layout);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function destroy(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('delete', DashboardWidget::class);
        
        $userId = $request->user()->id;
        $this->layoutService->resetLayout($userId);

        return response()->json(['message' => 'Layout reset successfully']);
    }
}
