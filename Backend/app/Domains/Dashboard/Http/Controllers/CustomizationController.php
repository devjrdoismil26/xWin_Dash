<?php

namespace App\Domains\Dashboard\Http\Controllers;

use App\Domains\Dashboard\Application\Actions\LoadDashboardAction;
use App\Domains\Dashboard\Application\Actions\SaveCustomizationAction;
use App\Domains\Dashboard\Application\DTOs\CustomizationDTO;
use App\Domains\Dashboard\Application\Services\CustomizationService;
use App\Domains\Dashboard\Models\DashboardWidget;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomizationController extends Controller
{
    public function __construct(
        private readonly CustomizationService $customizationService,
        private readonly SaveCustomizationAction $saveCustomizationAction,
        private readonly LoadDashboardAction $loadDashboardAction
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
        $config = $this->customizationService->getConfigByUserId($userId);

        return response()->json($config ?? ['preferences' => [], 'visible_widgets' => []]);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', DashboardWidget::class);
        
        $validated = $request->validate([
            'preferences' => 'required|array',
            'visible_widgets' => 'required|array',
        ]);

        $dto = CustomizationDTO::fromArray([
            'user_id' => $request->user()->id,
            'preferences' => $validated['preferences'],
            'visible_widgets' => $validated['visible_widgets'],
        ]);

        $config = $this->saveCustomizationAction->execute($dto);

        return response()->json($config, 201);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function update(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('update', DashboardWidget::class);
        
        $validated = $request->validate([
            'preferences' => 'sometimes|array',
            'visible_widgets' => 'sometimes|array',
        ]);

        $userId = $request->user()->id;

        if (isset($validated['preferences'])) {
            $this->customizationService->updatePreferences($userId, $validated['preferences']);
        }

        if (isset($validated['visible_widgets'])) {
            $this->customizationService->updateVisibleWidgets($userId, $validated['visible_widgets']);
        }

        $config = $this->customizationService->getConfigByUserId($userId);

        return response()->json($config);
    }

    /**
     * AUTH-PENDENTE-005: Adicionada autorização
     */
    public function load(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', DashboardWidget::class);
        
        $userId = $request->user()->id;
        $dashboard = $this->loadDashboardAction->execute($userId);

        return response()->json($dashboard);
    }
}
