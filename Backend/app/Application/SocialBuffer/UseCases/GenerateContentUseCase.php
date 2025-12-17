<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GenerateContentCommand;
use App\Domains\AI\Services\AITextGenerationService; // Supondo que este serviço exista

class GenerateContentUseCase
{
    protected AITextGenerationService $aiTextGenerationService;

    public function __construct(AITextGenerationService $aiTextGenerationService)
    {
        $this->aiTextGenerationService = $aiTextGenerationService;
    }

    /**
     * Executa o caso de uso para gerar conteúdo de post com IA.
     *
     * @param GenerateContentCommand $command
     *
     * @return string o conteúdo gerado
     */
    public function execute(GenerateContentCommand $command): string
    {
        $prompt = "Gere um post sobre {$command->topic}.";
        if ($command->tone) {
            $prompt .= " O tom deve ser {$command->tone}.";
        }
        if ($command->length) {
            $prompt .= " O comprimento deve ser {$command->length}.";
        }
        if ($command->platform) {
            $prompt .= " Para a plataforma {$command->platform}.";
        }

        return $this->aiTextGenerationService->generate($prompt, [
            // Parâmetros adicionais para a geração de texto, se necessário
        ]);
    }
}
