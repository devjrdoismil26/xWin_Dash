<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Domain\Setting;
use App\Domains\Core\Domain\SettingRepositoryInterface;

/**
 * @method static \App\Domains\Core\Domain\Setting|null getByKey(string $key)
 * @method static \App\Domains\Core\Domain\Setting updateOrCreate(string $key, string $value, ?string $description = null)
 * @method static array<\App\Domains\Core\Domain\Setting> getAll()
 * @method static \App\Domains\Core\Domain\Setting create(array $data)
 * @method static bool update(string $id, array $data)
 * @method static bool delete(string $id)
 */
class SettingRepository implements SettingRepositoryInterface
{
    protected SettingModel $model;

    public function __construct(SettingModel $model)
    {
        $this->model = $model;
    }

    /**
     * Obtém uma configuração pelo seu chave.
     *
     * @param string $key
     *
     * @return Setting|null
     */
    public function getByKey(string $key): ?Setting
    {
        $settingModel = SettingModel::where('key', $key)->first();
        return $settingModel ? Setting::fromArray($settingModel->toArray()) : null;
    }

    /**
     * Atualiza ou cria uma configuração.
     *
     * @param string      $key
     * @param string      $value
     * @param string|null $description
     *
     * @return Setting
     */
    public function updateOrCreate(string $key, string $value, ?string $description = null): Setting
    {
        $settingModel = SettingModel::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'description' => $description],
        );
        return Setting::fromArray($settingModel->toArray());
    }

    /**
     * Retorna todas as configurações.
     *
     * @return array<Setting>
     */
    public function getAll(): array
    {
        return SettingModel::all()->map(function ($item) {
            return Setting::fromArray($item->toArray());
        })->toArray();
    }

    /**
     * Cria uma nova configuração.
     *
     * @param array<string, mixed> $data
     * @return Setting
     */
    public function create(array $data): Setting
    {
        $settingModel = SettingModel::create($data);
        return Setting::fromArray($settingModel->toArray());
    }

    /**
     * Atualiza uma configuração.
     *
     * @param string $id
     * @param array<string, mixed> $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        $settingModel = SettingModel::find($id);
        if ($settingModel) {
            return $settingModel->update($data);
        }
        return false;
    }

    /**
     * Exclui uma configuração.
     *
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return (bool)SettingModel::destroy($id);
    }

    /**
     * Busca configurações por filtros.
     *
     * @param array<string, mixed> $filters
     * @param int $limit
     * @param int $offset
     * @param string $sortBy
     * @param string $sortDirection
     * @return \Illuminate\Support\Collection
     */
    public function findByFilters(array $filters, int $limit = 50, int $offset = 0, string $sortBy = 'key', string $sortDirection = 'asc')
    {
        $query = SettingModel::query();

        if (isset($filters['category'])) {
            $query->where('key', 'like', $filters['category'] . '.%');
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('key', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy($sortBy, $sortDirection)
                    ->offset($offset)
                    ->limit($limit)
                    ->get()
                    ->map(function ($item) {
                        return Setting::fromArray($item->toArray());
                    });
    }

    /**
     * Conta configurações por filtros.
     *
     * @param array<string, mixed> $filters
     * @return int
     */
    public function countByFilters(array $filters): int
    {
        $query = SettingModel::query();

        if (isset($filters['category'])) {
            $query->where('key', 'like', $filters['category'] . '.%');
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('key', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->count();
    }
}
