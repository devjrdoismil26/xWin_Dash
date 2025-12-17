<?php

namespace App\Domains\Products\Domain;

use DateTime;

class Product
{
    public ?int $id;
    public string $name;
    public ?string $description;
    public float $price;
    public ?int $stock;
    public ?int $userId;
    public string $projectId;
    public string $status;
    public ?string $sku;
    public ?string $imageUrl;
    public ?string $categoryId;
    public ?array $tags;
    public ?float $weight;
    public ?array $dimensions;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $name,
        float $price,
        string $projectId,
        string $status,
        ?string $description = null,
        ?int $stock = null,
        ?string $sku = null,
        ?string $imageUrl = null,
        ?string $categoryId = null,
        ?array $tags = null,
        ?float $weight = null,
        ?array $dimensions = null,
        ?int $userId = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->price = $price;
        $this->stock = $stock;
        $this->userId = $userId;
        $this->projectId = $projectId;
        $this->status = $status;
        $this->sku = $sku;
        $this->imageUrl = $imageUrl;
        $this->categoryId = $categoryId;
        $this->tags = $tags;
        $this->weight = $weight;
        $this->dimensions = $dimensions;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'],
            $data['price'],
            $data['project_id'],
            $data['status'],
            $data['description'] ?? null,
            $data['stock'] ?? null,
            $data['sku'] ?? null,
            $data['image_url'] ?? null,
            $data['category_id'] ?? null,
            $data['tags'] ?? null,
            $data['weight'] ?? null,
            $data['dimensions'] ?? null,
            $data['user_id'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new DateTime($data['updated_at']) : null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'user_id' => $this->userId,
            'project_id' => $this->projectId,
            'status' => $this->status,
            'sku' => $this->sku,
            'image_url' => $this->imageUrl,
            'category_id' => $this->categoryId,
            'tags' => $this->tags,
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
