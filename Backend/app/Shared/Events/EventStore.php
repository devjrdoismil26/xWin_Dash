<?php

namespace App\Shared\Events;

// Supondo que a interface DomainEvent exista
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventStore
{
    /**
     * Armazena um evento de domínio.
     *
     * @param DomainEvent $event o evento de domínio a ser armazenado
     */
    public function store(DomainEvent $event): void
    {
        $eventName = get_class($event);
        $payload = json_encode($event); // Serializar o evento para JSON

        DB::table('domain_events')->insert([
            'event_name' => $eventName,
            'payload' => $payload,
            'occurred_at' => now(),
            // Adicione outros campos relevantes, como aggregate_id, user_id, etc.
        ]);

        Log::info("Evento de domínio armazenado: {$eventName}");
    }

    /**
     * Recupera eventos de domínio para um determinado agregado ou período.
     *
     * @param string|null    $aggregateId opcional: ID do agregado
     * @param \DateTime|null $since       opcional: Data a partir da qual os eventos devem ser recuperados
     *
     * @return array<DomainEvent>
     */
    public function retrieve(?string $aggregateId = null, ?\DateTime $since = null): array
    {
        $query = DB::table('domain_events')->orderBy('occurred_at');

        if ($aggregateId) {
            $query->where('aggregate_id', $aggregateId);
        }

        if ($since) {
            $query->where('occurred_at', '>=', $since);
        }

        $eventsData = $query->get();
        $events = [];

        foreach ($eventsData as $eventData) {
            // Deserializar o evento de volta para sua classe original
            $eventName = $eventData->event_name;
            $payload = json_decode($eventData->payload, true);

            // Isso exigiria que cada evento de domínio tivesse um método fromArray ou um construtor adequado
            // para ser reconstruído a partir do payload.
            // Por simplicidade, vamos apenas criar uma instância genérica ou lançar um erro se a classe não existir.
            if (class_exists($eventName)) {
                // Exemplo: se o evento tiver um construtor que aceita o payload
                // $events[] = new $eventName(...$payload);
                // Ou, se for uma entidade de domínio que implementa fromArray
                // $events[] = $eventName::fromArray($payload);
                Log::warning("Reconstrução de evento de domínio não totalmente implementada para: {$eventName}");
            } else {
                Log::error("Classe de evento de domínio não encontrada: {$eventName}");
            }
        }

        return $events;
    }
}
