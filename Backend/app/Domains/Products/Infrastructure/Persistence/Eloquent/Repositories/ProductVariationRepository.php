<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domains\Products\Domain\ProductVariation;
use App\Domains\Products\Domain\ProductVariationRepositoryInterface;
use App\Domains\Products\Models\ProductVariation as ProductVariationModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductVariationRepository implements ProductVariationRepositoryInterface
{
    protected ProductVariationModel $model;

    public function __construct(ProductVariationModel $model)
    {
        $this->model = $model;
    }

    /**
     * Find a product variation by ID.
     */
    public function find(string $id): ?ProductVariation
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * Find a product variation by SKU.
     */
    public function findBySku(string $sku): ?ProductVariation
    {
        $model = $this->model->where('sku', $sku)->first();
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * Get all product variations for a product.
     */
    public function findByProduct(string $productId): Collection
    {
        $models = $this->model->where('product_id', $productId)
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get all product variations for a project.
     */
    public function findByProject(string $projectId): Collection
    {
        $models = $this->model->where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get active product variations.
     */
    public function findActive(): Collection
    {
        $models = $this->model->active()
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get product variations in stock.
     */
    public function findInStock(): Collection
    {
        $models = $this->model->inStock()
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get product variations out of stock.
     */
    public function findOutOfStock(): Collection
    {
        $models = $this->model->outOfStock()
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get the default variation for a product.
     */
    public function findDefaultByProduct(string $productId): ?ProductVariation
    {
        $model = $this->model->where('product_id', $productId)
            ->where('is_default', true)
            ->first();

        return $model ? $this->toDomain($model) : null;
    }

    /**
     * Create a new product variation.
     */
    public function create(array $data): ProductVariation
    {
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * Update a product variation.
     */
    public function update(string $id, array $data): ?ProductVariation
    {
        $model = $this->model->find($id);
        if (!$model) {
            return null;
        }

        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    /**
     * Delete a product variation.
     */
    public function delete(string $id): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }

        return $model->delete();
    }

    /**
     * Paginate product variations.
     */
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        // Apply filters
        if (isset($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }

        if (isset($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['stock_status'])) {
            switch ($filters['stock_status']) {
                case 'in_stock':
                    $query->where('stock_quantity', '>', 0);
                    break;
                case 'out_of_stock':
                    $query->where('stock_quantity', '<=', 0);
                    break;
                case 'low_stock':
                    $query->whereBetween('stock_quantity', [1, 10]);
                    break;
            }
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $paginatedModels = $query->paginate($perPage);

        // Transform to domain objects
        $paginatedModels->getCollection()->transform(fn($model) => $this->toDomain($model));

        return $paginatedModels;
    }

    /**
     * Get product variation statistics.
     */
    public function getStatistics(string $projectId = null): array
    {
        $query = $this->model->newQuery();

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $total = $query->count();
        $active = $query->clone()->where('status', 'active')->count();
        $inactive = $query->clone()->where('status', 'inactive')->count();
        $inStock = $query->clone()->where('stock_quantity', '>', 0)->count();
        $outOfStock = $query->clone()->where('stock_quantity', '<=', 0)->count();
        $lowStock = $query->clone()->whereBetween('stock_quantity', [1, 10])->count();

        return [
            'total_variations' => $total,
            'active_variations' => $active,
            'inactive_variations' => $inactive,
            'in_stock_variations' => $inStock,
            'out_of_stock_variations' => $outOfStock,
            'low_stock_variations' => $lowStock,
        ];
    }

    /**
     * Convert Eloquent model to domain object.
     */
    protected function toDomain(ProductVariationModel $model): ProductVariation
    {
        return ProductVariation::fromArray($model->toArray());
    }
}