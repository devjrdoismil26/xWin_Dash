<?php

namespace App\Application\SocialBuffer\Commands;

class GetOptimalSchedulingSuggestionsCommand
{
    public int $userId;

    public ?string $platform;

    public ?string $contentType;

    public ?int $numberOfSuggestions;

    public function __construct(int $userId, ?string $platform = null, ?string $contentType = null, ?int $numberOfSuggestions = 5)
    {
        $this->userId = $userId;
        $this->platform = $platform;
        $this->contentType = $contentType;
        $this->numberOfSuggestions = $numberOfSuggestions;
    }
}
