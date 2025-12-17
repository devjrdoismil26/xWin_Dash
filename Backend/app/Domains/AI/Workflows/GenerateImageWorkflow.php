<?php

namespace App\Domains\AI\Workflows;

use App\Domains\AI\Activities\CacheResultActivity;
use App\Domains\AI\Activities\GenerateImageActivity;
use App\Domains\AI\Activities\ModerateContentActivity;
use App\Domains\AI\Activities\ValidatePromptActivity;

/**
 * Define um workflow para a geração de imagens usando AI.
 */
class GenerateImageWorkflow
{
    protected ValidatePromptActivity $validatePromptActivity;

    protected ModerateContentActivity $moderateContentActivity;

    protected GenerateImageActivity $generateImageActivity;

    protected CacheResultActivity $cacheResultActivity;

    public function __construct(
        ValidatePromptActivity $validatePromptActivity,
        ModerateContentActivity $moderateContentActivity,
        GenerateImageActivity $generateImageActivity,
        CacheResultActivity $cacheResultActivity,
    ) {
        $this->validatePromptActivity = $validatePromptActivity;
        $this->moderateContentActivity = $moderateContentActivity;
        $this->generateImageActivity = $generateImageActivity;
        $this->cacheResultActivity = $cacheResultActivity;
    }

    /**
     * Executa o workflow de geração de imagem.
     *
     * @param string $prompt  o prompt para a geração da imagem
     * @param array<string, mixed> $options Opções adicionais (tamanho, estilo, etc.).
     *
     * @return string a URL ou base64 da imagem gerada
     *
     * @throws \Exception em caso de falha em qualquer etapa
     */
    public function execute(string $prompt, array $options = []): string
    {
        // 1. Validar o prompt
        $this->validatePromptActivity->execute($prompt);

        // 2. Moderar o conteúdo do prompt
        $this->moderateContentActivity->execute($prompt);

        // 3. Tentar buscar do cache
        $cacheKey = md5("generate_image_" . $prompt . json_encode($options));
        $cachedResult = $this->cacheResultActivity->retrieve($cacheKey);
        if ($cachedResult) {
            return $cachedResult;
        }

        // 4. Gerar a imagem
        $imageUrl = $this->generateImageActivity->execute($prompt, $options);

        // 5. Armazenar o resultado em cache
        $this->cacheResultActivity->execute($cacheKey, $imageUrl);

        return $imageUrl;
    }
}
