<?php

namespace App\Shared\ValueObjects;

enum BudgetPeriod: string
{
    case DAILY = 'daily';
    case WEEKLY = 'weekly';
    case MONTHLY = 'monthly';
    case TOTAL = 'total';

    public function getLabel(): string
    {
        return match ($this) {
            self::DAILY => 'Diário',
            self::WEEKLY => 'Semanal',
            self::MONTHLY => 'Mensal',
            self::TOTAL => 'Total',
        };
    }
}
