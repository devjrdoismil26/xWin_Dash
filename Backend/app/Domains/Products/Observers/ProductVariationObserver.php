<?php

namespace App\Domains\Products\Observers;

use App\Domains\Products\Events\ProductVariationCreated;
use App\Domains\Products\Events\ProductVariationDeleted;
use App\Domains\Products\Events\ProductVariationUpdated;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductVariationModel as ProductVariation;

class ProductVariationObserver
{
    /**
     * Handle the ProductVariation "created" event.
     */
    public function created(ProductVariation $productVariation): void
    {
        event(new ProductVariationCreated($productVariation));
    }

    /**
     * Handle the ProductVariation "updated" event.
     */
    public function updated(ProductVariation $productVariation): void
    {
        event(new ProductVariationUpdated($productVariation));
    }

    /**
     * Handle the ProductVariation "deleted" event.
     */
    public function deleted(ProductVariation $productVariation): void
    {
        event(new ProductVariationDeleted($productVariation));
    }
}
