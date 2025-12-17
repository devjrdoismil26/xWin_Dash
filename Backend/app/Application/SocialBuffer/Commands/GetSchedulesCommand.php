<?php

namespace App\Application\SocialBuffer\Commands;

class GetSchedulesCommand
{
    public function __construct(
        public readonly array $filters = [],
    ) {
    }
}
