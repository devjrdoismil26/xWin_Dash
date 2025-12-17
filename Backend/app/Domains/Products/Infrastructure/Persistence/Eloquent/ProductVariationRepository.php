<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent;

use App\Domains\Products\Domain\ProductVariation;
use App\Domains\Products\Domain\ProductVariationRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class ProductVariationRepository implements ProductVariationRepositoryInterface
{
    public function __construct(private readonly ProductVariationModel $model)
    {
    }

    public function find(string $id): ?ProductVariation
    {
        $model = $this->model->find($id);

        return $model ? $this->toDomain($model) : null;
    }

    public function findByProductId(string $productId): Collection
    {
        $models = $this->model->where('product_id', $productId)->get();

        return $models->map(fn (ProductVariationModel $model) => $this->toDomain($model));
    }

    public function create(array $data): ProductVariation
    {
        $model = $this->model->create($data);

        return $this->toDomain($model);
    }

    public function update(string $id, array $data): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }

        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }

        return $model->delete();
    }

    private function toDomain(ProductVariationModel $model): ProductVariation
    {
        return new ProductVariation(
            id: $model->id,
            productId: $model->product_id,
            name: $model->name,
            sku: $model->sku,
            price: $model->price,
            stock: $model->stock,
            attributes: $model->attributes,
            createdAt: $model->created_at ? DateTimeImmutable::createFromMutable($model->created_at) : null,
            updatedAt: $model->updated_at ? DateTimeImmutable::createFromMutable($model->updated_at) : null,
        );
    }
}
