<?php

namespace App\Domains\Products\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $total_products
 * @property int $active_products
 * @property int $inactive_products
 * @property int $products_this_month
 */
class ProductStatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_products' => $this->total_products,
            'active_products' => $this->active_products,
            'inactive_products' => $this->inactive_products,
            'products_this_month' => $this->products_this_month,
        ];
    }
}
