<?php

namespace App\Domains\AI\Infrastructure\Persistence\Eloquent;

use App\Domains\AI\Contracts\AIGenerationRepositoryInterface;
use App\Domains\AI\Enums\AIGenerationStatus;
use App\Domains\AI\Models\AIGeneration as AIGenerationModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AIGenerationRepository implements AIGenerationRepositoryInterface
{
    protected AIGenerationModel $model;

    public function __construct(AIGenerationModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria uma nova geração de AI.
     *
     * @param array $data
     *
     * @return AIGenerationModel
     */
    public function create(array $data): AIGenerationModel
    {
        return $this->model->create($data);
    }

    /**
     * Atualiza uma geração de AI existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return AIGenerationModel
     */
    public function update(string $id, array $data): AIGenerationModel
    {
        $generation = $this->find($id);
        $generation->update($data);
        return $generation;
    }

    /**
     * Encontra uma geração de AI pelo seu ID.
     *
     * @param int $id
     *
     * @return AIGenerationModel|null
     */
    public function find(string $id): ?AIGenerationModel
    {
        return $this->model->find($id);
    }

    /**
     * Retorna todas as gerações de AI para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|Collection
     */
    public function getForUser(int $userId, int $perPage = 15)
    {
        return $this->model->where('user_id', $userId)->paginate($perPage);
    }

    /**
     * Deleta uma geração de AI.
     *
     * @param string $id
     *
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->model->destroy($id) > 0;
    }

    /**
     * Retorna todas as gerações de AI.
     *
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->select($columns)->get();
    }

    /**
     * Retorna gerações de AI paginadas.
     *
     * @param int $perPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->model->select($columns)->paginate($perPage);
    }

    /**
     * Encontra gerações de AI por projeto.
     *
     * @param string $projectId
     * @return Collection
     */
    public function findByProject(string $projectId): Collection
    {
        return $this->model->where('project_id', $projectId)->get();
    }

    /**
     * Encontra gerações de AI por tipo.
     *
     * @param string $type
     * @return Collection
     */
    public function findByType(string $type): Collection
    {
        return $this->model->where('type', $type)->get();
    }

    /**
     * Encontra gerações de AI por status.
     *
     * @param AIGenerationStatus $status
     * @return Collection
     */
    public function findByStatus(AIGenerationStatus $status): Collection
    {
        return $this->model->where('status', $status->value)->get();
    }
}
