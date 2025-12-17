<?php

namespace App\Domains\Core\Patterns\Strategy;

use App\Domains\Core\Domain\Notification;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use App\Mail\GenericNotificationMail; // Supondo que você tenha uma classe Mail para notificações
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailNotificationStrategy implements NotificationStrategy
{
    /**
     * Envia uma notificação por e-mail.
     *
     * @param Notification $notification A notificação a ser enviada.
     * @return bool True se a notificação foi enviada com sucesso, false caso contrário.
     */
    public function send(Notification $notification): bool
    {
        try {
            // Assumindo que a notificação tem um user_id e que o usuário tem um email
            /** @var \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel|null $user */
            $user = UserModel::find($notification->userId);

            if ($user === null || $user->email === null) {
                Log::warning("EmailNotificationStrategy: Usuário ou email não encontrado para notificação ID: {$notification->id}");
                return false;
            }

            Mail::to($user->email)->send(new GenericNotificationMail(new Notification(
                $notification->userId,
                $notification->message,
                $notification->type,
                $notification->link,
                $notification->read,
                $notification->id,
                $notification->createdAt,
                $notification->updatedAt
            )));

            Log::info("EmailNotificationStrategy: Notificação ID {$notification->id} enviada por email para {$user->email}.");
            return true;
        } catch (\Exception $e) {
            Log::error("EmailNotificationStrategy: Falha ao enviar notificação ID {$notification->id} por email: " . $e->getMessage());
            return false;
        }
    }
}
