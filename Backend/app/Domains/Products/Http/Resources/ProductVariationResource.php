<?php

namespace App\Domains\Products\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name,
            'description' => $this->description,
            'sku' => $this->sku,
            'price' => $this->price,
            'formatted_price' => $this->formatted_price,
            'compare_price' => $this->compare_price,
            'formatted_compare_price' => $this->formatted_compare_price,
            'cost_price' => $this->cost_price,
            'stock_quantity' => $this->stock_quantity,
            'track_inventory' => $this->track_inventory,
            'status' => $this->status,
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'images' => $this->images,
            'attributes' => $this->attributes,
            'variation_options' => $this->variation_options,
            'is_default' => $this->is_default,
            'sort_order' => $this->sort_order,
            'is_in_stock' => $this->is_in_stock,
            'stock_status' => $this->stock_status,
            'project_id' => $this->project_id,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,

            // Relationships
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'sku' => $this->product->sku,
                ];
            }),
            'project' => $this->whenLoaded('project', function () {
                return [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                ];
            }),
            'created_by_user' => $this->whenLoaded('createdBy', function () {
                return [
                    'id' => $this->createdBy->id,
                    'name' => $this->createdBy->name,
                    'email' => $this->createdBy->email,
                ];
            }),

            // Computed fields
            'price_difference' => $this->when($this->compare_price, function () {
                return $this->compare_price - $this->price;
            }),
            'discount_percentage' => $this->when($this->compare_price, function () {
                if ($this->compare_price > $this->price) {
                    return round((($this->compare_price - $this->price) / $this->compare_price) * 100, 2);
                }
                return 0;
            }),
            'total_weight' => $this->when($this->weight && $this->dimensions, function () {
                return [
                    'weight' => $this->weight,
                    'dimensions' => $this->dimensions,
                    'volume' => $this->dimensions['width'] * $this->dimensions['height'] * $this->dimensions['depth'] ?? null,
                ];
            }),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString(),
            ],
        ];
    }
}