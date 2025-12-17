<?php

namespace App\Application\SocialBuffer\Commands;

class GetOptimalPostingTimesCommand
{
    public int $userId;

    public ?string $platform;

    public ?string $contentType;

    public ?int $daysInAdvance;

    public function __construct(int $userId, ?string $platform = null, ?string $contentType = null, ?int $daysInAdvance = 7)
    {
        $this->userId = $userId;
        $this->platform = $platform;
        $this->contentType = $contentType;
        $this->daysInAdvance = $daysInAdvance;
    }
}
