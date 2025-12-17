<?php

namespace App\Domains\Core\Application\Actions;

use App\Domains\Core\Application\DTOs\NotificationDTO;
use App\Domains\Core\Application\Services\NotificationDispatchService;
use App\Models\User;

class SendNotificationAction
{
    public function __construct(
        private NotificationDispatchService $notificationService
    ) {}

    public function execute(User $user, NotificationDTO $dto): bool
    {
        return $this->notificationService->send($user, $dto);
    }
}
