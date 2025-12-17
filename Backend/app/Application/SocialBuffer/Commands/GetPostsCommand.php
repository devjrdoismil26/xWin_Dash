<?php

namespace App\Application\SocialBuffer\Commands;

class GetPostsCommand
{
    public int $userId;

    public ?array $platforms;

    public ?string $status;

    public ?string $startDate;

    public ?string $endDate;

    public function __construct(int $userId, ?array $platforms = null, ?string $status = null, ?string $startDate = null, ?string $endDate = null)
    {
        $this->userId = $userId;
        $this->platforms = $platforms;
        $this->status = $status;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
}
