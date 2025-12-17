<?php

namespace App\Domains\Products\Events;

use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel as Product;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductUpdated
{
    use Dispatchable;
    use SerializesModels;

    public Product $product;

    /**
     * Create a new event instance.
     */
    public function __construct(Product $product)
    {
        $this->product = $product;
    }
}
