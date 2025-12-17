<?php

namespace App\Domains\Analytics\Application\Commands;

class DeleteMetricCommand
{
    public function __construct(
        public readonly int $metricId,
        public readonly bool $forceDelete = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'metric_id' => $this->metricId,
            'force_delete' => $this->forceDelete
        ];
    }
}
