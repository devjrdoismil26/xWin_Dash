<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use App\Domains\Leads\Domain\Segment;
use App\Domains\Leads\Domain\SegmentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SegmentRepository implements SegmentRepositoryInterface
{
    protected SegmentModel $model;

    public function __construct(SegmentModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo Segmento.
     *
     * @param array $data
     *
     * @return Segment
     */
    public function create(array $data): Segment
    {
        $segmentModel = $this->model->create($data);
        return Segment::fromArray($segmentModel->toArray());
    }

    /**
     * Encontra um Segmento pelo seu ID.
     *
     * @param int $id
     *
     * @return Segment|null
     */
    public function find(int $id): ?Segment
    {
        $segmentModel = $this->model->find($id);
        return $segmentModel ? Segment::fromArray($segmentModel->toArray()) : null;
    }

    /**
     * Atualiza um Segmento existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Segment
     */
    public function update(int $id, array $data): Segment
    {
        $segmentModel = $this->model->find($id);
        if (!$segmentModel) {
            throw new \RuntimeException("Segment not found.");
        }
        $segmentModel->update($data);
        return Segment::fromArray($segmentModel->toArray());
    }

    /**
     * Deleta um Segmento pelo seu ID.
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
     * Retorna todos os Segmentos paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)->paginate($perPage)->through(function ($item) {
            return Segment::fromArray($item->toArray());
        });
    }
}
