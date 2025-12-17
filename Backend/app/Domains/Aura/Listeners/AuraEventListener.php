<?php

namespace App\Domains\Aura\Listeners;

use Illuminate\Support\Facades\Log;

class AuraEventListener
{
    public function handleChatCreated($event): void
    {
        Log::info('Aura chat created', ['chat_id' => $event->auraChat->id]);
    }

    public function handleChatUpdated($event): void
    {
        Log::info('Aura chat updated', ['chat_id' => $event->auraChat->id]);
    }

    public function handleMessageSent($event): void
    {
        Log::info('Aura message sent', ['message_id' => $event->auraMessage->id]);
    }

    public function handleFlowStarted($event): void
    {
        Log::info('Aura flow started', [
            'flow_id' => $event->flowId,
            'execution_id' => $event->executionId,
        ]);
    }

    public function handleConnectionConnected($event): void
    {
        Log::info('Aura connection connected', ['connection_id' => $event->auraConnection->id]);
    }

    public function handleConnectionDisconnected($event): void
    {
        Log::info('Aura connection disconnected', ['connection_id' => $event->auraConnection->id]);
    }
}
