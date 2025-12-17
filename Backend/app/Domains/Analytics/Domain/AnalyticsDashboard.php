<?php

namespace App\Domains\Analytics\Domain;

use DateTime;
use InvalidArgumentException;

class AnalyticsDashboard
{
    // Dashboard type constants
    public const TYPE_OVERVIEW = 'overview';
    public const TYPE_TRAFFIC = 'traffic';
    public const TYPE_CONVERSIONS = 'conversions';
    public const TYPE_REVENUE = 'revenue';
    public const TYPE_ADS = 'ads';
    public const TYPE_SOCIAL = 'social';
    public const TYPE_EMAIL = 'email';
    public const TYPE_CUSTOM = 'custom';

    // Widget type constants
    public const WIDGET_METRIC = 'metric';
    public const WIDGET_CHART = 'chart';
    public const WIDGET_TABLE = 'table';
    public const WIDGET_GOAL = 'goal';
    public const WIDGET_ALERT = 'alert';

    public ?int $id;
    public string $userId;
    public string $name;
    public string $type;
    public string $description;
    public array $widgets;
    public array $filters;
    public array $settings;
    public bool $isPublic;
    public bool $isDefault;
    public ?string $shareToken;
    public ?DateTime $lastViewedAt;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $userId,
        string $name,
        string $type,
        string $description = '',
        array $widgets = [],
        array $filters = [],
        array $settings = [],
        bool $isPublic = false,
        bool $isDefault = false,
        ?string $shareToken = null,
        ?DateTime $lastViewedAt = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null
    ) {
        $this->validateUserId($userId);
        $this->validateName($name);
        $this->validateType($type);
        $this->validateWidgets($widgets);

        $this->id = $id;
        $this->userId = $userId;
        $this->name = $name;
        $this->type = $type;
        $this->description = $description;
        $this->widgets = $widgets;
        $this->filters = $filters;
        $this->settings = $settings;
        $this->isPublic = $isPublic;
        $this->isDefault = $isDefault;
        $this->shareToken = $shareToken;
        $this->lastViewedAt = $lastViewedAt;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            name: $data['name'],
            type: $data['type'],
            description: $data['description'] ?? '',
            widgets: $data['widgets'] ?? [],
            filters: $data['filters'] ?? [],
            settings: $data['settings'] ?? [],
            isPublic: (bool) ($data['is_public'] ?? false),
            isDefault: (bool) ($data['is_default'] ?? false),
            shareToken: $data['share_token'] ?? null,
            lastViewedAt: isset($data['last_viewed_at']) ? new DateTime($data['last_viewed_at']) : null,
            id: isset($data['id']) ? (int) $data['id'] : null,
            createdAt: isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            updatedAt: isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'name' => $this->name,
            'type' => $this->type,
            'description' => $this->description,
            'widgets' => $this->widgets,
            'filters' => $this->filters,
            'settings' => $this->settings,
            'is_public' => $this->isPublic,
            'is_default' => $this->isDefault,
            'share_token' => $this->shareToken,
            'last_viewed_at' => $this->lastViewedAt?->format('Y-m-d H:i:s'),
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }

    // ===== VALIDATION METHODS =====

    private function validateUserId(string $userId): void
    {
        if (empty(trim($userId))) {
            throw new InvalidArgumentException('User ID cannot be empty');
        }
    }

    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Dashboard name cannot be empty');
        }

        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Dashboard name cannot exceed 255 characters');
        }
    }

    private function validateType(string $type): void
    {
        $validTypes = [
            self::TYPE_OVERVIEW,
            self::TYPE_TRAFFIC,
            self::TYPE_CONVERSIONS,
            self::TYPE_REVENUE,
            self::TYPE_ADS,
            self::TYPE_SOCIAL,
            self::TYPE_EMAIL,
            self::TYPE_CUSTOM,
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid dashboard type: {$type}");
        }
    }

    private function validateWidgets(array $widgets): void
    {
        foreach ($widgets as $widget) {
            if (!isset($widget['type']) || !isset($widget['id'])) {
                throw new InvalidArgumentException('Each widget must have type and id');
            }

            if (
                !in_array($widget['type'], [
                self::WIDGET_METRIC,
                self::WIDGET_CHART,
                self::WIDGET_TABLE,
                self::WIDGET_GOAL,
                self::WIDGET_ALERT,
                ])
            ) {
                throw new InvalidArgumentException("Invalid widget type: {$widget['type']}");
            }
        }
    }

    // ===== DOMAIN LOGIC METHODS =====

    public function updateName(string $name): void
    {
        $this->validateName($name);
        $this->name = $name;
        $this->updatedAt = new DateTime();
    }

    public function updateDescription(string $description): void
    {
        $this->description = $description;
        $this->updatedAt = new DateTime();
    }

    public function addWidget(array $widget): void
    {
        $this->validateWidgets([$widget]);
        $this->widgets[] = $widget;
        $this->updatedAt = new DateTime();
    }

    public function removeWidget(string $widgetId): void
    {
        $this->widgets = array_filter($this->widgets, function ($widget) use ($widgetId) {
            return $widget['id'] !== $widgetId;
        });
        $this->updatedAt = new DateTime();
    }

    public function updateWidget(string $widgetId, array $widgetData): void
    {
        $this->validateWidgets([$widgetData]);

        foreach ($this->widgets as &$widget) {
            if ($widget['id'] === $widgetId) {
                $widget = array_merge($widget, $widgetData);
                $this->updatedAt = new DateTime();
                return;
            }
        }

        throw new InvalidArgumentException("Widget with ID {$widgetId} not found");
    }

    public function reorderWidgets(array $widgetOrder): void
    {
        $reorderedWidgets = [];
        foreach ($widgetOrder as $widgetId) {
            foreach ($this->widgets as $widget) {
                if ($widget['id'] === $widgetId) {
                    $reorderedWidgets[] = $widget;
                    break;
                }
            }
        }

        $this->widgets = $reorderedWidgets;
        $this->updatedAt = new DateTime();
    }

    public function updateFilters(array $filters): void
    {
        $this->filters = $filters;
        $this->updatedAt = new DateTime();
    }

    public function updateSettings(array $settings): void
    {
        $this->settings = $settings;
        $this->updatedAt = new DateTime();
    }

    public function makePublic(): void
    {
        $this->isPublic = true;
        $this->shareToken = $this->generateShareToken();
        $this->updatedAt = new DateTime();
    }

    public function makePrivate(): void
    {
        $this->isPublic = false;
        $this->shareToken = null;
        $this->updatedAt = new DateTime();
    }

    public function setAsDefault(): void
    {
        $this->isDefault = true;
        $this->updatedAt = new DateTime();
    }

    public function unsetAsDefault(): void
    {
        $this->isDefault = false;
        $this->updatedAt = new DateTime();
    }

    public function markAsViewed(): void
    {
        $this->lastViewedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    private function generateShareToken(): string
    {
        return bin2hex(random_bytes(32));
    }

    // ===== QUERY METHODS =====

    public function isPublic(): bool
    {
        return $this->isPublic;
    }

    public function isDefault(): bool
    {
        return $this->isDefault;
    }

    public function isCustom(): bool
    {
        return $this->type === self::TYPE_CUSTOM;
    }

    public function hasWidgets(): bool
    {
        return !empty($this->widgets);
    }

    public function getWidgetCount(): int
    {
        return count($this->widgets);
    }

    public function getWidgetById(string $widgetId): ?array
    {
        foreach ($this->widgets as $widget) {
            if ($widget['id'] === $widgetId) {
                return $widget;
            }
        }

        return null;
    }

    public function getWidgetsByType(string $type): array
    {
        return array_filter($this->widgets, function ($widget) use ($type) {
            return $widget['type'] === $type;
        });
    }

    public function hasFilters(): bool
    {
        return !empty($this->filters);
    }

    public function hasSettings(): bool
    {
        return !empty($this->settings);
    }

    public function getDaysSinceLastViewed(): ?int
    {
        if (!$this->lastViewedAt) {
            return null;
        }

        $now = new DateTime();
        return $now->diff($this->lastViewedAt)->days;
    }

    public function isRecentlyViewed(int $days = 7): bool
    {
        $daysSinceViewed = $this->getDaysSinceLastViewed();
        return $daysSinceViewed !== null && $daysSinceViewed <= $days;
    }

    // ===== STATIC METHODS =====

    public static function getValidTypes(): array
    {
        return [
            self::TYPE_OVERVIEW,
            self::TYPE_TRAFFIC,
            self::TYPE_CONVERSIONS,
            self::TYPE_REVENUE,
            self::TYPE_ADS,
            self::TYPE_SOCIAL,
            self::TYPE_EMAIL,
            self::TYPE_CUSTOM,
        ];
    }

    public static function getValidWidgetTypes(): array
    {
        return [
            self::WIDGET_METRIC,
            self::WIDGET_CHART,
            self::WIDGET_TABLE,
            self::WIDGET_GOAL,
            self::WIDGET_ALERT,
        ];
    }

    public static function getDefaultWidgetsForType(string $type): array
    {
        $defaultWidgets = [
            self::TYPE_OVERVIEW => [
                ['id' => 'total_visitors', 'type' => self::WIDGET_METRIC, 'title' => 'Total Visitors'],
                ['id' => 'page_views', 'type' => self::WIDGET_METRIC, 'title' => 'Page Views'],
                ['id' => 'bounce_rate', 'type' => self::WIDGET_METRIC, 'title' => 'Bounce Rate'],
                ['id' => 'conversion_rate', 'type' => self::WIDGET_METRIC, 'title' => 'Conversion Rate'],
            ],
            self::TYPE_TRAFFIC => [
                ['id' => 'visitors_chart', 'type' => self::WIDGET_CHART, 'title' => 'Visitors Over Time'],
                ['id' => 'traffic_sources', 'type' => self::WIDGET_TABLE, 'title' => 'Traffic Sources'],
            ],
            self::TYPE_REVENUE => [
                ['id' => 'total_revenue', 'type' => self::WIDGET_METRIC, 'title' => 'Total Revenue'],
                ['id' => 'revenue_chart', 'type' => self::WIDGET_CHART, 'title' => 'Revenue Over Time'],
            ],
        ];

        return $defaultWidgets[$type] ?? [];
    }
}
