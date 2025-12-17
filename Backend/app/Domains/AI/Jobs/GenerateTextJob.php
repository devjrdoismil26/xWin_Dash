<?php

namespace App\Domains\AI\Jobs;

use App\Domains\AI\Services\AITextGenerationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateTextJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected string $prompt;

    /** @var array<string, mixed> */
    protected array $options;

    protected int $userId;

    /**
     * Create a new job instance.
     *
     * @param string $prompt
     * @param array<string, mixed> $options
     * @param int    $userId
     */
    public function __construct(string $prompt, array $options, int $userId)
    {
        $this->prompt = $prompt;
        $this->options = $options;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     *
     * @param AITextGenerationService $textGenerationService
     */
    public function handle(AITextGenerationService $textGenerationService): void
    {
        Log::info("Iniciando geração de texto para o usuário {$this->userId}");

        try {
            $generatedText = $textGenerationService->generate($this->prompt, $this->options);

            // Aqui você pode armazenar o texto gerado no banco de dados,
            // disparar um evento (ex: TextGenerated) ou notificar o usuário.
            Log::info("Texto gerado para o usuário {$this->userId}: " . $generatedText);
        } catch (\Exception $e) {
            Log::error("Falha na geração de texto para o usuário {$this->userId}: " . $e->getMessage());
            $this->fail($e);
        }
    }
}
