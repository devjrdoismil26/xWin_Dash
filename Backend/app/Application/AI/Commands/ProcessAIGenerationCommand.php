<?php

namespace App\Application\AI\Commands;

class ProcessAIGenerationCommand
{
    public string $generationId;

    public function __construct(string $generationId)
    {
        $this->generationId = $generationId;
    }
}