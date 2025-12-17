<?php

namespace App\Domains\Products\Application\Services;

use App\Domains\Products\Application\DTOs\InventoryDTO;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InventoryManagementService
{
    public function updateStock(InventoryDTO $dto): bool
    {
        $variation = DB::table('product_variations')->find($dto->variation_id);
        
        if (!$variation) {
            return false;
        }

        $newStock = match($dto->operation) {
            'add' => $variation->stock + $dto->quantity,
            'subtract' => $variation->stock - $dto->quantity,
            'set' => $dto->quantity,
            default => $variation->stock
        };

        return DB::table('product_variations')
            ->where('id', $dto->variation_id)
            ->update(['stock' => max(0, $newStock), 'updated_at' => now()]);
    }

    public function checkAvailability(string $variationId, int $quantity): bool
    {
        $variation = DB::table('product_variations')->find($variationId);
        return $variation && $variation->stock >= $quantity;
    }

    public function getLowStock(int $threshold = 10): Collection
    {
        return DB::table('product_variations')
            ->where('stock', '<=', $threshold)
            ->get();
    }
}
