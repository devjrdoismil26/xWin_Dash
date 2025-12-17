<?php

namespace App\Domains\Core\Modules\Analytics\Commands;

class CleanupAnalyticsCommand
{
    public ?string $period;

    public ?string $dataType;

    public function __construct(?string $period = 'old', ?string $dataType = 'all')
    {
        $this->period = $period;
        $this->dataType = $dataType;
    }
}
