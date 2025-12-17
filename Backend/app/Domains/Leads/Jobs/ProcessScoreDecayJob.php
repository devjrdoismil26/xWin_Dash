<?php

namespace App\Domains\Leads\Jobs;

use App\Domains\Leads\Services\ScoringService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class ProcessScoreDecayJob implements ShouldQueue
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
     * @param ScoringService $scoringService
     */
    public function handle(ScoringService $scoringService)
    {
        Log::info("Iniciando ProcessScoreDecayJob: Processando decaimento de pontuação de Leads.");

        // Lógica para identificar Leads inativos e aplicar a decaimento da pontuação
        $decayedLeadsCount = $scoringService->decayLeadScores();

        Log::info("ProcessScoreDecayJob concluído. {$decayedLeadsCount} Leads tiveram suas pontuações decaídas.");
    }
}
