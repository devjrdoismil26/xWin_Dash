<?php

namespace App\Domains\EmailMarketing\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * 🏷️ Email List Type Value Object
 *
 * Value Object para tipo de lista de email
 * Encapsula lógica de validação e características específicas
 */
class EmailListType
{
    public const STATIC = 'static';
    public const DYNAMIC = 'dynamic';
    public const SEGMENT = 'segment';

    private const VALID_TYPES = [
        self::STATIC,
        self::DYNAMIC,
        self::SEGMENT
    ];

    private const TYPE_CHARACTERISTICS = [
        self::STATIC => [
            'supports_manual_add' => true,
            'supports_automatic_add' => false,
            'supports_segmentation' => false,
            'supports_custom_fields' => true,
            'supports_tags' => true,
            'supports_analytics' => true,
            'max_subscribers' => 100000,
            'requires_segmentation_rules' => false
        ],
        self::DYNAMIC => [
            'supports_manual_add' => false,
            'supports_automatic_add' => true,
            'supports_segmentation' => true,
            'supports_custom_fields' => true,
            'supports_tags' => true,
            'supports_analytics' => true,
            'max_subscribers' => 500000,
            'requires_segmentation_rules' => true
        ],
        self::SEGMENT => [
            'supports_manual_add' => false,
            'supports_automatic_add' => true,
            'supports_segmentation' => true,
            'supports_custom_fields' => false,
            'supports_tags' => true,
            'supports_analytics' => true,
            'max_subscribers' => 1000000,
            'requires_segmentation_rules' => true
        ]
    ];

    private string $value;

    public function __construct(string $type)
    {
        $this->validate($type);
        $this->value = $type;
    }

    /**
     * Validar tipo
     */
    private function validate(string $type): void
    {
        if (!in_array($type, self::VALID_TYPES)) {
            throw new InvalidArgumentException(
                "Tipo inválido: {$type}. Tipos válidos: " . implode(', ', self::VALID_TYPES)
            );
        }
    }

    /**
     * Verificar se suporta adição manual
     */
    public function supportsManualAdd(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_manual_add'];
    }

    /**
     * Verificar se suporta adição automática
     */
    public function supportsAutomaticAdd(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_automatic_add'];
    }

    /**
     * Verificar se suporta segmentação
     */
    public function supportsSegmentation(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_segmentation'];
    }

    /**
     * Verificar se suporta campos customizados
     */
    public function supportsCustomFields(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_custom_fields'];
    }

    /**
     * Verificar se suporta tags
     */
    public function supportsTags(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_tags'];
    }

    /**
     * Verificar se suporta analytics
     */
    public function supportsAnalytics(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_analytics'];
    }

    /**
     * Obter máximo de subscribers
     */
    public function getMaxSubscribers(): int
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['max_subscribers'];
    }

    /**
     * Verificar se requer regras de segmentação
     */
    public function requiresSegmentationRules(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['requires_segmentation_rules'];
    }

    /**
     * Verificar se é estático
     */
    public function isStatic(): bool
    {
        return $this->value === self::STATIC;
    }

    /**
     * Verificar se é dinâmico
     */
    public function isDynamic(): bool
    {
        return $this->value === self::DYNAMIC;
    }

    /**
     * Verificar se é segmento
     */
    public function isSegment(): bool
    {
        return $this->value === self::SEGMENT;
    }

    /**
     * Obter tipo como string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * Obter tipo em português
     */
    public function getDisplayName(): string
    {
        $names = [
            self::STATIC => 'Estática',
            self::DYNAMIC => 'Dinâmica',
            self::SEGMENT => 'Segmento'
        ];

        return $names[$this->value] ?? $this->value;
    }

    /**
     * Obter descrição do tipo
     */
    public function getDescription(): string
    {
        $descriptions = [
            self::STATIC => 'Lista estática onde subscribers são adicionados manualmente',
            self::DYNAMIC => 'Lista dinâmica onde subscribers são adicionados automaticamente baseado em regras',
            self::SEGMENT => 'Lista de segmento que filtra subscribers de outras listas baseado em critérios'
        ];

        return $descriptions[$this->value] ?? '';
    }

    /**
     * Obter ícone do tipo
     */
    public function getIcon(): string
    {
        $icons = [
            self::STATIC => '📋',
            self::DYNAMIC => '🔄',
            self::SEGMENT => '🎯'
        ];

        return $icons[$this->value] ?? '📋';
    }

    /**
     * Obter cor do tipo
     */
    public function getColor(): string
    {
        $colors = [
            self::STATIC => 'blue',
            self::DYNAMIC => 'green',
            self::SEGMENT => 'purple'
        ];

        return $colors[$this->value] ?? 'gray';
    }

    /**
     * Obter todos os tipos válidos
     */
    public static function getValidTypes(): array
    {
        return self::VALID_TYPES;
    }

    /**
     * Criar tipo static
     */
    public static function static(): self
    {
        return new self(self::STATIC);
    }

    /**
     * Criar tipo dynamic
     */
    public static function dynamic(): self
    {
        return new self(self::DYNAMIC);
    }

    /**
     * Criar tipo segment
     */
    public static function segment(): self
    {
        return new self(self::SEGMENT);
    }

    /**
     * Comparar com outro tipo
     */
    public function equals(EmailListType $other): bool
    {
        return $this->value === $other->value;
    }

    /**
     * Converter para string
     */
    public function __toString(): string
    {
        return $this->value;
    }

    /**
     * Serializar para array
     */
    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'display_name' => $this->getDisplayName(),
            'description' => $this->getDescription(),
            'icon' => $this->getIcon(),
            'color' => $this->getColor(),
            'characteristics' => self::TYPE_CHARACTERISTICS[$this->value]
        ];
    }
}
