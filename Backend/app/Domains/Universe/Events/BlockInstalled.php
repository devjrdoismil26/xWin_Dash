<?php

namespace App\Domains\Universe\Events;

use App\Domains\Universe\Models\BlockInstallation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BlockInstalled
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public BlockInstallation $installation
    ) {}
}
