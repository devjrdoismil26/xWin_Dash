<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Contracts\PostRepositoryInterface; // Supondo que a entidade de domínio exista
use App\Domains\SocialBuffer\Domain\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PostRepository implements PostRepositoryInterface
{
    protected PostModel $model;

    public function __construct(PostModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo post.
     *
     * @param array $data
     *
     * @return Post
     */
    public function create(array $data): Post
    {
        $postModel = $this->model->create($data);
        return Post::fromArray($postModel->toArray());
    }

    /**
     * Encontra um post pelo seu ID.
     *
     * @param int $id
     *
     * @return Post|null
     */
    public function find(int $id): ?Post
    {
        $postModel = $this->model->find($id);
        return $postModel ? Post::fromArray($postModel->toArray()) : null;
    }

    /**
     * Atualiza um post existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Post
     */
    public function update(int $id, array $data): Post
    {
        $postModel = $this->model->find($id);
        if (!$postModel) {
            throw new \RuntimeException("Post not found.");
        }
        $postModel->update($data);
        return Post::fromArray($postModel->toArray());
    }

    /**
     * Deleta um post pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Retorna todos os posts paginados para um usuário, com filtros opcionais.
     *
     * @param int   $userId
     * @param array $filters
     * @param int   $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->where('user_id', $userId);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['platform'])) {
            // Isso exigiria um relacionamento ou uma tabela pivot para filtrar por plataforma
            // $query->whereHas('socialAccounts', function ($q) use ($filters) {
            //     $q->where('platform', $filters['platform']);
            // });
        }
        if (isset($filters['start_date'])) {
            $query->where('scheduled_at', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date'])) {
            $query->where('scheduled_at', '<=', $filters['end_date']);
        }

        return $query->paginate($perPage)->through(function ($item) {
            return Post::fromArray($item->toArray());
        });
    }
}
