<?php

namespace App\Domains\Aura\Events;

use App\Domains\Aura\Models\AuraFlowNode;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuraFlowNodeUpdated
{
    use Dispatchable;
    use SerializesModels;

    public AuraFlowNode $node;

    /**
     * Create a new event instance.
     */
    public function __construct(AuraFlowNode $node)
    {
        $this->node = $node;
    }
}
