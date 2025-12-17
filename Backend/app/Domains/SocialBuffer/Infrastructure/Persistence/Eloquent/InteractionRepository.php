<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Domain\Interaction; // Supondo que a entidade de domínio exista
use App\Domains\SocialBuffer\Domain\InteractionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class InteractionRepository implements InteractionRepositoryInterface
{
    protected InteractionModel $model;

    public function __construct(InteractionModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria uma nova interação.
     *
     * @param array $data
     *
     * @return Interaction
     */
    public function create(array $data): Interaction
    {
        $interactionModel = $this->model->create($data);
        return Interaction::fromArray($interactionModel->toArray());
    }

    /**
     * Encontra uma interação pelo seu ID.
     *
     * @param string $id
     *
     * @return Interaction|null
     */
    public function find(string $id): ?Interaction
    {
        $interactionModel = $this->model->find($id);
        return $interactionModel ? Interaction::fromArray($interactionModel->toArray()) : null;
    }

    /**
     * Encontra interações por conta social.
     *
     * @param string $socialAccountId
     *
     * @return \Illuminate\Support\Collection
     */
    public function findBySocialAccountId(string $socialAccountId): \Illuminate\Support\Collection
    {
        return $this->model->where('social_account_id', $socialAccountId)->get()->map(function ($item) {
            return Interaction::fromArray($item->toArray());
        });
    }

    /**
     * Atualiza uma interação existente.
     *
     * @param string $id
     * @param array $data
     *
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        $interactionModel = $this->model->find($id);
        if (!$interactionModel) {
            return false;
        }
        return $interactionModel->update($data);
    }

    /**
     * Deleta uma interação pelo seu ID.
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
     * Retorna todas as interações paginadas para um post.
     *
     * @param int $postId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginatedForPost(int $postId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('post_id', $postId)->paginate($perPage)->through(function ($item) {
            return Interaction::fromArray($item->toArray());
        });
    }
}
