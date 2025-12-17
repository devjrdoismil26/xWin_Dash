<?php

namespace App\Domains\AI\Workflows;

use App\Domains\AI\Activities\AnalyzeTextActivity;
use App\Domains\AI\Activities\CacheResultActivity;
use App\Domains\AI\Activities\ModerateContentActivity;
use App\Domains\AI\Activities\ValidatePromptActivity;

/**
 * Define um workflow para análise de texto usando AI.
 */
class AnalyzeTextWorkflow
{
    protected ValidatePromptActivity $validatePromptActivity;

    protected ModerateContentActivity $moderateContentActivity;

    protected AnalyzeTextActivity $analyzeTextActivity;

    protected CacheResultActivity $cacheResultActivity;

    public function __construct(
        ValidatePromptActivity $validatePromptActivity,
        ModerateContentActivity $moderateContentActivity,
        AnalyzeTextActivity $analyzeTextActivity,
        CacheResultActivity $cacheResultActivity,
    ) {
        $this->validatePromptActivity = $validatePromptActivity;
        $this->moderateContentActivity = $moderateContentActivity;
        $this->analyzeTextActivity = $analyzeTextActivity;
        $this->cacheResultActivity = $cacheResultActivity;
    }

    /**
     * Executa o workflow de análise de texto.
     *
     * @param string $text         o texto a ser analisado
     * @param string $analysisType o tipo de análise (ex: 'sentiment', 'keywords')
     *
     * @return array<string, mixed> o resultado da análise
     *
     * @throws \Exception em caso de falha em qualquer etapa
     */
    public function execute(string $text, string $analysisType): array
    {
        // 1. Validar o texto (usando a atividade de validação de prompt, adaptada)
        $this->validatePromptActivity->execute($text);

        // 2. Moderar o conteúdo do texto
        $this->moderateContentActivity->execute($text);

        // 3. Tentar buscar do cache
        $cacheKey = md5("analyze_text_" . $text . $analysisType);
        $cachedResult = $this->cacheResultActivity->retrieve($cacheKey);
        if ($cachedResult) {
            return $cachedResult;
        }

        // 4. Realizar a análise de texto
        $analysisResult = $this->analyzeTextActivity->execute($text, $analysisType);

        // 5. Armazenar o resultado em cache
        $this->cacheResultActivity->execute($cacheKey, $analysisResult);

        return $analysisResult;
    }
}
