<?php

namespace App\Domains\Leads\Domain;

class LeadHistory
{
    public ?int $id;

    public int $leadId;

    public string $eventType;

    public string $description;

    public ?array $properties;

    public ?int $causerId;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $leadId,
        string $eventType,
        string $description,
        ?array $properties = null,
        ?int $causerId = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->leadId = $leadId;
        $this->eventType = $eventType;
        $this->description = $description;
        $this->properties = $properties;
        $this->causerId = $causerId;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
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
            $data['lead_id'],
            $data['event_type'],
            $data['description'],
            $data['properties'] ?? null,
            $data['causer_id'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
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
            'lead_id' => $this->leadId,
            'event_type' => $this->eventType,
            'description' => $this->description,
            'properties' => $this->properties,
            'causer_id' => $this->causerId,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
