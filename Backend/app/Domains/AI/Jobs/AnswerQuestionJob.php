<?php

namespace App\Domains\AI\Jobs;

use App\Domains\AI\Services\AIQuestionAnsweringService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class AnswerQuestionJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected string $question;

    protected ?string $context;

    protected int $userId;

    /**
     * Create a new job instance.
     *
     * @param string      $question
     * @param string|null $context
     * @param int         $userId
     */
    public function __construct(string $question, ?string $context, int $userId)
    {
        $this->question = $question;
        $this->context = $context;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     *
     * @param AIQuestionAnsweringService $qaService
     */
    public function handle(AIQuestionAnsweringService $qaService): void
    {
        Log::info("Iniciando resposta à pergunta para o usuário {$this->userId}");

        try {
            $answer = $qaService->answer($this->question, $this->context);

            // Aqui você pode armazenar a resposta no banco de dados,
            // disparar um evento (ex: QuestionAnswered) ou notificar o usuário.
            Log::info("Resposta gerada para o usuário {$this->userId}: " . $answer);
        } catch (\Exception $e) {
            Log::error("Falha ao responder à pergunta para o usuário {$this->userId}: " . $e->getMessage());
            $this->fail($e);
        }
    }
}
