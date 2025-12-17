<?php

namespace App\Domains\AI\Activities;

use App\Domains\AI\Services\AITextAnalysisService;

// use App\Domains\Workflows\Activities\BaseActivity;

/**
 * Atividade para analisar textos usando um serviço de AI.
 */
class AnalyzeTextActivity // extends BaseActivity
{
    protected AITextAnalysisService $textAnalysisService;

    public function __construct(AITextAnalysisService $textAnalysisService)
    {
        $this->textAnalysisService = $textAnalysisService;
    }

    /**
     * Executa a atividade de análise de texto.
     *
     * @param string $text         o texto a ser analisado
     * @param string $analysisType o tipo de análise (ex: 'sentiment', 'keywords')
     *
     * @return array<string, mixed> o resultado da análise
     */
    public function execute(string $text, string $analysisType): array
    {
        return $this->textAnalysisService->analyze($text, $analysisType);
    }
}
