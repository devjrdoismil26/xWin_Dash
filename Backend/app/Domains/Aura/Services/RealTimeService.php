<?php

namespace App\Domains\Aura\Services;

use App\Domains\Aura\ValueObjects\RealTimeEvent;
use App\Domains\Aura\ValueObjects\WebSocketMessage;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class RealTimeService
{
    private const CHANNEL_PREFIX = 'aura:';

    public function broadcast(RealTimeEvent $event): void
    {
        try {
            $channel = self::CHANNEL_PREFIX . $event->type;
            $message = WebSocketMessage::create($event->type, $event->toArray(), $channel);
            
            Redis::publish($channel, $message->toJson());
            
            Log::info('Real-time event broadcasted', [
                'type' => $event->type,
                'entity_id' => $event->entityId,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to broadcast real-time event', [
                'error' => $e->getMessage(),
                'event' => $event->toArray(),
            ]);
        }
    }

    public function broadcastToUser(string $userId, RealTimeEvent $event): void
    {
        try {
            $channel = self::CHANNEL_PREFIX . "user:{$userId}";
            $message = WebSocketMessage::create($event->type, $event->toArray(), $channel);
            
            Redis::publish($channel, $message->toJson());
        } catch (\Exception $e) {
            Log::error('Failed to broadcast to user', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function broadcastToChat(string $chatId, RealTimeEvent $event): void
    {
        try {
            $channel = self::CHANNEL_PREFIX . "chat:{$chatId}";
            $message = WebSocketMessage::create($event->type, $event->toArray(), $channel);
            
            Redis::publish($channel, $message->toJson());
        } catch (\Exception $e) {
            Log::error('Failed to broadcast to chat', [
                'chat_id' => $chatId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
