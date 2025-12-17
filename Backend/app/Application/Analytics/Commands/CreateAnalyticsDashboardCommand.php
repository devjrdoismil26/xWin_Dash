<?php

namespace App\Application\Analytics\Commands;

class CreateAnalyticsDashboardCommand
{
    public string $userId;
    public string $name;
    public string $type;
    public string $description;
    public array $widgets;
    public array $filters;
    public array $settings;
    public bool $isPublic;
    public bool $isDefault;
    public ?int $maxDashboardsPerUser;

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
        ?int $maxDashboardsPerUser = null
    ) {
        $this->userId = $userId;
        $this->name = $name;
        $this->type = $type;
        $this->description = $description;
        $this->widgets = $widgets;
        $this->filters = $filters;
        $this->settings = $settings;
        $this->isPublic = $isPublic;
        $this->isDefault = $isDefault;
        $this->maxDashboardsPerUser = $maxDashboardsPerUser;
    }
}