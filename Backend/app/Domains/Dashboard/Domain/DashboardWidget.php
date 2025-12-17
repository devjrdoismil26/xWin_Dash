<?php

namespace App\Domains\Dashboard\Domain;

use DateTime;
use InvalidArgumentException;

/**
 * Dashboard Widget Domain Model
 * 
 * Represents a widget on a dashboard.
 * Encapsulates widget configuration and business rules.
 */
class DashboardWidget
{
    public ?int $id;
    public int $dashboardId;
    public string $type;
    public string $title;
    public ?string $description;
    public array $config;
    public int $position;
    public int $userId;
    public bool $isVisible;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        int $dashboardId,
        string $type,
        string $title,
        array $config = [],
        int $position = 0,
        int $userId = 0,
        bool $isVisible = true,
        ?string $description = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null
    ) {
        $this->validateType($type);
        $this->validateTitle($title);
        $this->validatePosition($position);
        
        $this->id = $id;
        $this->dashboardId = $dashboardId;
        $this->type = $type;
        $this->title = $title;
        $this->description = $description;
        $this->config = $config;
        $this->position = $position;
        $this->userId = $userId;
        $this->isVisible = $isVisible;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    private function validateType(string $type): void
    {
        $validTypes = ['chart', 'table', 'metric', 'list', 'custom'];
        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid widget type. Must be one of: " . implode(', ', $validTypes));
        }
    }

    private function validateTitle(string $title): void
    {
        if (empty(trim($title))) {
            throw new InvalidArgumentException("Widget title cannot be empty");
        }
        if (strlen($title) > 255) {
            throw new InvalidArgumentException("Widget title cannot exceed 255 characters");
        }
    }

    private function validatePosition(int $position): void
    {
        if ($position < 0) {
            throw new InvalidArgumentException("Widget position cannot be negative");
        }
    }

    /**
     * Update widget configuration.
     * 
     * @param array $config
     * @return void
     */
    public function updateConfig(array $config): void
    {
        $this->config = array_merge($this->config, $config);
        $this->updatedAt = new DateTime();
    }

    /**
     * Update widget position.
     * 
     * @param int $position
     * @return void
     */
    public function updatePosition(int $position): void
    {
        $this->validatePosition($position);
        $this->position = $position;
        $this->updatedAt = new DateTime();
    }

    /**
     * Show the widget.
     * 
     * @return void
     */
    public function show(): void
    {
        $this->isVisible = true;
        $this->updatedAt = new DateTime();
    }

    /**
     * Hide the widget.
     * 
     * @return void
     */
    public function hide(): void
    {
        $this->isVisible = false;
        $this->updatedAt = new DateTime();
    }

    /**
     * Get widget summary.
     * 
     * @return array
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'dashboard_id' => $this->dashboardId,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'config' => $this->config,
            'position' => $this->position,
            'user_id' => $this->userId,
            'is_visible' => $this->isVisible,
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s')
        ];
    }
}
