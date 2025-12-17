<?php

namespace App\Domains\AI\Jobs;

use App\Domains\AI\Services\AIImageGenerationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class GenerateImageJob implements ShouldQueue
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
     * @param AIImageGenerationService $imageGenerationService
     */
    public function handle(AIImageGenerationService $imageGenerationService): void
    {
        Log::info("Iniciando geração de imagem para o usuário {$this->userId}");

        try {
            $imageUrl = $imageGenerationService->generate($this->prompt, $this->options);

            // Aqui você pode armazenar a URL da imagem no banco de dados,
            // disparar um evento (ex: ImageGenerated) ou notificar o usuário.
            Log::info("Imagem gerada para o usuário {$this->userId}: " . $imageUrl);
        } catch (\Exception $e) {
            Log::error("Falha na geração de imagem para o usuário {$this->userId}: " . $e->getMessage());
            $this->fail($e);
        }
    }
}
