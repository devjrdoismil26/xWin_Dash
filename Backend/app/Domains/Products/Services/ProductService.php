<?php

namespace App\Domains\Products\Services;

use App\Domains\Products\Models\Product;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use Illuminate\Support\Facades\Log as LoggerFacade;

class ProductService
{
    public function createProduct(Project $project, array $data): Product
    {
        try {
            $product = $project->products()->create($data);
            LoggerFacade::info('Product created', ['product_id' => $product->id, 'project_id' => $project->id]);
            event(new \App\Domains\Products\Events\ProductCreated($product));

            return $product;
        } catch (\Exception $e) {
            LoggerFacade::error('Error creating product', ['project_id' => $project
                ->id, 'data' => $data, 'error' => $e->getMessage()]);
            throw new \Exception('Failed to create product.', 0, $e);
        }
    }

    public function updateProduct(Product $product, array $data): Product
    {
        try {
            $product->update($data);
            LoggerFacade::info('Product updated', ['product_id' => $product->id]);
            event(new \App\Domains\Products\Events\ProductUpdated($product));

            return $product;
        } catch (\Exception $e) {
            LoggerFacade::error('Error updating product', ['product_id' => $product
                ->id, 'data' => $data, 'error' => $e->getMessage()]);
            throw new \Exception('Failed to update product.', 0, $e);
        }
    }

    public function deleteProduct(Product $product): bool
    {
        try {
            LoggerFacade::info('Product deleted', ['product_id' => $product->id]);
            $result = $product->delete();
            if ($result) {
                event(new \App\Domains\Products\Events\ProductDeleted($product));
            }

            return $result;
        } catch (\Exception $e) {
            LoggerFacade::error('Error deleting product', ['product_id' => $product->id, 'error' => $e->getMessage()]);
            throw new \Exception('Failed to delete product.', 0, $e);
        }
    }

    /**
     * Toggle the status of a product.
     *
     * @param \App\Domains\Products\Models\Product $product
     *
     * @return \App\Domains\Products\Models\Product
     */
    public function toggleProductStatus(Product $product): Product
    {
        if ($product->status === 'active') {
            $product->status = 'inactive';
        } else {
            $product->status = 'active';
        }
        $product->save();

        LoggerFacade::info('Product status toggled', ['product_id' => $product->id, 'new_status' => $product->status]);

        return $product;
    }

    /**
     * Get product statistics for a project.
     *
     * @param \App\Domains\Projects\Models\Project $project
     *
     * @return array
     */
    public function getProductStatistics(Project $project): array
    {
        $totalProducts = $project->products()->count();
        $activeProducts = $project->products()->where('status', 'active')->count();
        $inactiveProducts = $project->products()->where('status', 'inactive')->count();
        $productsThisMonth = $project->products()->whereMonth('created_at', now()->month)->count();

        return [
            'total_products' => $totalProducts,
            'active_products' => $activeProducts,
            'inactive_products' => $inactiveProducts,
            'products_this_month' => $productsThisMonth,
        ];
    }

    /**
     * Create a product variation.
     *
     * @param Product $product
     * @param array $data
     * @return \App\Domains\Products\Models\ProductVariation
     */
    public function createProductVariation(Product $product, array $data): \App\Domains\Products\Models\ProductVariation
    {
        try {
            $data['product_id'] = $product->id;
            $data['project_id'] = $product->project_id;
            $data['created_by'] = $product->created_by;

            $variation = \App\Domains\Products\Models\ProductVariation::create($data);
            
            LoggerFacade::info('Product variation created', [
                'variation_id' => $variation->id,
                'product_id' => $product->id
            ]);

            event(new \App\Domains\Products\Events\ProductVariationCreated($variation));

            return $variation;
        } catch (\Exception $e) {
            LoggerFacade::error('Error creating product variation', [
                'product_id' => $product->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to create product variation.', 0, $e);
        }
    }

    /**
     * Update a product variation.
     *
     * @param \App\Domains\Products\Models\ProductVariation $variation
     * @param array $data
     * @return \App\Domains\Products\Models\ProductVariation
     */
    public function updateProductVariation(\App\Domains\Products\Models\ProductVariation $variation, array $data): \App\Domains\Products\Models\ProductVariation
    {
        try {
            $variation->update($data);
            
            LoggerFacade::info('Product variation updated', [
                'variation_id' => $variation->id
            ]);

            event(new \App\Domains\Products\Events\ProductVariationUpdated($variation));

            return $variation;
        } catch (\Exception $e) {
            LoggerFacade::error('Error updating product variation', [
                'variation_id' => $variation->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to update product variation.', 0, $e);
        }
    }

    /**
     * Delete a product variation.
     *
     * @param \App\Domains\Products\Models\ProductVariation $variation
     * @return bool
     */
    public function deleteProductVariation(\App\Domains\Products\Models\ProductVariation $variation): bool
    {
        try {
            LoggerFacade::info('Product variation deleted', [
                'variation_id' => $variation->id
            ]);

            $result = $variation->delete();
            
            if ($result) {
                event(new \App\Domains\Products\Events\ProductVariationDeleted($variation));
            }

            return $result;
        } catch (\Exception $e) {
            LoggerFacade::error('Error deleting product variation', [
                'variation_id' => $variation->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to delete product variation.', 0, $e);
        }
    }

    /**
     * Set a variation as default for a product.
     *
     * @param \App\Domains\Products\Models\ProductVariation $variation
     * @return bool
     */
    public function setDefaultVariation(\App\Domains\Products\Models\ProductVariation $variation): bool
    {
        try {
            $variation->setAsDefault();
            
            LoggerFacade::info('Product variation set as default', [
                'variation_id' => $variation->id,
                'product_id' => $variation->product_id
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error setting default variation', [
                'variation_id' => $variation->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to set default variation.', 0, $e);
        }
    }

    /**
     * Update stock for a product variation.
     *
     * @param \App\Domains\Products\Models\ProductVariation $variation
     * @param int $quantity
     * @param string $operation 'increase' or 'decrease'
     * @return bool
     */
    public function updateVariationStock(\App\Domains\Products\Models\ProductVariation $variation, int $quantity, string $operation = 'increase'): bool
    {
        try {
            if ($operation === 'increase') {
                $result = $variation->increaseStock($quantity);
            } else {
                $result = $variation->decreaseStock($quantity);
            }

            if ($result) {
                LoggerFacade::info('Product variation stock updated', [
                    'variation_id' => $variation->id,
                    'operation' => $operation,
                    'quantity' => $quantity,
                    'new_stock' => $variation->stock_quantity
                ]);
            }

            return $result;
        } catch (\Exception $e) {
            LoggerFacade::error('Error updating variation stock', [
                'variation_id' => $variation->id,
                'operation' => $operation,
                'quantity' => $quantity,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to update variation stock.', 0, $e);
        }
    }
}
