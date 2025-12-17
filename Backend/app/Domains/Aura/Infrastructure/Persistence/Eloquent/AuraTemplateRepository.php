<?php

namespace App\Domains\Aura\Infrastructure\Persistence\Eloquent;

use App\Domains\Aura\Domain\AuraTemplate;
use App\Domains\Aura\Domain\AuraTemplateRepositoryInterface;
use DateTimeImmutable;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

class AuraTemplateRepository implements AuraTemplateRepositoryInterface
{
    public function __construct(private readonly AuraTemplateModel $model)
    {
    }

    public function find(string $id): ?AuraTemplate
    {
        /** @var AuraTemplateModel|null $model */
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * @return Collection<int, AuraTemplate>
     */
    public function findByProjectId(string $projectId): Collection
    {
        /** @var EloquentCollection<int, AuraTemplateModel> $models */
        $models = $this->model->where('project_id', $projectId)->get();
        return $models->map(fn (AuraTemplateModel $model) => $this->toDomain($model));
    }

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraTemplate
    {
        /** @var AuraTemplateModel $model */
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool
    {
        /** @var AuraTemplateModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        /** @var AuraTemplateModel|null $model */
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }
        return (bool) $model->delete();
    }

    private function toDomain(AuraTemplateModel $model): AuraTemplate
    {
        return AuraTemplate::fromArray($model->toArray());
    }
}
