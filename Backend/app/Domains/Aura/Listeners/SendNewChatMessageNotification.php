<?php

namespace App\Domains\Aura\Listeners;

use App\Domains\Aura\Events\NewChatMessage;
use App\Domains\Aura\Services\RealTimeService;
use App\Domains\Aura\ValueObjects\RealTimeEvent;

class SendNewChatMessageNotification
{
    public function __construct(private RealTimeService $realTimeService) {}

    public function handle(NewChatMessage $event): void
    {
        $message = $event->message;
        $chat = $message->chat;

        // Broadcast para o chat específico
        $this->realTimeService->broadcastToChat(
            $chat->id,
            RealTimeEvent::messageReceived($chat->id, $message->toArray())
        );

        // Se o chat está atribuído a alguém, notificar o usuário
        if ($chat->assigned_to) {
            $this->realTimeService->broadcastToUser(
                $chat->assigned_to,
                RealTimeEvent::messageReceived($chat->id, $message->toArray())
            );
        }
    }
}
