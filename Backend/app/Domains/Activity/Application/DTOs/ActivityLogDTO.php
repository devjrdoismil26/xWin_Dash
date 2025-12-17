<?php

namespace App\Domains\Activity\Application\DTOs;

class ActivityLogDTO
{
    public function __construct(
        public readonly string $logName,
        public readonly string $description,
        public readonly ?string $subjectType = null,
        public readonly ?string $subjectId = null,
        public readonly ?string $causerType = null,
        public readonly ?string $causerId = null,
        public readonly ?array $properties = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'log_name' => $this->logName,
            'description' => $this->description,
            'subject_type' => $this->subjectType,
            'subject_id' => $this->subjectId,
            'causer_type' => $this->causerType,
            'causer_id' => $this->causerId,
            'properties' => $this->properties,
        ];
    }
}
