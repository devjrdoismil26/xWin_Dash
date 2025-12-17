<?php

namespace App\Domains\AI\Jobs;

use App\Domains\AI\Services\AITextAnalysisService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AnalyzeTextJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected string $text;

    protected string $analysisType;

    protected int $userId;

    /**
     * Create a new job instance.
     *
     * @param string $text
     * @param string $analysisType
     * @param int    $userId
     */
    public function __construct(string $text, string $analysisType, int $userId)
    {
        $this->text = $text;
        $this->analysisType = $analysisType;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     *
     * @param AITextAnalysisService $textAnalysisService
     */
    public function handle(AITextAnalysisService $textAnalysisService): void
    {
        Log::info("Iniciando análise de texto para o usuário {$this->userId} (Tipo: {$this->analysisType})");

        try {
            $result = $textAnalysisService->analyze($this->text, $this->analysisType);

            // Aqui você pode armazenar o resultado no banco de dados,
            // disparar um evento (ex: TextAnalysisCompleted) ou notificar o usuário.
            Log::info("Análise de texto concluída para o usuário {$this->userId}. Resultado: " . json_encode($result));
        } catch (\Exception $e) {
            Log::error("Falha na análise de texto para o usuário {$this->userId}: " . $e->getMessage());
            $this->fail($e);
        }
    }
}
