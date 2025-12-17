<?php

namespace App\Domains\Universe\ValueObjects;

final class EnhancedPrompt
{
    public string $originalPrompt;
    public string $enhancedPrompt;
    public array $improvements;
    public string $mediaType;
    public float $qualityScore;
    public string $suggestedStyle;
    public array $suggestedDimensions;

    /**
     * @var array<string, mixed>
     */
    public array $context;

    /**
     * @param array<string, mixed> $context
     */
    public function __construct(
        string $originalPrompt,
        string $enhancedPrompt,
        array $context = [],
        array $improvements = [],
        string $mediaType = 'text',
        float $qualityScore = 0.0,
        string $suggestedStyle = '',
        array $suggestedDimensions = []
    ) {
        if ($qualityScore < 0 || $qualityScore > 100) {
            throw new \InvalidArgumentException('Quality score must be between 0 and 100');
        }

        if (!in_array($mediaType, ['text', 'image', 'video'])) {
            throw new \InvalidArgumentException('Media type must be either "text", "image" or "video"');
        }

        $this->originalPrompt = $originalPrompt;
        $this->enhancedPrompt = $enhancedPrompt;
        $this->context = $context;
        $this->improvements = $improvements;
        $this->mediaType = $mediaType;
        $this->qualityScore = $qualityScore;
        $this->suggestedStyle = $suggestedStyle;
        $this->suggestedDimensions = $suggestedDimensions;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'original_prompt' => $this->originalPrompt,
            'enhanced_prompt' => $this->enhancedPrompt,
            'context' => $this->context,
            'improvements' => $this->improvements,
            'quality_score' => $this->qualityScore,
            'quality_level' => $this->getQualityLevel(),
            'suggested_style' => $this->suggestedStyle,
            'suggested_dimensions' => $this->suggestedDimensions,
            'media_type' => $this->mediaType,
        ];
    }

    public function __toString(): string
    {
        return $this->enhancedPrompt;
    }

    public function getOriginalPrompt(): string
    {
        return $this->originalPrompt;
    }

    public function getEnhancedPrompt(): string
    {
        return $this->enhancedPrompt;
    }

    public function getQualityScore(): float
    {
        return $this->qualityScore;
    }

    public function getQualityLevel(): string
    {
        if ($this->qualityScore >= 80) {
            return 'excellent';
        } elseif ($this->qualityScore >= 60) {
            return 'good';
        } elseif ($this->qualityScore >= 40) {
            return 'fair';
        } else {
            return 'poor';
        }
    }

    public function isSignificantlyImproved(): bool
    {
        return $this->qualityScore > 70;
    }

    /**
     * Cria um fallback quando o aprimoramento falha.
     */
    public static function fallback(string $originalPrompt, string $mediaType = 'text'): self
    {
        return new self(
            originalPrompt: $originalPrompt,
            enhancedPrompt: $originalPrompt,
            improvements: [],
            mediaType: $mediaType,
            qualityScore: 50.0
        );
    }

    /**
     * Retorna um resumo das melhorias aplicadas.
     */
    public function getImprovementsSummary(): string
    {
        $count = count($this->improvements);
        $summary = "{$count} melhorias aplicadas";
        
        if ($count > 0) {
            $summary .= ': ' . implode(', ', $this->improvements);
        }
        
        return $summary;
    }

    /**
     * Converte para formato de resposta de chat.
     */
    public function toChatResponse(): string
    {
        $response = "Melhorei seu prompt: '{$this->originalPrompt}'\n\n";
        $response .= "Versão aprimorada: '{$this->enhancedPrompt}'\n\n";
        
        if (!empty($this->improvements)) {
            $response .= "Melhorias aplicadas:\n";
            foreach ($this->improvements as $improvement) {
                $response .= "• {$improvement}\n";
            }
        }
        
        $response .= "\nQualidade: {$this->getQualityLevel()} ({$this->qualityScore}%)";
        
        return $response;
    }
}
