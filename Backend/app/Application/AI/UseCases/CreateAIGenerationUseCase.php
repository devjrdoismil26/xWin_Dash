<?php

namespace App\Application\AI\UseCases;

use App\Application\AI\Commands\CreateAIGenerationCommand;
use App\Domains\AI\Services\AIService; // Supondo que este serviço exista

class CreateAIGenerationUseCase
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Executa o caso de uso para criar uma nova geração de AI.
     *
     * @param CreateAIGenerationCommand $command
     *
     * @return mixed o resultado da criação da geração de AI
     */
    public function execute(CreateAIGenerationCommand $command)
    {
        return $this->aiService->generate([
            'user_id' => $command->userId,
            'type' => $command->type,
            'prompt' => $command->prompt,
            'provider' => $command->provider,
            'model' => $command->model,
            'parameters' => $command->parameters,
        ]);
    }
}
