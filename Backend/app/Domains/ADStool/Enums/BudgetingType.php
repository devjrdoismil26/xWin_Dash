<?php

namespace App\Domains\ADStool\Enums;

enum BudgetingType: string
{
    case Daily = 'daily';
    case Total = 'total';

    /**
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
