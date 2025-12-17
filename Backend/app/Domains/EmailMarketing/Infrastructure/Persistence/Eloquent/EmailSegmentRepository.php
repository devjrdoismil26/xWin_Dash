<?php

namespace App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Domain\EmailSegment;
use App\Domains\EmailMarketing\Contracts\EmailSegmentRepositoryInterface;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSegment as EmailSegmentModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmailSegmentRepository implements EmailSegmentRepositoryInterface
{
    protected EmailSegmentModel $model;

    public function __construct(EmailSegmentModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo segmento de e-mail.
     *
     * @param array $data
     *
     * @return EmailSegment
     */
    public function create(array $data): EmailSegment
    {
        $segmentModel = $this->model->create($data);
        return EmailSegment::fromArray($segmentModel->toArray());
    }

    /**
     * Encontra um segmento de e-mail pelo seu ID.
     *
     * @param int $id
     *
     * @return EmailSegment|null
     */
    public function find(int $id): ?EmailSegment
    {
        $segmentModel = $this->model->find($id);
        return $segmentModel ? EmailSegment::fromArray($segmentModel->toArray()) : null;
    }

    /**
     * Atualiza um segmento de e-mail existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return EmailSegment
     */
    public function update(int $id, array $data): EmailSegment
    {
        $segmentModel = $this->model->find($id);
        if (!$segmentModel) {
            throw new \RuntimeException("Email Segment not found.");
        }
        $segmentModel->update($data);
        return EmailSegment::fromArray($segmentModel->toArray());
    }

    /**
     * Deleta um segmento de e-mail pelo seu ID.
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
     * Retorna todos os segmentos de e-mail paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getPaginatedForUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)->paginate($perPage)->through(function ($item) {
            return EmailSegment::fromArray($item->toArray());
        });
    }
}
