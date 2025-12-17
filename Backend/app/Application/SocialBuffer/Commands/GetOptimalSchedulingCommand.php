<?php

namespace App\Application\SocialBuffer\Commands;

class GetOptimalSchedulingCommand
{
    public int $userId;

    public ?string $platform;

    public ?string $contentType;

    public ?array $targetAudience;

    public function __construct(int $userId, ?string $platform = null, ?string $contentType = null, ?array $targetAudience = null)
    {
        $this->userId = $userId;
        $this->platform = $platform;
        $this->contentType = $contentType;
        $this->targetAudience = $targetAudience;
    }
}
