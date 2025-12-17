<?php

namespace App\Application\SocialBuffer\Commands;

class GetScheduleAnalyticsCommand
{
    public function __construct(
        public readonly array $filters = [],
    ) {
    }
}
