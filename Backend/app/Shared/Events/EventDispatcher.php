<?php

namespace App\Shared\Events;

use Illuminate\Events\Dispatcher as LaravelEventDispatcher;
// Supondo que a interface DomainEvent exista
use Illuminate\Support\Facades\Log;

class EventDispatcher
{
    protected LaravelEventDispatcher $dispatcher;

    public function __construct(LaravelEventDispatcher $dispatcher)
    {
        $this->dispatcher = $dispatcher;
    }

    /**
     * Dispara um evento de domínio.
     *
     * @param DomainEvent $event o evento de domínio a ser disparado
     */
    public function dispatch(DomainEvent $event): void
    {
        Log::info("Disparando evento de domínio: " . get_class($event));
        $this->dispatcher->dispatch($event);
    }

    /**
     * Registra um listener para um evento de domínio.
     *
     * @param string $event    o nome da classe do evento
     * @param mixed  $listener o listener a ser registrado
     */
    public function listen(string $event, mixed $listener): void
    {
        $this->dispatcher->listen($event, $listener);
    }

    /**
     * Dispara um evento e chama os listeners.
     *
     * @param string $event   o nome da classe do evento
     * @param mixed  $payload o payload do evento
     * @param bool   $halt    se deve parar a propagação após o primeiro listener
     *
     * @return array|null
     */
    public function fire(string $event, mixed $payload = [], bool $halt = false): array|null
    {
        return $this->dispatcher->dispatch($event, $payload, $halt);
    }
}
