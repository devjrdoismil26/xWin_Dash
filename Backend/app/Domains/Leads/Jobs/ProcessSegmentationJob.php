<?php

namespace App\Domains\Leads\Jobs;

use App\Domains\Leads\Services\SegmentationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class ProcessSegmentationJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @param SegmentationService $segmentationService
     */
    public function handle(SegmentationService $segmentationService)
    {
        Log::info("Iniciando ProcessSegmentationJob: Processando segmentação de Leads.");

        // Lógica para reavaliar todos os segmentos e sincronizar Leads
        $synchronizedLeadsCount = $segmentationService->synchronizeAllLeadSegments();

        Log::info("ProcessSegmentationJob concluído. {$synchronizedLeadsCount} Leads tiveram seus segmentos sincronizados.");
    }
}
