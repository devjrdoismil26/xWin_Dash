<?php

namespace App\Domains\AI\Activities;

use App\Domains\AI\Services\AIImageGenerationService;

// Supondo que este serviço exista

// use App\Domains\Workflows\Activities\BaseActivity;

/**
 * Atividade para gerar uma imagem usando um serviço de AI.
 */
class GenerateImageActivity // extends BaseActivity
{
    protected AIImageGenerationService $imageGenerationService;

    public function __construct(AIImageGenerationService $imageGenerationService)
    {
        $this->imageGenerationService = $imageGenerationService;
    }

    /**
     * Executa a atividade de geração de imagem.
     *
     * @param string $prompt  o prompt para a geração da imagem
     * @param array<string, mixed> $options Opções adicionais (tamanho, estilo, etc.).
     *
     * @return string a URL ou base64 da imagem gerada
     */
    public function execute(string $prompt, array $options = []): string
    {
        return $this->imageGenerationService->generate($prompt, $options);
    }
}
