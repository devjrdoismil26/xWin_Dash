<?php

namespace App\Shared\ValueObjects;

enum ScheduleStatus: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
    case CANCELLED = 'cancelled';

    public function getLabel(): string
    {
        return match ($this) {
            self::PENDING => 'Pendente',
            self::PROCESSING => 'Processando',
            self::COMPLETED => 'Concluído',
            self::FAILED => 'Falhou',
            self::CANCELLED => 'Cancelado',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::PENDING => 'orange',
            self::PROCESSING => 'blue',
            self::COMPLETED => 'green',
            self::FAILED => 'red',
            self::CANCELLED => 'gray',
        };
    }
}
