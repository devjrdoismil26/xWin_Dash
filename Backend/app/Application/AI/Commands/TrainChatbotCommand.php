<?php

namespace App\Application\AI\Commands;

class TrainChatbotCommand
{
    public string $chatbotId;
    public ?array $trainingData;

    public function __construct(string $chatbotId, ?array $trainingData = null)
    {
        $this->chatbotId = $chatbotId;
        $this->trainingData = $trainingData;
    }
}