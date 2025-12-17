<?php

namespace App\Domains\Products\Application\Actions;

use App\Domains\Products\Application\DTOs\InventoryDTO;
use App\Domains\Products\Application\Services\InventoryManagementService;
use Illuminate\Support\Facades\Log;

class UpdateInventoryAction
{
    public function __construct(
        private InventoryManagementService $inventoryService
    ) {}

    public function execute(InventoryDTO $dto): bool
    {
        $result = $this->inventoryService->updateStock($dto);

        if ($result) {
            Log::info("Inventory updated", [
                'variation_id' => $dto->variation_id,
                'operation' => $dto->operation,
                'quantity' => $dto->quantity,
                'reason' => $dto->reason,
            ]);
        }

        return $result;
    }
}
