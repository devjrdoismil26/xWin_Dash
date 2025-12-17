<?php

namespace App\Application\SocialBuffer\Commands;

class CancelScheduleCommand
{
    public function __construct(
        public readonly string $scheduleId,
    ) {
    }
}
