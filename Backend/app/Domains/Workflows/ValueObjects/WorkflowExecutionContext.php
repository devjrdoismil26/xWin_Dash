<?php

namespace App\Domains\Workflows\ValueObjects;

final class WorkflowExecutionContext
{
    /**
     * @var array<string, mixed>
     */
    private array $data;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(array $data = [])
    {
        $this->data = $data;
    }

    /**
     * Get all context data.
     *
     * @return array<string, mixed>
     */
    public function getData(?string $key = null): mixed
    {
        if ($key === null) {
            return $this->data;
        }

        return $this->data[$key] ?? null;
    }

    /**
     * Set context data.
     *
     * @param string $key
     * @param mixed $value
     */
    public function setData(string $key, mixed $value): void
    {
        $this->data[$key] = $value;
    }

    /**
     * Check if key exists in context.
     */
    public function has(string $key): bool
    {
        return array_key_exists($key, $this->data);
    }

    /**
     * Remove key from context.
     */
    public function remove(string $key): void
    {
        unset($this->data[$key]);
    }

    /**
     * Merge additional data into context.
     *
     * @param array<string, mixed> $data
     */
    public function merge(array $data): void
    {
        $this->data = array_merge($this->data, $data);
    }

    /**
     * Convert to array.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return $this->data;
    }
}
