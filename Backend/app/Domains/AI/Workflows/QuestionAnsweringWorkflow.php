<?php

namespace App\Domains\AI\Workflows;

use App\Domains\AI\Activities\AnswerQuestionActivity;
use App\Domains\AI\Activities\CacheResultActivity;
use App\Domains\AI\Activities\ModerateContentActivity;
use App\Domains\AI\Activities\ValidatePromptActivity;

/**
 * Define um workflow completo para responder a perguntas usando AI.
 */
class QuestionAnsweringWorkflow
{
    protected ValidatePromptActivity $validatePromptActivity;

    protected ModerateContentActivity $moderateContentActivity;

    protected AnswerQuestionActivity $answerQuestionActivity;

    protected CacheResultActivity $cacheResultActivity;

    public function __construct(
        ValidatePromptActivity $validatePromptActivity,
        ModerateContentActivity $moderateContentActivity,
        AnswerQuestionActivity $answerQuestionActivity,
        CacheResultActivity $cacheResultActivity,
    ) {
        $this->validatePromptActivity = $validatePromptActivity;
        $this->moderateContentActivity = $moderateContentActivity;
        $this->answerQuestionActivity = $answerQuestionActivity;
        $this->cacheResultActivity = $cacheResultActivity;
    }

    /**
     * Executa o workflow de resposta a perguntas.
     *
     * @param string      $question a pergunta a ser respondida
     * @param string|null $context  o contexto para a resposta
     *
     * @return string a resposta gerada pela AI
     *
     * @throws \Exception em caso de falha em qualquer etapa
     */
    public function execute(string $question, ?string $context = null): string
    {
        // 1. Validar a pergunta
        $this->validatePromptActivity->execute($question);

        // 2. Moderar o conteúdo da pergunta
        $this->moderateContentActivity->execute($question);

        // 3. Tentar buscar do cache
        $cacheKey = md5("qa_" . $question . ($context ?? ''));
        $cachedResult = $this->cacheResultActivity->retrieve($cacheKey);
        if ($cachedResult) {
            return $cachedResult;
        }

        // 4. Responder à pergunta
        $answer = $this->answerQuestionActivity->execute($question, $context);

        // 5. Moderar a resposta da AI (opcional)
        $this->moderateContentActivity->execute($answer);

        // 6. Armazenar o resultado em cache
        $this->cacheResultActivity->execute($cacheKey, $answer);

        return $answer;
    }
}
