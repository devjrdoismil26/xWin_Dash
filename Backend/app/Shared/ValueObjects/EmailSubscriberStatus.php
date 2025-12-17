<?php

namespace App\Shared\ValueObjects;

enum EmailSubscriberStatus: string
{
    case SUBSCRIBED = 'subscribed';
    case UNSUBSCRIBED = 'unsubscribed';
    case BOUNCED = 'bounced';
    case COMPLAINED = 'complained';
    case CLEANED = 'cleaned';

    public function getLabel(): string
    {
        return match ($this) {
            self::SUBSCRIBED => 'Inscrito',
            self::UNSUBSCRIBED => 'Desinscrito',
            self::BOUNCED => 'Rejeitado',
            self::COMPLAINED => 'Reclamou',
            self::CLEANED => 'Limpo',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::SUBSCRIBED => 'green',
            self::UNSUBSCRIBED => 'red',
            self::BOUNCED => 'orange',
            self::COMPLAINED => 'purple',
            self::CLEANED => 'gray',
        };
    }
}
