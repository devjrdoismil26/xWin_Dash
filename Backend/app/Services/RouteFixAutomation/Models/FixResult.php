<?php

namespace App\Services\RouteFixAutomation\Models;

class FixResult
{
    public function __construct(
        public bool $success,
        public int $totalFixed,
        public int $totalErrors,
        public array $fixedItems,
        public array $errors,
        public float $executionTime,
        public ?TestResult $finalTest = null
    ) {}

    public function toArray(): array
    {
        return [
            'success' => $this->success,
            'totalFixed' => $this->totalFixed,
            'totalErrors' => $this->totalErrors,
            'fixedItems' => $this->fixedItems,
            'errors' => $this->errors,
            'executionTime' => $this->executionTime,
            'finalTest' => $this->finalTest?->toArray()
        ];
    }
}