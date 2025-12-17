<?php

namespace App\Shared\Services;

use App\Shared\Events\BaseDomainEvent;
use App\Shared\Listeners\BaseEventListener;
use App\Shared\Services\ModuleIntegrationService;
use App\Shared\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Cache;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Cross-Module Event Dispatcher
 * 
 * Dispatcher central para eventos que envolvem múltiplos módulos,
 * garantindo processamento assíncrono e confiável.
 */
class CrossModuleEventDispatcher
{
    private ModuleIntegrationService $moduleIntegrationService;
    private CrossModuleValidationService $validationService;
    private array $eventQueue = [];
    private array $processingEvents = [];
    private int $maxRetries = 3;
    private int $retryDelay = 5; // segundos

    public function __construct(
        ModuleIntegrationService $moduleIntegrationService,
        CrossModuleValidationService $validationService
    ) {
        $this->moduleIntegrationService = $moduleIntegrationService;
        $this->validationService = $validationService;
    }

    /**
     * Dispara um evento para processamento cross-module
     */
    public function dispatch(BaseDomainEvent $event): void
    {
        try {
            // Validar evento antes do processamento
            if (!$this->validateEvent($event)) {
                Log::warning('Event validation failed, skipping dispatch', [
                    'event_type' => $event->getEventType(),
                    'event_id' => $event->eventId
                ]);
                return;
            }

            // Adicionar à fila de processamento
            $this->addToQueue($event);

            // Processar evento imediatamente se possível
            $this->processEvent($event);

            Log::info('Event dispatched successfully', [
                'event_type' => $event->getEventType(),
                'event_id' => $event->eventId,
                'user_id' => $event->userId,
                'project_id' => $event->projectId
            ]);

        } catch (\Throwable $exception) {
            Log::error('Event dispatch failed', [
                'event_type' => $event->getEventType(),
                'event_id' => $event->eventId,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            // Tentar reprocessar em caso de erro
            $this->scheduleRetry($event);
        }
    }

    /**
     * Processa um evento específico
     */
    public function processEvent(BaseDomainEvent $event): void
    {
        try {
            // Verificar se o evento já está sendo processado
            if (in_array($event->eventId, $this->processingEvents)) {
                Log::warning('Event already being processed', [
                    'event_id' => $event->eventId
                ]);
                return;
            }

            // Marcar como em processamento
            $this->processingEvents[] = $event->eventId;

            // Processar através do serviço de integração
            $this->moduleIntegrationService->processEvent($event);

            // Remover da fila de processamento
            $this->removeFromQueue($event->eventId);

            Log::info('Event processed successfully', [
                'event_type' => $event->getEventType(),
                'event_id' => $event->eventId
            ]);

        } catch (\Throwable $exception) {
            Log::error('Event processing failed', [
                'event_type' => $event->getEventType(),
                'event_id' => $event->eventId,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            // Tentar reprocessar em caso de erro
            $this->scheduleRetry($event);

        } finally {
            // Remover da lista de eventos em processamento
            $this->processingEvents = array_filter(
                $this->processingEvents,
                fn($id) => $id !== $event->eventId
            );
        }
    }

    /**
     * Processa todos os eventos na fila
     */
    public function processQueue(): void
    {
        $eventsToProcess = $this->eventQueue;
        
        foreach ($eventsToProcess as $event) {
            try {
                $this->processEvent($event);
            } catch (\Throwable $exception) {
                Log::error('Queue processing failed for event', [
                    'event_id' => $event->eventId,
                    'error' => $exception->getMessage()
                ]);
            }
        }
    }

    /**
     * Agenda reprocessamento de um evento
     */
    public function scheduleRetry(BaseDomainEvent $event): void
    {
        $retryCount = $this->getRetryCount($event->eventId);
        
        if ($retryCount >= $this->maxRetries) {
            Log::error('Max retries exceeded for event', [
                'event_id' => $event->eventId,
                'retry_count' => $retryCount
            ]);
            return;
        }

        // Incrementar contador de tentativas
        $this->incrementRetryCount($event->eventId);

        // Agendar reprocessamento
        Queue::later(
            now()->addSeconds($this->retryDelay * ($retryCount + 1)),
            new class($event, $this) implements ShouldQueue {
                private BaseDomainEvent $event;
                private CrossModuleEventDispatcher $dispatcher;

                public function __construct(BaseDomainEvent $event, CrossModuleEventDispatcher $dispatcher)
                {
                    $this->event = $event;
                    $this->dispatcher = $dispatcher;
                }

                public function handle(): void
                {
                    $this->dispatcher->processEvent($this->event);
                }
            }
        );

        Log::info('Event retry scheduled', [
            'event_id' => $event->eventId,
            'retry_count' => $retryCount + 1,
            'retry_delay' => $this->retryDelay * ($retryCount + 1)
        ]);
    }

    /**
     * Valida um evento antes do processamento
     */
    private function validateEvent(BaseDomainEvent $event): bool
    {
        try {
            // Verificar se o evento não é muito antigo
            if ($event->getAgeInMinutes() > 60) {
                Log::warning('Event too old, skipping validation', [
                    'event_id' => $event->eventId,
                    'age_minutes' => $event->getAgeInMinutes()
                ]);
                return false;
            }

            // Verificar se o evento tem payload válido
            if (empty($event->payload)) {
                Log::warning('Event has empty payload', [
                    'event_id' => $event->eventId
                ]);
                return false;
            }

            // Verificar se o evento não está duplicado
            if ($this->isEventDuplicate($event)) {
                Log::warning('Duplicate event detected', [
                    'event_id' => $event->eventId
                ]);
                return false;
            }

            return true;

        } catch (\Throwable $exception) {
            Log::error('Event validation failed', [
                'event_id' => $event->eventId,
                'error' => $exception->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Verifica se um evento é duplicado
     */
    private function isEventDuplicate(BaseDomainEvent $event): bool
    {
        $cacheKey = "event_processed_{$event->eventId}";
        
        if (Cache::has($cacheKey)) {
            return true;
        }

        // Marcar como processado
        Cache::put($cacheKey, true, 3600); // 1 hora

        return false;
    }

    /**
     * Adiciona evento à fila de processamento
     */
    private function addToQueue(BaseDomainEvent $event): void
    {
        $this->eventQueue[] = $event;
        
        Log::debug('Event added to queue', [
            'event_id' => $event->eventId,
            'queue_size' => count($this->eventQueue)
        ]);
    }

    /**
     * Remove evento da fila de processamento
     */
    private function removeFromQueue(string $eventId): void
    {
        $this->eventQueue = array_filter(
            $this->eventQueue,
            fn($event) => $event->eventId !== $eventId
        );
        
        Log::debug('Event removed from queue', [
            'event_id' => $eventId,
            'queue_size' => count($this->eventQueue)
        ]);
    }

    /**
     * Obtém contador de tentativas para um evento
     */
    private function getRetryCount(string $eventId): int
    {
        $cacheKey = "event_retry_count_{$eventId}";
        return Cache::get($cacheKey, 0);
    }

    /**
     * Incrementa contador de tentativas para um evento
     */
    private function incrementRetryCount(string $eventId): void
    {
        $cacheKey = "event_retry_count_{$eventId}";
        $currentCount = $this->getRetryCount($eventId);
        Cache::put($cacheKey, $currentCount + 1, 3600); // 1 hora
    }

    /**
     * Dispara evento para listeners específicos
     */
    public function dispatchToListeners(BaseDomainEvent $event, array $listenerClasses): void
    {
        foreach ($listenerClasses as $listenerClass) {
            try {
                if (class_exists($listenerClass)) {
                    $listener = app($listenerClass);
                    
                    if ($listener instanceof BaseEventListener) {
                        $listener->handle($event);
                        
                        Log::info('Event dispatched to listener', [
                            'event_id' => $event->eventId,
                            'listener_class' => $listenerClass
                        ]);
                    }
                }
            } catch (\Throwable $exception) {
                Log::error('Listener dispatch failed', [
                    'event_id' => $event->eventId,
                    'listener_class' => $listenerClass,
                    'error' => $exception->getMessage()
                ]);
            }
        }
    }

    /**
     * Dispara evento para todos os listeners registrados
     */
    public function dispatchToAllListeners(BaseDomainEvent $event): void
    {
        try {
            Event::dispatch($event);
            
            Log::info('Event dispatched to all listeners', [
                'event_id' => $event->eventId,
                'event_type' => $event->getEventType()
            ]);
        } catch (\Throwable $exception) {
            Log::error('Global event dispatch failed', [
                'event_id' => $event->eventId,
                'error' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Processa eventos em lote
     */
    public function processBatch(array $events): void
    {
        $successCount = 0;
        $failureCount = 0;

        foreach ($events as $event) {
            try {
                $this->processEvent($event);
                $successCount++;
            } catch (\Throwable $exception) {
                $failureCount++;
                Log::error('Batch processing failed for event', [
                    'event_id' => $event->eventId,
                    'error' => $exception->getMessage()
                ]);
            }
        }

        Log::info('Batch processing completed', [
            'total_events' => count($events),
            'success_count' => $successCount,
            'failure_count' => $failureCount
        ]);
    }

    /**
     * Obtém estatísticas do dispatcher
     */
    public function getStats(): array
    {
        return [
            'queue_size' => count($this->eventQueue),
            'processing_events' => count($this->processingEvents),
            'max_retries' => $this->maxRetries,
            'retry_delay' => $this->retryDelay,
            'timestamp' => now()->toISOString()
        ];
    }

    /**
     * Limpa fila de eventos
     */
    public function clearQueue(): void
    {
        $this->eventQueue = [];
        $this->processingEvents = [];
        
        Log::info('Event queue cleared');
    }

    /**
     * Define configurações do dispatcher
     */
    public function configure(array $config): void
    {
        if (isset($config['max_retries'])) {
            $this->maxRetries = $config['max_retries'];
        }

        if (isset($config['retry_delay'])) {
            $this->retryDelay = $config['retry_delay'];
        }

        Log::info('Dispatcher configuration updated', $config);
    }

    /**
     * Obtém eventos pendentes na fila
     */
    public function getPendingEvents(): array
    {
        return $this->eventQueue;
    }

    /**
     * Obtém eventos em processamento
     */
    public function getProcessingEvents(): array
    {
        return $this->processingEvents;
    }

    /**
     * Verifica se há eventos pendentes
     */
    public function hasPendingEvents(): bool
    {
        return !empty($this->eventQueue);
    }

    /**
     * Obtém tamanho da fila
     */
    public function getQueueSize(): int
    {
        return count($this->eventQueue);
    }

    /**
     * Obtém número de eventos em processamento
     */
    public function getProcessingCount(): int
    {
        return count($this->processingEvents);
    }
}