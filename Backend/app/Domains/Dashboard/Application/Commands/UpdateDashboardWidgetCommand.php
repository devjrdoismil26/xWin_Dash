<?php

namespace App\Domains\Dashboard\Application\Commands;

class UpdateDashboardWidgetCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly int $widgetId,
        public readonly ?string $name = null,
        public readonly ?array $configuration = null,
        public readonly ?string $description = null,
        public readonly ?int $position = null,
        public readonly ?string $size = null,
        public readonly ?bool $isVisible = null
    ) {
    }

    public function toArray(): array
    {
        $data = ['user_id' => $this->userId];

        if ($this->name !== null) {
            $data['name'] = $this->name;
        }
        if ($this->configuration !== null) {
            $data['configuration'] = $this->configuration;
        }
        if ($this->description !== null) {
            $data['description'] = $this->description;
        }
        if ($this->position !== null) {
            $data['position'] = $this->position;
        }
        if ($this->size !== null) {
            $data['size'] = $this->size;
        }
        if ($this->isVisible !== null) {
            $data['is_visible'] = $this->isVisible;
        }

        return $data;
    }
}
