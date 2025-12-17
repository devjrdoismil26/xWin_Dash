<?php

namespace App\Domains\Aura\Services\NodeExecutors;

use App\Domains\Aura\Contracts\NodeExecutorInterface;
use App\Domains\Aura\Models\AuraFlowNode;
use App\Domains\Aura\Models\AuraUraSession;

class TransferToHumanNodeExecutor implements NodeExecutorInterface
{
    public function execute(AuraFlowNode $node, AuraUraSession $session, array $input): array
    {
        return [
            'response_message' => null,
            'next_node_id' => null,
            'transfer_to_human' => true,
        ];
    }
}
