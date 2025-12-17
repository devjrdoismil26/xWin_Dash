<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent;

use App\Domains\Products\Domain\Product;
use App\Domains\Products\Domain\ProductRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Support\Collection;

class ProductRepository implements ProductRepositoryInterface
{
    public function __construct(private readonly ProductModel $model)
    {
    }

    public function find(string $id): ?Product
    {
        $model = $this->model->find($id);

        return $model ? $this->toDomain($model) : null;
    }

    public function findByProjectId(string $projectId): Collection
    {
        $models = $this->model->where('project_id', $projectId)->get();

        return $models->map(fn (ProductModel $model) => $this->toDomain($model));
    }

    public function create(array $data): Product
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

    private function toDomain(ProductModel $model): Product
    {
        return new Product(
            name: $model->name,
            price: $model->price,
            projectId: $model->project_id,
            status: $model->status,
            description: $model->description,
            stock: $model->stock,
            sku: $model->sku,
            imageUrl: $model->image_url,
            categoryId: $model->category_id,
            tags: $model->tags,
            weight: $model->weight,
            dimensions: $model->dimensions,
            userId: $model->user_id ?? null,
            id: $model->id,
            createdAt: $model->created_at ? new \DateTime($model->created_at->toDateTimeString()) : null,
            updatedAt: $model->updated_at ? new \DateTime($model->updated_at->toDateTimeString()) : null
        );
    }
}
