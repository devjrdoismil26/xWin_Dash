<?php

namespace App\Application\Core\UseCases;

use App\Application\Core\Commands\CreateNotificationCommand;
use App\Domains\Core\Services\NotificationService; // Supondo que este serviço exista

class CreateNotificationUseCase
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Executa o caso de uso para criar uma notificação.
     *
     * @param CreateNotificationCommand $command
     *
     * @return mixed a notificação criada
     */
    public function execute(CreateNotificationCommand $command)
    {
        // Aqui, o caso de uso traduz o Command para o formato que o serviço de domínio espera.
        $notificationData = [
            'user_id' => $command->userId,
            'message' => $command->message,
            'type' => $command->type,
            'link' => $command->link,
        ];

        return $this->notificationService->createNotification($notificationData);
    }
}
