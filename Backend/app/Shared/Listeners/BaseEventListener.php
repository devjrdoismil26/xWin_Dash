<?php

namespace App\Shared\Listeners;

use App\Shared\Events\BaseDomainEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

abstract class BaseEventListener implements ShouldQueue
{
    use InteractsWithQueue;

    protected function logEvent(BaseDomainEvent $event, string $action): void
    {
        Log::info("Event processed: {$event->getEventType()}", [
            'event_id' => $event->eventId,
            'action' => $action,
            'user_id' => $event->userId,
            'project_id' => $event->projectId,
            'occurred_at' => $event->occurredAt->format('Y-m-d H:i:s'),
        ]);
    }

    protected function logError(BaseDomainEvent $event, \Throwable $exception): void
    {
        Log::error("Event processing failed: {$event->getEventType()}", [
            'event_id' => $event->eventId,
            'user_id' => $event->userId,
            'project_id' => $event->projectId,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }

    protected function shouldProcessEvent(BaseDomainEvent $event): bool
    {
        // Override in child classes for specific logic
        return true;
    }

    protected function getEventAge(BaseDomainEvent $event): int
    {
        return $event->getAgeInSeconds();
    }

    protected function isEventRecent(BaseDomainEvent $event, int $maxAgeSeconds = 3600): bool
    {
        return $event->getAgeInSeconds() <= $maxAgeSeconds;
    }
}