<?php

namespace App\Domains\Projects\Domain;

class LeadCaptureForm
{
    public ?int $id;

    public string $name;

    public ?string $description;

    /** @var array<string, mixed> */
    public array $fields;

    public int $projectId;

    public int $userId;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    /**
     * @param array<string, mixed> $fields
     */
    public function __construct(
        string $name,
        array $fields,
        int $projectId,
        int $userId,
        ?string $description = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->fields = $fields;
        $this->projectId = $projectId;
        $this->userId = $userId;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array<string, mixed> $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'],
            $data['fields'] ?? [],
            $data['project_id'],
            $data['user_id'],
            $data['description'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'fields' => $this->fields,
            'project_id' => $this->projectId,
            'user_id' => $this->userId,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
