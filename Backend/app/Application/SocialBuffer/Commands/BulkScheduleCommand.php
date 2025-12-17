<?php

namespace App\Application\SocialBuffer\Commands;

class BulkScheduleCommand
{
    public int $userId;

    public array $postsData;

    public function __construct(int $userId, array $postsData)
    {
        $this->userId = $userId;
        $this->postsData = $postsData;
    }
}
