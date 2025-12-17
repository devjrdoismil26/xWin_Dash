<?php

namespace App\Domains\AI\Activities;

use App\Domains\AI\Services\AIQuestionAnsweringService;

// Supondo que este serviço exista

// use App\Domains\Workflows\Activities\BaseActivity;

/**
 * Atividade para responder a uma pergunta usando um serviço de AI.
 */
class AnswerQuestionActivity // extends BaseActivity
{
    protected AIQuestionAnsweringService $qaService;

    public function __construct(AIQuestionAnsweringService $qaService)
    {
        $this->qaService = $qaService;
    }

    /**
     * Executa a atividade de responder a perguntas.
     *
     * @param string      $question a pergunta a ser respondida
     * @param string|null $context  o contexto para a resposta
     *
     * @return string a resposta gerada pela AI
     */
    public function execute(string $question, ?string $context = null): string
    {
        return $this->qaService->answer($question, $context);
    }
}
