<?php

namespace App\Shared\Events;

interface DomainEvent
{
    // Esta interface pode ser vazia ou definir métodos comuns a todos os eventos de domínio,
    // como um método para obter o timestamp do evento ou o ID do agregado que o disparou.
    // Por exemplo:
    // public function occurredAt(): \DateTimeImmutable;
    // public function aggregateId(): string;
}
