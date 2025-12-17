<?php

namespace App\Domains\Products\Events;

use App\Domains\Products\Models\ProductVariation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductVariationCreated
{
    use Dispatchable;
    use SerializesModels;

    public ProductVariation $productVariation;

    /**
     * Create a new event instance.
     */
    public function __construct(ProductVariation $productVariation)
    {
        $this->productVariation = $productVariation;
    }
}
