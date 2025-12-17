<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\DTOs\CreateAIGenerationDTO;
use App\Domains\AI\Infrastructure\Persistence\Eloquent\AIGenerationRepository;
use App\Domains\AI\Jobs\AnalyzeTextJob;
use App\Domains\AI\Jobs\AnswerQuestionJob;
use App\Domains\AI\Jobs\GenerateImageJob;
use App\Domains\AI\Jobs\GenerateTextJob;
use Illuminate\Support\Facades\Log;

class AIService
{
    protected AIProviderManager $providerManager;

    protected AIGenerationRepository $aiGenerationRepository;

    public function __construct(AIProviderManager $providerManager, AIGenerationRepository $aiGenerationRepository)
    {
        $this->providerManager = $providerManager;
        $this->aiGenerationRepository = $aiGenerationRepository;
    }

    /**
     * Gera conteúdo de AI com base no tipo solicitado.
     *
     * @param array<string, mixed> $data dados da requisição (prompt, type, provider, model, parameters)
     *
     * @return array<string, mixed> o resultado da operação (pode ser um ID de job ou o conteúdo gerado)
     */
    public function generate(array $data): array
    {
        $dto = new CreateAIGenerationDTO(
            $data['user_id'] ?? 1, // Assume user_id se não fornecido
            $data['provider'],
            $data['model'],
            $data['prompt'],
            $data['parameters'] ?? [],
        );

        // Salva o registro da geração no banco de dados
        $aiGeneration = $this->aiGenerationRepository->create([
            'user_id' => $dto->userId,
            'provider' => $dto->provider,
            'model' => $dto->model,
            'prompt' => $dto->prompt,
            'type' => $data['type'], // Tipo de geração (text, image, etc.)
            'status' => 'pending',
            'usage_meta' => [],
        ]);

        // Dispara o job apropriado para processar a geração em segundo plano
        switch ($data['type']) {
            case 'text':
                GenerateTextJob::dispatch($dto->prompt, $dto->parameters, $dto->userId);
                break;
            case 'image':
                GenerateImageJob::dispatch($dto->prompt, $dto->parameters, $dto->userId);
                break;
            case 'question_answer':
                AnswerQuestionJob::dispatch($dto->prompt, $dto->parameters['context'] ?? null, $dto->userId);
                break;
            case 'text_analysis':
                AnalyzeTextJob::dispatch($dto->prompt, $dto->parameters['analysis_type'] ?? 'sentiment', $dto->userId);
                break;
            default:
                Log::warning("Tipo de geração de AI desconhecido: {$data['type']}");
                throw new \InvalidArgumentException("Tipo de geração de AI desconhecido.");
        }

        return ['message' => 'Geração de AI iniciada com sucesso.', 'generation_id' => $aiGeneration->id];
    }

    /**
     * Analisa a intenção de uma mensagem para WhatsApp
     *
     * @param array $messageData
     * @return array
     */
    public function analyzeMessageIntent(array $messageData): array
    {
        try {
            $message = $messageData['message'] ?? '';
            $type = $messageData['type'] ?? 'text';
            $from = $messageData['from'] ?? 'unknown';

            // Prompt para análise de intenção
            $prompt = "Analise a seguinte mensagem de WhatsApp e determine a intenção do usuário:\n\n";
            $prompt .= "Mensagem: {$message}\n";
            $prompt .= "Tipo: {$type}\n\n";
            $prompt .= "Responda em JSON com os seguintes campos:\n";
            $prompt .= "- intent: a intenção principal (greeting, question, complaint, request, goodbye, etc.)\n";
            $prompt .= "- confidence: nível de confiança (0.0 a 1.0)\n";
            $prompt .= "- next_action: ação recomendada (auto_reply, transfer_human, collect_info, etc.)\n";
            $prompt .= "- suggested_response: resposta sugerida (se aplicável)\n";
            $prompt .= "- entities: entidades extraídas (nomes, números, datas, etc.)\n";
            $prompt .= "- sentiment: sentimento (positive, negative, neutral)";

            // Usar OpenAI para análise
            $aiProvider = $this->providerManager->getProvider('openai');
            $response = $aiProvider->generateText($prompt, 'gpt-3.5-turbo');

            // Tentar decodificar JSON da resposta
            $analysis = json_decode($response, true);

            if (!$analysis) {
                // Fallback se não conseguir decodificar JSON
                $analysis = [
                    'intent' => 'unknown',
                    'confidence' => 0.5,
                    'next_action' => 'manual_review',
                    'suggested_response' => null,
                    'entities' => [],
                    'sentiment' => 'neutral'
                ];
            }

            // Salvar análise no banco
            $this->aiGenerationRepository->create([
                'user_id' => auth()->id() ?? 1,
                'provider' => 'openai',
                'model' => 'gpt-3.5-turbo',
                'prompt' => $prompt,
                'type' => 'intent_analysis',
                'status' => 'completed',
                'result' => $response,
                'usage_meta' => [
                    'message_type' => $type,
                    'from_number' => $from,
                    'analysis' => $analysis
                ]
            ]);

            Log::info('Análise de intenção concluída', [
                'from' => $from,
                'intent' => $analysis['intent'] ?? 'unknown',
                'confidence' => $analysis['confidence'] ?? 0.0
            ]);

            return $analysis;
        } catch (\Exception $e) {
            Log::error('Erro na análise de intenção', [
                'error' => $e->getMessage(),
                'message_data' => $messageData
            ]);

            return [
                'intent' => 'unknown',
                'confidence' => 0.0,
                'next_action' => 'manual_review',
                'suggested_response' => null,
                'entities' => [],
                'sentiment' => 'neutral',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Gera texto usando IA de forma síncrona.
     *
     * @param string $prompt
     * @param string $model
     * @param string $provider
     * @return string
     */
    public function generateText(string $prompt, string $model = 'gpt-3.5-turbo', string $provider = 'openai'): string
    {
        Log::info("Generating text with provider: {$provider}, model: {$model}, prompt: {$prompt}");

        try {
            // Usar o provider manager para obter o provider específico
            $aiProvider = $this->providerManager->getProvider($provider);

            // Gerar o texto usando o provider
            $result = $aiProvider->generateText($prompt, $model);

            Log::info("Text generation successful with {$provider}");
            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to generate text with {$provider}: " . $e->getMessage());

            // Fallback para outro provider se disponível
            $fallbackProviders = ['openai', 'gemini', 'anthropic'];
            foreach ($fallbackProviders as $fallbackProvider) {
                if ($fallbackProvider !== $provider) {
                    try {
                        Log::info("Trying fallback provider: {$fallbackProvider}");
                        $fallbackAiProvider = $this->providerManager->getProvider($fallbackProvider);
                        $result = $fallbackAiProvider->generateText($prompt, $model);
                        Log::info("Text generation successful with fallback provider: {$fallbackProvider}");
                        return $result;
                    } catch (\Exception $fallbackException) {
                        Log::warning("Fallback provider {$fallbackProvider} also failed: " . $fallbackException->getMessage());
                        continue;
                    }
                }
            }

            // Se todos os providers falharam, lançar a exceção original
            throw $e;
        }
    }

    /**
     * Test connections to all AI providers
     */
    public function testConnections(): array
    {
        $results = [];
        $providers = ['openai', 'gemini', 'anthropic'];

        foreach ($providers as $provider) {
            try {
                $aiProvider = $this->providerManager->getProvider($provider);
                $results[$provider] = [
                    'status' => 'connected',
                    'message' => 'Connection successful'
                ];
            } catch (\Exception $e) {
                $results[$provider] = [
                    'status' => 'error',
                    'message' => $e->getMessage()
                ];
            }
        }

        return $results;
    }

    /**
     * Get AI usage statistics
     */
    public function getStats(): array
    {
        // Implementar lógica de estatísticas baseada no repositório
        $totalGenerations = $this->aiGenerationRepository->count();
        $totalTokens = $this->aiGenerationRepository->sum('tokens_used') ?? 0;
        $totalCost = $this->aiGenerationRepository->sum('cost') ?? 0;

        return [
            'total_generations' => $totalGenerations,
            'total_tokens' => $totalTokens,
            'total_cost' => $totalCost,
            'favorite_provider' => $this->aiGenerationRepository->getMostUsedProvider(),
            'this_month' => [
                'generations' => $this->aiGenerationRepository->countThisMonth(),
                'tokens' => $this->aiGenerationRepository->sumTokensThisMonth(),
                'cost' => $this->aiGenerationRepository->sumCostThisMonth()
            ],
            'by_provider' => $this->aiGenerationRepository->getStatsByProvider()
        ];
    }
}
