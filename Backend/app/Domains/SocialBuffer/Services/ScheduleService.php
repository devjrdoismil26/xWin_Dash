<?php

namespace App\Domains\SocialBuffer\Services;

use App\Domains\SocialBuffer\Contracts\ScheduleServiceInterface;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\ScheduleModel;

class ScheduleService implements ScheduleServiceInterface
{
    public function __construct(private ScheduleModel $schedules)
    {
    }

    public function getById(int $id): ?ScheduleModel
    {
        return $this->schedules->find($id);
    }

    public function cancel(int $id): bool
    {
        if ($schedule = $this->schedules->find($id)) {
            $schedule->status = 'cancelled';
            return $schedule->save();
        }
        return false;
    }
}
