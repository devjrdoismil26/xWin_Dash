<?php

namespace App\Application\AI\Commands;

class RetryAIGenerationCommand
{
    public string $generationId;
    public int $retryCount;
    public int $maxRetries;

    public function __construct(string $generationId, int $retryCount = 0, int $maxRetries = 3)
    {
        $this->generationId = $generationId;
        $this->retryCount = $retryCount;
        $this->maxRetries = $maxRetries;
    }
}