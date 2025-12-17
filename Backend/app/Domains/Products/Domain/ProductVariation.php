<?php

namespace App\Domains\Products\Domain;

class ProductVariation
{
    public ?string $id;
    public string $productId;
    public string $name;
    public ?string $description;
    public string $sku;
    public float $price;
    public ?float $comparePrice;
    public ?float $costPrice;
    public int $stockQuantity;
    public bool $trackInventory;
    public string $status;
    public ?float $weight;
    public ?array $dimensions;
    public ?array $images;
    public ?array $attributes;
    public ?array $variationOptions;
    public bool $isDefault;
    public int $sortOrder;
    public string $projectId;
    public string $createdBy;
    public ?\DateTime $createdAt;
    public ?\DateTime $updatedAt;
    public ?\DateTime $deletedAt;

    public function __construct(
        string $productId,
        string $name,
        string $sku,
        float $price,
        string $projectId,
        string $createdBy,
        ?string $description = null,
        ?float $comparePrice = null,
        ?float $costPrice = null,
        int $stockQuantity = 0,
        bool $trackInventory = true,
        string $status = 'active',
        ?float $weight = null,
        ?array $dimensions = null,
        ?array $images = null,
        ?array $attributes = null,
        ?array $variationOptions = null,
        bool $isDefault = false,
        int $sortOrder = 0,
        ?string $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
        ?\DateTime $deletedAt = null,
    ) {
        $this->id = $id;
        $this->productId = $productId;
        $this->name = $name;
        $this->description = $description;
        $this->sku = $sku;
        $this->price = $price;
        $this->comparePrice = $comparePrice;
        $this->costPrice = $costPrice;
        $this->stockQuantity = $stockQuantity;
        $this->trackInventory = $trackInventory;
        $this->status = $status;
        $this->weight = $weight;
        $this->dimensions = $dimensions;
        $this->images = $images;
        $this->attributes = $attributes;
        $this->variationOptions = $variationOptions;
        $this->isDefault = $isDefault;
        $this->sortOrder = $sortOrder;
        $this->projectId = $projectId;
        $this->createdBy = $createdBy;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['product_id'],
            $data['name'],
            $data['sku'],
            $data['price'],
            $data['project_id'],
            $data['created_by'],
            $data['description'] ?? null,
            $data['compare_price'] ?? null,
            $data['cost_price'] ?? null,
            $data['stock_quantity'] ?? 0,
            $data['track_inventory'] ?? true,
            $data['status'] ?? 'active',
            $data['weight'] ?? null,
            $data['dimensions'] ?? null,
            $data['images'] ?? null,
            $data['attributes'] ?? null,
            $data['variation_options'] ?? null,
            $data['is_default'] ?? false,
            $data['sort_order'] ?? 0,
            $data['id'] ?? null,
            isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
            isset($data['deleted_at']) ? new \DateTime($data['deleted_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->productId,
            'name' => $this->name,
            'description' => $this->description,
            'sku' => $this->sku,
            'price' => $this->price,
            'compare_price' => $this->comparePrice,
            'cost_price' => $this->costPrice,
            'stock_quantity' => $this->stockQuantity,
            'track_inventory' => $this->trackInventory,
            'status' => $this->status,
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'images' => $this->images,
            'attributes' => $this->attributes,
            'variation_options' => $this->variationOptions,
            'is_default' => $this->isDefault,
            'sort_order' => $this->sortOrder,
            'project_id' => $this->projectId,
            'created_by' => $this->createdBy,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
            'deleted_at' => $this->deletedAt ? $this->deletedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    /**
     * Verifica se a variação está em estoque.
     */
    public function isInStock(): bool
    {
        return !$this->trackInventory || $this->stockQuantity > 0;
    }

    /**
     * Verifica se a variação é a padrão.
     */
    public function isDefault(): bool
    {
        return $this->isDefault;
    }

    /**
     * Obtém o preço formatado.
     */
    public function getFormattedPrice(): string
    {
        return 'R$ ' . number_format($this->price, 2, ',', '.');
    }

    /**
     * Obtém o preço de comparação formatado.
     */
    public function getFormattedComparePrice(): ?string
    {
        return $this->comparePrice ? 'R$ ' . number_format($this->comparePrice, 2, ',', '.') : null;
    }
}
