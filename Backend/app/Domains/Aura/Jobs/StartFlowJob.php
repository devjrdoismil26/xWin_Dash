<?php

namespace App\Domains\Aura\Jobs;

use App\Domains\Aura\Services\AuraFlowService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class StartFlowJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private string $flowId,
        private string $phoneNumber,
        private array $variables = []
    ) {}

    public function handle(AuraFlowService $flowService): void
    {
        $flowService->startFlow($this->flowId, $this->phoneNumber, $this->variables);
    }
}
