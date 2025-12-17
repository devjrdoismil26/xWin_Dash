<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Domain\Schedule; // Supondo que a entidade de domínio exista
use App\Domains\SocialBuffer\Domain\ScheduleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ScheduleRepository implements ScheduleRepositoryInterface
{
    protected ScheduleModel $model;

    public function __construct(ScheduleModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo agendamento.
     *
     * @param array $data
     *
     * @return Schedule
     */
    public function create(array $data): Schedule
    {
        $scheduleModel = $this->model->create($data);
        return Schedule::fromArray($scheduleModel->toArray());
    }

    /**
     * Encontra um agendamento pelo seu ID.
     *
     * @param int $id
     *
     * @return Schedule|null
     */
    public function find(int $id): ?Schedule
    {
        $scheduleModel = $this->model->find($id);
        return $scheduleModel ? Schedule::fromArray($scheduleModel->toArray()) : null;
    }

    /**
     * Atualiza um agendamento existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Schedule
     */
    public function update(int $id, array $data): Schedule
    {
        $scheduleModel = $this->model->find($id);
        if (!$scheduleModel) {
            throw new \RuntimeException("Schedule not found.");
        }
        $scheduleModel->update($data);
        return Schedule::fromArray($scheduleModel->toArray());
    }

    /**
     * Deleta um agendamento pelo seu ID.
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
     * Retorna todos os agendamentos paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)->paginate($perPage)->through(function ($item) {
            return Schedule::fromArray($item->toArray());
        });
    }
}
