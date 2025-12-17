<?php

namespace App\Application\AI\Commands;

class CreateChatbotCommand
{
    public string $userId;
    public string $name;
    public string $description;
    public string $type;
    public array $configuration;
    public ?string $welcomeMessage;
    public ?string $fallbackMessage;
    public ?int $maxConversations;
    public ?int $maxChatbotsPerUser;

    public function __construct(
        string $userId,
        string $name,
        string $description,
        string $type,
        array $configuration = [],
        ?string $welcomeMessage = null,
        ?string $fallbackMessage = null,
        ?int $maxConversations = null,
        ?int $maxChatbotsPerUser = null
    ) {
        $this->userId = $userId;
        $this->name = $name;
        $this->description = $description;
        $this->type = $type;
        $this->configuration = $configuration;
        $this->welcomeMessage = $welcomeMessage;
        $this->fallbackMessage = $fallbackMessage;
        $this->maxConversations = $maxConversations;
        $this->maxChatbotsPerUser = $maxChatbotsPerUser;
    }
}