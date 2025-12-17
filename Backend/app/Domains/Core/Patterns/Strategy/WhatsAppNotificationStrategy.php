<?php

namespace App\Domains\Core\Patterns\Strategy;

use App\Domains\Core\Domain\Notification;
use App\Domains\Core\Services\WhatsAppService; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class WhatsAppNotificationStrategy implements NotificationStrategy
{
    protected WhatsAppService $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    /**
     * Envia uma notificação por WhatsApp.
     *
     * @param Notification $notification a notificação a ser enviada
     *
     * @return bool true se a notificação foi enviada com sucesso, false caso contrário
     */
    public function send(Notification $notification): bool
    {
        try {
            // Assumindo que a notificação tem um user_id e que o usuário tem um número de telefone
            /** @var \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel|null $user */
            $user = \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel::find($notification->userId);

            if (!$user || empty($user->whatsapp)) {
                Log::warning("WhatsAppNotificationStrategy: Número de telefone não encontrado para notificação ID: {$notification->id}");
                return false;
            }

            $message = $notification->message; // Ou formatar a mensagem de forma mais complexa

            $this->whatsAppService->sendTextMessage($user->whatsapp, $message);

            Log::info("WhatsAppNotificationStrategy: Notificação ID {$notification->id} enviada por WhatsApp para {$user->whatsapp}.");
            return true;
        } catch (\Exception $e) {
            Log::error("WhatsAppNotificationStrategy: Falha ao enviar notificação ID {$notification->id} por WhatsApp: " . $e->getMessage());
            return false;
        }
    }
}
