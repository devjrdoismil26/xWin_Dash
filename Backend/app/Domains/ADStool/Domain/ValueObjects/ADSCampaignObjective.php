<?php

namespace App\Domains\ADStool\Domain\ValueObjects;

use InvalidArgumentException;

class ADSCampaignObjective
{
    public const AWARENESS = 'awareness';
    public const TRAFFIC = 'traffic';
    public const ENGAGEMENT = 'engagement';
    public const LEADS = 'leads';
    public const SALES = 'sales';
    public const APP_INSTALLS = 'app_installs';

    private string $value;

    public function __construct(string $objective)
    {
        $this->validate($objective);
        $this->value = $objective;
    }

    public static function awareness(): self
    {
        return new self(self::AWARENESS);
    }

    public static function traffic(): self
    {
        return new self(self::TRAFFIC);
    }

    public static function engagement(): self
    {
        return new self(self::ENGAGEMENT);
    }

    public static function leads(): self
    {
        return new self(self::LEADS);
    }

    public static function sales(): self
    {
        return new self(self::SALES);
    }

    public static function appInstalls(): self
    {
        return new self(self::APP_INSTALLS);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isAwareness(): bool
    {
        return $this->value === self::AWARENESS;
    }

    public function isTraffic(): bool
    {
        return $this->value === self::TRAFFIC;
    }

    public function isEngagement(): bool
    {
        return $this->value === self::ENGAGEMENT;
    }

    public function isLeads(): bool
    {
        return $this->value === self::LEADS;
    }

    public function isSales(): bool
    {
        return $this->value === self::SALES;
    }

    public function isAppInstalls(): bool
    {
        return $this->value === self::APP_INSTALLS;
    }

    public function isTopOfFunnel(): bool
    {
        return in_array($this->value, [self::AWARENESS, self::TRAFFIC]);
    }

    public function isMiddleOfFunnel(): bool
    {
        return in_array($this->value, [self::ENGAGEMENT, self::LEADS]);
    }

    public function isBottomOfFunnel(): bool
    {
        return in_array($this->value, [self::SALES, self::APP_INSTALLS]);
    }

    public function requiresConversionTracking(): bool
    {
        return in_array($this->value, [self::LEADS, self::SALES, self::APP_INSTALLS]);
    }

    public function requiresPixel(): bool
    {
        return in_array($this->value, [self::TRAFFIC, self::LEADS, self::SALES]);
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::AWARENESS => 'Conscientização',
            self::TRAFFIC => 'Tráfego',
            self::ENGAGEMENT => 'Engajamento',
            self::LEADS => 'Leads',
            self::SALES => 'Vendas',
            self::APP_INSTALLS => 'Instalações de App',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::AWARENESS => 'eye',
            self::TRAFFIC => 'users',
            self::ENGAGEMENT => 'heart',
            self::LEADS => 'user-plus',
            self::SALES => 'dollar-sign',
            self::APP_INSTALLS => 'download',
            default => 'target'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::AWARENESS => 'blue',
            self::TRAFFIC => 'green',
            self::ENGAGEMENT => 'purple',
            self::LEADS => 'orange',
            self::SALES => 'red',
            self::APP_INSTALLS => 'indigo',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::AWARENESS => 'Aumentar o conhecimento da marca',
            self::TRAFFIC => 'Direcionar tráfego para o site',
            self::ENGAGEMENT => 'Aumentar engajamento nas redes sociais',
            self::LEADS => 'Gerar leads qualificados',
            self::SALES => 'Aumentar vendas e conversões',
            self::APP_INSTALLS => 'Promover instalações de aplicativo',
            default => 'Objetivo desconhecido'
        };
    }

    public function getFunnelStage(): string
    {
        return match ($this->value) {
            self::AWARENESS => 'top',
            self::TRAFFIC => 'top',
            self::ENGAGEMENT => 'middle',
            self::LEADS => 'middle',
            self::SALES => 'bottom',
            self::APP_INSTALLS => 'bottom',
            default => 'unknown'
        };
    }

    public function getPriority(): int
    {
        return match ($this->value) {
            self::SALES => 1, // Highest priority
            self::LEADS => 2,
            self::APP_INSTALLS => 3,
            self::TRAFFIC => 4,
            self::ENGAGEMENT => 5,
            self::AWARENESS => 6, // Lowest priority
            default => 6
        };
    }

    public function getRecommendedBudget(): float
    {
        return match ($this->value) {
            self::AWARENESS => 50.0,
            self::TRAFFIC => 100.0,
            self::ENGAGEMENT => 75.0,
            self::LEADS => 200.0,
            self::SALES => 300.0,
            self::APP_INSTALLS => 150.0,
            default => 100.0
        };
    }

    public function getKeyMetrics(): array
    {
        return match ($this->value) {
            self::AWARENESS => ['impressions', 'reach', 'frequency', 'cpm'],
            self::TRAFFIC => ['clicks', 'ctr', 'cpc', 'conversions'],
            self::ENGAGEMENT => ['likes', 'comments', 'shares', 'engagement_rate'],
            self::LEADS => ['leads', 'cost_per_lead', 'conversion_rate', 'quality_score'],
            self::SALES => ['sales', 'revenue', 'roas', 'cost_per_sale'],
            self::APP_INSTALLS => ['installs', 'cost_per_install', 'install_rate', 'retention'],
            default => []
        };
    }

    public function equals(ADSCampaignObjective $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $objective): void
    {
        $validObjectives = [
            self::AWARENESS,
            self::TRAFFIC,
            self::ENGAGEMENT,
            self::LEADS,
            self::SALES,
            self::APP_INSTALLS
        ];

        if (!in_array($objective, $validObjectives)) {
            throw new InvalidArgumentException("Invalid ADS campaign objective: {$objective}");
        }
    }
}
