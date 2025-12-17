<?php

namespace App\Domains\Categorization\Domain;

class Tag
{
    private string $id;
    private string $name;
    private string $slug;
    private ?string $color;
    private ?string $description;
    private int $usageCount;
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;

    public function __construct(
        string $id,
        string $name,
        string $slug,
        ?string $color = null,
        ?string $description = null,
        int $usageCount = 0,
        ?\DateTimeImmutable $createdAt = null,
        ?\DateTimeImmutable $updatedAt = null
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->slug = $slug;
        $this->color = $color;
        $this->description = $description;
        $this->usageCount = $usageCount;
        $this->createdAt = $createdAt ?? new \DateTimeImmutable();
        $this->updatedAt = $updatedAt ?? new \DateTimeImmutable();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getUsageCount(): int
    {
        return $this->usageCount;
    }

    public function incrementUsage(): void
    {
        $this->usageCount++;
    }

    public function decrementUsage(): void
    {
        if ($this->usageCount > 0) {
            $this->usageCount--;
        }
    }

    public function rename(string $name, string $slug): void
    {
        $this->name = $name;
        $this->slug = $slug;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function changeColor(?string $color): void
    {
        $this->color = $color;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateDescription(?string $description): void
    {
        $this->description = $description;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'color' => $this->color,
            'description' => $this->description,
            'usage_count' => $this->usageCount,
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt->format('Y-m-d H:i:s'),
        ];
    }
}
