<?php

namespace App\Application\SocialBuffer\Commands;

class GetCalendarViewCommand
{
    public int $userId;

    public string $startDate;

    public string $endDate;

    public ?array $platforms;

    public function __construct(int $userId, string $startDate, string $endDate, ?array $platforms = null)
    {
        $this->userId = $userId;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->platforms = $platforms;
    }
}
