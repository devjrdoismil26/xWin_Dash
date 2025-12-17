<?php

namespace App\Services\RouteFixAutomation\Models;

class TestResult
{
    public function __construct(
        public int $functionalControllers,
        public int $totalControllers,
        public float $successPercentage,
        public array $functionalList,
        public array $dependencyErrors,
        public array $generalErrors,
        public array $remainingIssues
    ) {}

    public function toArray(): array
    {
        return [
            'functionalControllers' => $this->functionalControllers,
            'totalControllers' => $this->totalControllers,
            'successPercentage' => $this->successPercentage,
            'functionalList' => $this->functionalList,
            'dependencyErrors' => $this->dependencyErrors,
            'generalErrors' => $this->generalErrors,
            'remainingIssues' => $this->remainingIssues
        ];
    }
}