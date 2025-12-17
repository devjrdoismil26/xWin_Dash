<?php

namespace App\Services\RouteFixAutomation\Models;

class ProgressReport
{
    public function __construct(
        public int $functionalControllers,
        public int $totalControllers,
        public float $successPercentage,
        public array $remainingIssues,
        public array $fixHistory
    ) {}

    public function toArray(): array
    {
        return [
            'functionalControllers' => $this->functionalControllers,
            'totalControllers' => $this->totalControllers,
            'successPercentage' => $this->successPercentage,
            'remainingIssues' => $this->remainingIssues,
            'fixHistory' => $this->fixHistory
        ];
    }
}