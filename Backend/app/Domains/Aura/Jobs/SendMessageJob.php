<?php

namespace App\Domains\Aura\Jobs;

use App\Domains\Aura\Services\WhatsAppMessageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private string $connectionId,
        private string $to,
        private string $message,
        private string $type = 'text',
        private array $options = []
    ) {}

    public function handle(WhatsAppMessageService $messageService): void
    {
        $messageService->sendMessage(
            $this->connectionId,
            $this->to,
            $this->message,
            $this->type,
            $this->options
        );
    }
}
