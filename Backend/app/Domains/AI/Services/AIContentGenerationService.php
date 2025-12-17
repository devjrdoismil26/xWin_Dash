<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Infrastructure\Http\PyLabClient;
use App\Domains\AI\Exceptions\GeminiApiException;
use App\Domains\AI\Exceptions\PyLabException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service especializado para geração de conteúdo multimodal
 *
 * Responsável por gerar conteúdo usando diferentes serviços de IA,
 * incluindo texto, imagem e vídeo.
 */
class AIContentGenerationService
{
    protected GeminiService $geminiService;
    protected PyLabClient $pylabClient;
    protected AIProviderManager $providerManager;

    public function __construct(
        GeminiService $geminiService,
        PyLabClient $pylabClient,
        AIProviderManager $providerManager
    ) {
        $this->geminiService = $geminiService;
        $this->pylabClient = $pylabClient;
        $this->providerManager = $providerManager;
    }

    /**
     * Gera conteúdo multimodal (texto, imagem, vídeo) usando a melhor combinação de serviços
     */
    public function generateMultimodalContent(array $request, ?int $userId = null): array
    {
        $results = [];
        $errors = [];

        try {
            // 1. Geração de texto com Gemini
            if (isset($request['text_prompt']) && !empty($request['text_prompt'])) {
                $results['text'] = $this->generateTextContent($request, $userId);
            }

            // 2. Geração de imagem com PyLab
            if (isset($request['image_prompt']) && !empty($request['image_prompt'])) {
                $results['image'] = $this->generateImageContent($request, $userId);
            }

            // 3. Geração de vídeo com PyLab
            if (isset($request['video_prompt']) && !empty($request['video_prompt'])) {
                $results['video'] = $this->generateVideoContent($request, $userId);
            }

            // 4. Análise de texto se fornecido
            if (isset($request['analyze_text']) && !empty($request['analyze_text'])) {
                $results['analysis'] = $this->analyzeTextContent($request, $userId);
            }

            return [
                'success' => true,
                'results' => $results,
                'errors' => $errors,
                'metadata' => [
                    'generated_at' => now(),
                    'user_id' => $userId,
                    'services_used' => array_keys($results)
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro na geração de conteúdo multimodal', [
                'error' => $exception->getMessage(),
                'request' => $request,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'error' => 'Erro interno na geração de conteúdo',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Gera conteúdo de texto
     */
    private function generateTextContent(array $request, ?int $userId): array
    {
        try {
            return $this->geminiService->generateText(
                $request['text_prompt'],
                $request['text_model'] ?? 'gemini-1.5-pro',
                $userId
            );
        } catch (GeminiApiException $e) {
            Log::error('Erro na geração de texto', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Gera conteúdo de imagem
     */
    private function generateImageContent(array $request, ?int $userId): array
    {
        try {
            $imageRequest = [
                'prompt' => $request['image_prompt'],
                'model' => $request['image_model'] ?? 'sdxl',
                'size' => $request['image_size'] ?? '1024x1024',
                'style' => $request['image_style'] ?? 'realistic',
                'quality' => $request['image_quality'] ?? 'high'
            ];

            return $this->pylabClient->generateImage($imageRequest, $userId);
        } catch (PyLabException $e) {
            Log::error('Erro na geração de imagem', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Gera conteúdo de vídeo
     */
    private function generateVideoContent(array $request, ?int $userId): array
    {
        try {
            $videoRequest = [
                'prompt' => $request['video_prompt'],
                'model' => $request['video_model'] ?? 'modelscope-t2v',
                'duration' => $request['video_duration'] ?? 5,
                'resolution' => $request['video_resolution'] ?? '720p',
                'fps' => $request['video_fps'] ?? 24
            ];

            return $this->pylabClient->generateVideo($videoRequest, $userId);
        } catch (PyLabException $e) {
            Log::error('Erro na geração de vídeo', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Analisa conteúdo de texto
     */
    private function analyzeTextContent(array $request, ?int $userId): array
    {
        try {
            $analysisRequest = [
                'text' => $request['analyze_text'],
                'analysis_type' => $request['analysis_type'] ?? 'comprehensive',
                'language' => $request['language'] ?? 'pt',
                'include_sentiment' => $request['include_sentiment'] ?? true,
                'include_entities' => $request['include_entities'] ?? true,
                'include_keywords' => $request['include_keywords'] ?? true
            ];

            return $this->pylabClient->analyzeText($analysisRequest, $userId);
        } catch (PyLabException $e) {
            Log::error('Erro na análise de texto', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Gera conteúdo otimizado para redes sociais
     */
    public function generateSocialMediaContent(array $request, ?int $userId = null): array
    {
        try {
            $platform = $request['platform'] ?? 'general';
            $contentType = $request['content_type'] ?? 'post';
            $tone = $request['tone'] ?? 'professional';
            $targetAudience = $request['target_audience'] ?? 'general';

            // Gerar prompt otimizado para a plataforma
            $optimizedPrompt = $this->optimizePromptForPlatform($request['prompt'], $platform, $contentType, $tone, $targetAudience);

            // Gerar conteúdo baseado no tipo
            $results = [];

            if ($contentType === 'post' || $contentType === 'caption') {
                $results['text'] = $this->generateSocialMediaText($optimizedPrompt, $platform, $tone, $userId);
            }

            if ($contentType === 'image' || $contentType === 'visual') {
                $results['image'] = $this->generateSocialMediaImage($optimizedPrompt, $platform, $userId);
            }

            if ($contentType === 'video' || $contentType === 'reel') {
                $results['video'] = $this->generateSocialMediaVideo($optimizedPrompt, $platform, $userId);
            }

            // Adicionar hashtags relevantes
            if (isset($results['text'])) {
                $results['hashtags'] = $this->generateRelevantHashtags($results['text'], $platform);
            }

            return [
                'success' => true,
                'content' => $results,
                'metadata' => [
                    'platform' => $platform,
                    'content_type' => $contentType,
                    'tone' => $tone,
                    'target_audience' => $targetAudience,
                    'generated_at' => now(),
                    'user_id' => $userId
                ]
            ];
        } catch (\Throwable $exception) {
            Log::error('Erro na geração de conteúdo para redes sociais', [
                'error' => $exception->getMessage(),
                'request' => $request,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'error' => 'Erro interno na geração de conteúdo para redes sociais',
                'details' => $exception->getMessage()
            ];
        }
    }

    /**
     * Otimiza prompt para a plataforma específica
     */
    private function optimizePromptForPlatform(string $prompt, string $platform, string $contentType, string $tone, string $targetAudience): string
    {
        $platformGuidelines = [
            'instagram' => 'Crie conteúdo visual e envolvente para Instagram',
            'facebook' => 'Crie conteúdo informativo e engajador para Facebook',
            'twitter' => 'Crie conteúdo conciso e impactante para Twitter',
            'linkedin' => 'Crie conteúdo profissional e informativo para LinkedIn',
            'tiktok' => 'Crie conteúdo criativo e viral para TikTok',
            'youtube' => 'Crie conteúdo educativo e envolvente para YouTube'
        ];

        $toneGuidelines = [
            'professional' => 'Use um tom profissional e formal',
            'casual' => 'Use um tom casual e amigável',
            'funny' => 'Use um tom humorístico e divertido',
            'inspirational' => 'Use um tom inspirador e motivacional',
            'educational' => 'Use um tom educativo e informativo'
        ];

        $optimizedPrompt = $prompt;

        if (isset($platformGuidelines[$platform])) {
            $optimizedPrompt .= " " . $platformGuidelines[$platform];
        }

        if (isset($toneGuidelines[$tone])) {
            $optimizedPrompt .= " " . $toneGuidelines[$tone];
        }

        $optimizedPrompt .= " Para o público-alvo: {$targetAudience}";

        return $optimizedPrompt;
    }

    /**
     * Gera texto para redes sociais
     */
    private function generateSocialMediaText(string $prompt, string $platform, string $tone, ?int $userId): array
    {
        $maxLength = $this->getMaxLengthForPlatform($platform);

        $textRequest = [
            'prompt' => $prompt,
            'max_length' => $maxLength,
            'platform' => $platform,
            'tone' => $tone
        ];

        return $this->geminiService->generateText($prompt, 'gemini-1.5-pro', $userId);
    }

    /**
     * Gera imagem para redes sociais
     */
    private function generateSocialMediaImage(string $prompt, string $platform, ?int $userId): array
    {
        $size = $this->getOptimalSizeForPlatform($platform);

        $imageRequest = [
            'prompt' => $prompt,
            'size' => $size,
            'style' => 'social_media',
            'platform' => $platform
        ];

        return $this->pylabClient->generateImage($imageRequest, $userId);
    }

    /**
     * Gera vídeo para redes sociais
     */
    private function generateSocialMediaVideo(string $prompt, string $platform, ?int $userId): array
    {
        $duration = $this->getOptimalDurationForPlatform($platform);
        $resolution = $this->getOptimalResolutionForPlatform($platform);

        $videoRequest = [
            'prompt' => $prompt,
            'duration' => $duration,
            'resolution' => $resolution,
            'platform' => $platform
        ];

        return $this->pylabClient->generateVideo($videoRequest, $userId);
    }

    /**
     * Gera hashtags relevantes
     */
    private function generateRelevantHashtags(string $text, string $platform): array
    {
        $cacheKey = "hashtags_{$platform}_" . md5($text);

        return Cache::remember($cacheKey, 3600, function () use ($text, $platform) {
            // Implementar lógica de geração de hashtags
            // Por enquanto, retorna hashtags genéricas
            return [
                '#ai',
                '#content',
                '#socialmedia',
                '#' . $platform
            ];
        });
    }

    /**
     * Obtém tamanho máximo de texto para a plataforma
     */
    private function getMaxLengthForPlatform(string $platform): int
    {
        return match ($platform) {
            'twitter' => 280,
            'instagram' => 2200,
            'facebook' => 63206,
            'linkedin' => 3000,
            'tiktok' => 2200,
            'youtube' => 5000,
            default => 1000
        };
    }

    /**
     * Obtém tamanho otimizado de imagem para a plataforma
     */
    private function getOptimalSizeForPlatform(string $platform): string
    {
        return match ($platform) {
            'instagram' => '1080x1080',
            'facebook' => '1200x630',
            'twitter' => '1200x675',
            'linkedin' => '1200x627',
            'tiktok' => '1080x1920',
            'youtube' => '1280x720',
            default => '1024x1024'
        };
    }

    /**
     * Obtém duração otimizada de vídeo para a plataforma
     */
    private function getOptimalDurationForPlatform(string $platform): int
    {
        return match ($platform) {
            'tiktok' => 15,
            'instagram' => 30,
            'youtube' => 60,
            'facebook' => 45,
            'twitter' => 30,
            'linkedin' => 60,
            default => 30
        };
    }

    /**
     * Obtém resolução otimizada de vídeo para a plataforma
     */
    private function getOptimalResolutionForPlatform(string $platform): string
    {
        return match ($platform) {
            'tiktok' => '1080x1920',
            'instagram' => '1080x1080',
            'youtube' => '1920x1080',
            'facebook' => '1280x720',
            'twitter' => '1280x720',
            'linkedin' => '1280x720',
            default => '1280x720'
        };
    }
}
