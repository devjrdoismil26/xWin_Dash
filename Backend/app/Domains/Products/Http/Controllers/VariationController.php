<?php

namespace App\Domains\Products\Http\Controllers;

use App\Domains\Products\Application\Actions\UpdateInventoryAction;
use App\Domains\Products\Application\DTOs\InventoryDTO;
use App\Domains\Products\Application\Services\InventoryManagementService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VariationController extends Controller
{
    public function __construct(
        private UpdateInventoryAction $updateInventoryAction,
        private InventoryManagementService $inventoryService
    ) {}

    public function updateStock(Request $request): JsonResponse
    {
        $request->validate([
            'variation_id' => 'required|string',
            'quantity' => 'required|integer',
            'operation' => 'required|in:add,subtract,set',
            'reason' => 'required|string',
        ]);

        $dto = new InventoryDTO(
            variation_id: $request->variation_id,
            quantity: $request->quantity,
            operation: $request->operation,
            reason: $request->reason
        );

        $this->updateInventoryAction->execute($dto);

        return response()->json([
            'success' => true,
            'message' => 'Stock updated successfully',
        ]);
    }

    public function checkAvailability(Request $request): JsonResponse
    {
        $request->validate([
            'variation_id' => 'required|string',
            'quantity' => 'required|integer',
        ]);

        $available = $this->inventoryService->checkAvailability(
            $request->variation_id,
            $request->quantity
        );

        return response()->json([
            'success' => true,
            'data' => ['available' => $available],
        ]);
    }
}
