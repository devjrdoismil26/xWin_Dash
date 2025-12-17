<?php

namespace App\Domains\Aura\Events;

use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraFlowActivated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public AuraFlowModel $flow) {}
}
