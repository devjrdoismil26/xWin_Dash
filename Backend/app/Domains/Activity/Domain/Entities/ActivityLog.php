<?php

namespace App\Domains\Activity\Domain\Entities;

class ActivityLog
{
    public function __construct(
        public readonly string $id,
        public readonly string $logName,
        public readonly string $description,
        public readonly ?string $subjectType = null,
        public readonly ?string $subjectId = null,
        public readonly ?string $causerType = null,
        public readonly ?string $causerId = null,
        public readonly ?array $properties = null,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'log_name' => $this->logName,
            'description' => $this->description,
            'subject_type' => $this->subjectType,
            'subject_id' => $this->subjectId,
            'causer_type' => $this->causerType,
            'causer_id' => $this->causerId,
            'properties' => $this->properties,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }

    public function hasSubject(): bool
    {
        return $this->subjectType !== null && $this->subjectId !== null;
    }

    public function hasCauser(): bool
    {
        return $this->causerType !== null && $this->causerId !== null;
    }

    public function hasProperties(): bool
    {
        return $this->properties !== null && !empty($this->properties);
    }

    public function getProperty(string $key, mixed $default = null): mixed
    {
        return $this->properties[$key] ?? $default;
    }

    public function isUserAction(): bool
    {
        return $this->causerType === 'App\\Models\\User';
    }

    public function isSystemAction(): bool
    {
        return $this->causerType === 'App\\Models\\System';
    }

    public function isError(): bool
    {
        return $this->logName === 'error_occurred';
    }

    public function isPerformanceMeasurement(): bool
    {
        return $this->logName === 'performance_measurement';
    }
}
