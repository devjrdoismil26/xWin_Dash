<?php

namespace App\Application\SocialBuffer\Commands;

class CreateScheduleCommand
{
    public int $userId;

    public string $name;

    public array $platforms;

    public array $times;

    public ?string $startDate;

    public ?string $endDate;

    public function __construct(int $userId, string $name, array $platforms, array $times, ?string $startDate = null, ?string $endDate = null)
    {
        $this->userId = $userId;
        $this->name = $name;
        $this->platforms = $platforms;
        $this->times = $times;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
}
