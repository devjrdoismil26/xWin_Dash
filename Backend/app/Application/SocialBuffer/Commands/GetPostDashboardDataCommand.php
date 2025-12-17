<?php

namespace App\Application\SocialBuffer\Commands;

class GetPostDashboardDataCommand
{
    public function __construct(
        public string $userId,
    ) {
    }
}
