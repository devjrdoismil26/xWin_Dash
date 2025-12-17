<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Activities\CacheResultActivity;
use App\Domains\AI\Activities\CallAIServiceActivity;
use App\Domains\AI\Activities\ModerateContentActivity;
use App\Domains\AI\Activities\ValidatePromptActivity;
use App\Domains\AI\Models\AIGeneration; // Supondo que o Model exista
use Illuminate\Support\Facades\Log;

class EnterpriseAIOrchestrator
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
     * Orquestra um fluxo de trabalho complexo de geração de texto com validação e moderação.
     *
     * @param string $prompt
     * @param string $providerKey
     * @param array<string, mixed> $options
     * @param int    $userId
     *
     * @return array<string, mixed>
     */
    public function generateTextWithFullWorkflow(string $prompt, string $providerKey, array $options, int $userId): array
    {
        Log::info("Iniciando workflow Enterprise AI para o usuário {$userId}");

        try {
            // 1. Validar o prompt
            $this->validatePromptActivity->execute($prompt);

            // 2. Moderar o conteúdo do prompt
            $this->moderateContentActivity->execute($prompt);

            // 3. Tentar buscar do cache
            $cacheKey = md5($prompt . json_encode($options) . $providerKey);
            $cachedResult = $this->cacheResultActivity->retrieve($cacheKey);
            if ($cachedResult) {
                Log::info("Resultado encontrado no cache para o usuário {$userId}");
                return ['result' => $cachedResult, 'source' => 'cache'];
            }

            // 4. Chamar o serviço de AI
            $aiResponse = $this->callAIServiceActivity->execute($prompt, $providerKey, $options);

            // 5. Moderar a resposta da AI (opcional, mas recomendado)
            $this->moderateContentActivity->execute($aiResponse);

            // 6. Armazenar o resultado em cache
            $this->cacheResultActivity->execute($cacheKey, $aiResponse);

            // 7. Registrar a geração no banco de dados (assumindo que AIGenerationModel existe)
            // AIGeneration::create([
            //     'user_id' => $userId,
            //     'provider' => $providerKey,
            //     'prompt' => $prompt,
            //     'response_content' => $aiResponse,
            //     'status' => 'completed',
            // ]);

            Log::info("Workflow Enterprise AI concluído para o usuário {$userId}");
            return ['result' => $aiResponse, 'source' => 'ai_generation'];
        } catch (\Exception $e) {
            Log::error("Falha no workflow Enterprise AI para o usuário {$userId}: " . $e->getMessage());
            // Aqui você pode disparar um evento de falha ou notificar administradores
            throw $e;
        }
    }
}
