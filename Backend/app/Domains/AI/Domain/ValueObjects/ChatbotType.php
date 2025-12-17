<?php

namespace App\Domains\AI\Domain\ValueObjects;

use InvalidArgumentException;

class ChatbotType
{
    public const CUSTOMER_SERVICE = 'customer_service';
    public const SALES = 'sales';
    public const SUPPORT = 'support';
    public const LEAD_GENERATION = 'lead_generation';
    public const FAQ = 'faq';
    public const EDUCATIONAL = 'educational';
    public const ENTERTAINMENT = 'entertainment';

    private string $value;

    public function __construct(string $type)
    {
        $this->validate($type);
        $this->value = $type;
    }

    public static function customerService(): self
    {
        return new self(self::CUSTOMER_SERVICE);
    }

    public static function sales(): self
    {
        return new self(self::SALES);
    }

    public static function support(): self
    {
        return new self(self::SUPPORT);
    }

    public static function leadGeneration(): self
    {
        return new self(self::LEAD_GENERATION);
    }

    public static function faq(): self
    {
        return new self(self::FAQ);
    }

    public static function educational(): self
    {
        return new self(self::EDUCATIONAL);
    }

    public static function entertainment(): self
    {
        return new self(self::ENTERTAINMENT);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isCustomerService(): bool
    {
        return $this->value === self::CUSTOMER_SERVICE;
    }

    public function isSales(): bool
    {
        return $this->value === self::SALES;
    }

    public function isSupport(): bool
    {
        return $this->value === self::SUPPORT;
    }

    public function isLeadGeneration(): bool
    {
        return $this->value === self::LEAD_GENERATION;
    }

    public function isFaq(): bool
    {
        return $this->value === self::FAQ;
    }

    public function isEducational(): bool
    {
        return $this->value === self::EDUCATIONAL;
    }

    public function isEntertainment(): bool
    {
        return $this->value === self::ENTERTAINMENT;
    }

    public function isBusinessFocused(): bool
    {
        return in_array($this->value, [
            self::CUSTOMER_SERVICE,
            self::SALES,
            self::SUPPORT,
            self::LEAD_GENERATION
        ]);
    }

    public function isInformationFocused(): bool
    {
        return in_array($this->value, [
            self::FAQ,
            self::EDUCATIONAL
        ]);
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::CUSTOMER_SERVICE => 'Atendimento ao Cliente',
            self::SALES => 'Vendas',
            self::SUPPORT => 'Suporte Técnico',
            self::LEAD_GENERATION => 'Geração de Leads',
            self::FAQ => 'Perguntas Frequentes',
            self::EDUCATIONAL => 'Educacional',
            self::ENTERTAINMENT => 'Entretenimento',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::CUSTOMER_SERVICE => 'headphones',
            self::SALES => 'dollar-sign',
            self::SUPPORT => 'tool',
            self::LEAD_GENERATION => 'user-plus',
            self::FAQ => 'help-circle',
            self::EDUCATIONAL => 'book',
            self::ENTERTAINMENT => 'smile',
            default => 'message-circle'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::CUSTOMER_SERVICE => 'blue',
            self::SALES => 'green',
            self::SUPPORT => 'orange',
            self::LEAD_GENERATION => 'purple',
            self::FAQ => 'gray',
            self::EDUCATIONAL => 'indigo',
            self::ENTERTAINMENT => 'pink',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::CUSTOMER_SERVICE => 'Chatbot para atendimento ao cliente e suporte',
            self::SALES => 'Chatbot focado em vendas e conversão',
            self::SUPPORT => 'Chatbot para suporte técnico e resolução de problemas',
            self::LEAD_GENERATION => 'Chatbot para captura e qualificação de leads',
            self::FAQ => 'Chatbot para responder perguntas frequentes',
            self::EDUCATIONAL => 'Chatbot para ensino e aprendizado',
            self::ENTERTAINMENT => 'Chatbot para entretenimento e diversão',
            default => 'Tipo de chatbot desconhecido'
        };
    }

    public function getDefaultConfiguration(): array
    {
        return match ($this->value) {
            self::CUSTOMER_SERVICE => [
                'max_tokens' => 1000,
                'temperature' => 0.7,
                'response_timeout' => 30,
                'escalation_enabled' => true,
                'sentiment_analysis' => true
            ],
            self::SALES => [
                'max_tokens' => 800,
                'temperature' => 0.8,
                'response_timeout' => 20,
                'conversion_tracking' => true,
                'product_recommendations' => true
            ],
            self::SUPPORT => [
                'max_tokens' => 1200,
                'temperature' => 0.6,
                'response_timeout' => 45,
                'troubleshooting_flow' => true,
                'knowledge_base_integration' => true
            ],
            self::LEAD_GENERATION => [
                'max_tokens' => 600,
                'temperature' => 0.9,
                'response_timeout' => 15,
                'lead_qualification' => true,
                'contact_form_integration' => true
            ],
            self::FAQ => [
                'max_tokens' => 500,
                'temperature' => 0.5,
                'response_timeout' => 10,
                'knowledge_base_search' => true,
                'fallback_to_human' => true
            ],
            self::EDUCATIONAL => [
                'max_tokens' => 1500,
                'temperature' => 0.7,
                'response_timeout' => 60,
                'progress_tracking' => true,
                'adaptive_learning' => true
            ],
            self::ENTERTAINMENT => [
                'max_tokens' => 800,
                'temperature' => 1.0,
                'response_timeout' => 20,
                'personality_mode' => true,
                'joke_generation' => true
            ],
            default => [
                'max_tokens' => 1000,
                'temperature' => 0.7,
                'response_timeout' => 30
            ]
        };
    }

    public function getRequiredFeatures(): array
    {
        return match ($this->value) {
            self::CUSTOMER_SERVICE => ['escalation', 'sentiment_analysis', 'ticket_creation'],
            self::SALES => ['conversion_tracking', 'product_catalog', 'pricing_info'],
            self::SUPPORT => ['troubleshooting', 'knowledge_base', 'screen_sharing'],
            self::LEAD_GENERATION => ['lead_qualification', 'contact_forms', 'crm_integration'],
            self::FAQ => ['knowledge_search', 'fallback_handling', 'feedback_collection'],
            self::EDUCATIONAL => ['progress_tracking', 'quiz_system', 'certification'],
            self::ENTERTAINMENT => ['personality_engine', 'game_integration', 'social_sharing'],
            default => []
        };
    }

    public function getMaxConversations(): int
    {
        return match ($this->value) {
            self::CUSTOMER_SERVICE => 1000,
            self::SALES => 500,
            self::SUPPORT => 2000,
            self::LEAD_GENERATION => 10000,
            self::FAQ => 5000,
            self::EDUCATIONAL => 200,
            self::ENTERTAINMENT => 100,
            default => 1000
        };
    }

    public function getPriority(): int
    {
        return match ($this->value) {
            self::CUSTOMER_SERVICE => 1, // Highest priority
            self::SUPPORT => 2,
            self::SALES => 3,
            self::LEAD_GENERATION => 4,
            self::FAQ => 5,
            self::EDUCATIONAL => 6,
            self::ENTERTAINMENT => 7, // Lowest priority
            default => 5
        };
    }

    public function requiresHumanEscalation(): bool
    {
        return in_array($this->value, [
            self::CUSTOMER_SERVICE,
            self::SUPPORT,
            self::SALES
        ]);
    }

    public function supportsMultiLanguage(): bool
    {
        return in_array($this->value, [
            self::CUSTOMER_SERVICE,
            self::SUPPORT,
            self::FAQ,
            self::EDUCATIONAL
        ]);
    }

    public function requiresTrainingData(): bool
    {
        return in_array($this->value, [
            self::CUSTOMER_SERVICE,
            self::SUPPORT,
            self::FAQ,
            self::EDUCATIONAL
        ]);
    }

    public function equals(ChatbotType $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $type): void
    {
        $validTypes = [
            self::CUSTOMER_SERVICE,
            self::SALES,
            self::SUPPORT,
            self::LEAD_GENERATION,
            self::FAQ,
            self::EDUCATIONAL,
            self::ENTERTAINMENT
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid chatbot type: {$type}");
        }
    }
}
