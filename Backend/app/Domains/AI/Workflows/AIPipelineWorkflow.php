<?php

namespace App\Domains\AI\Workflows;

use App\Domains\AI\Activities\CacheResultActivity;
use App\Domains\AI\Activities\CallAIServiceActivity;
use App\Domains\AI\Activities\ModerateContentActivity;
use App\Domains\AI\Activities\ValidatePromptActivity;

// use App\Domains\Workflows\WorkflowInterface; // Supondo uma interface base para workflows

/**
 * Define um pipeline genérico para tarefas de AI, encadeando atividades.
 */
class AIPipelineWorkflow // implements WorkflowInterface
{
    protected ValidatePromptActivity $validatePromptActivity;

    protected ModerateContentActivity $moderateContentActivity;

    protected CallAIServiceActivity $callAIServiceActivity;

    protected CacheResultActivity $cacheResultActivity;

    public function __construct(
        ValidatePromptActivity $validatePromptActivity,
        ModerateContentActivity $moderateContentActivity,
        CallAIServiceActivity $callAIServiceActivity,
        CacheResultActivity $cacheResultActivity,
    ) {
        $this->validatePromptActivity = $validatePromptActivity;
        $this->moderateContentActivity = $moderateContentActivity;
        $this->callAIServiceActivity = $callAIServiceActivity;
        $this->cacheResultActivity = $cacheResultActivity;
    }

    /**
     * Executa o pipeline de AI.
     *
     * @param string $prompt
     * @param string $providerKey
     * @param array<string, mixed> $options
     *
     * @return mixed o resultado final do pipeline
     *
     * @throws \Exception em caso de falha em qualquer etapa
     */
    public function execute(string $prompt, string $providerKey, array $options = [])
    {
        // 1. Validar o prompt
        $this->validatePromptActivity->execute($prompt);

        // 2. Moderar o conteúdo do prompt
        $this->moderateContentActivity->execute($prompt);

        // 3. Tentar buscar do cache
        $cacheKey = md5($prompt . json_encode($options) . $providerKey);
        $cachedResult = $this->cacheResultActivity->retrieve($cacheKey);
        if ($cachedResult) {
            return $cachedResult;
        }

        // 4. Chamar o serviço de AI
        $aiResponse = $this->callAIServiceActivity->execute($prompt, $providerKey, $options);

        // 5. Moderar a resposta da AI (opcional)
        $this->moderateContentActivity->execute($aiResponse);

        // 6. Armazenar o resultado em cache
        $this->cacheResultActivity->execute($cacheKey, $aiResponse);

        return $aiResponse;
    }
}
