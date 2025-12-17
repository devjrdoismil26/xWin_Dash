<?php

namespace App\Domains\Core\Application\Services;

use App\Domains\Core\Application\DTOs\NotificationDTO;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;

class NotificationDispatchService
{
    public function send(User $user, NotificationDTO $dto): bool
    {
        $user->notify(new \Illuminate\Notifications\Messages\DatabaseMessage([
            'title' => $dto->title,
            'message' => $dto->message,
            'type' => $dto->type,
            'data' => $dto->data,
        ]));

        return true;
    }

    public function sendBulk(Collection $users, NotificationDTO $dto): int
    {
        $count = 0;
        foreach ($users as $user) {
            $this->send($user, $dto);
            $count++;
        }
        return $count;
    }

    public function schedule(User $user, NotificationDTO $dto, Carbon $when): bool
    {
        // Implementar com queue delayed
        return true;
    }
}
