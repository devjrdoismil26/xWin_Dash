<?php

namespace App\Application\SocialBuffer\Commands;

class SyncAcrossPlatformsCommand
{
    public int $userId;

    public ?array $platforms;

    public ?string $syncType;

    public function __construct(int $userId, ?array $platforms = null, ?string $syncType = 'all')
    {
        $this->userId = $userId;
        $this->platforms = $platforms;
        $this->syncType = $syncType;
    }
}
