<?php

namespace App\Domains\EmailMarketing\Jobs;

use App\Domains\EmailMarketing\Domain\EmailSegment;
use App\Domains\EmailMarketing\Services\EmailSegmentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue; // Supondo que a entidade de domínio exista
use Illuminate\Queue\SerializesModels; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class ProcessEmailSegmentJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected EmailSegment $emailSegment;

    /**
     * Create a new job instance.
     *
     * @param EmailSegment $emailSegment
     */
    public function __construct(EmailSegment $emailSegment)
    {
        $this->emailSegment = $emailSegment;
    }

    /**
     * Execute the job.
     *
     * @param EmailSegmentService $emailSegmentService
     */
    public function handle(EmailSegmentService $emailSegmentService)
    {
        Log::info("Processando segmento de e-mail: {$this->emailSegment->name} (ID: {$this->emailSegment->id})");

        // Lógica para avaliar as regras do segmento e identificar os assinantes
        $subscribers = $emailSegmentService->evaluateSegmentRules($this->emailSegment);

        Log::info("Segmento {$this->emailSegment->name} processado. Encontrados " . count($subscribers) . " assinantes.");

        // Aqui você pode, por exemplo, atualizar a lista de assinantes associada ao segmento
        // ou usar esses assinantes para uma campanha.
    }
}
