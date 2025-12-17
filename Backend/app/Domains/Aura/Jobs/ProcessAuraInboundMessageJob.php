<?php

namespace App\Domains\Aura\Jobs;

use App\Application\Aura\UseCases\InboundMessageUseCase;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessAuraInboundMessageJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     *
     * @param array<string, mixed> $payload o payload completo do webhook
     */
    public function __construct(protected array $payload)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(InboundMessageUseCase $useCase): void
    {
        $useCase->execute($this->payload);
    }
}
