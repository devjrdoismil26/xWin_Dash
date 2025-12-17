<?php

namespace App\Domains\Workflows\ValueObjects;

class LoopNodeConfig
{
    /**
     * @param array<string, mixed> $collection
     */
    public function __construct(
        public array $collection,
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            collection: $data['collection'] ?? [],
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'collection' => $this->collection,
        ];
    }
}
