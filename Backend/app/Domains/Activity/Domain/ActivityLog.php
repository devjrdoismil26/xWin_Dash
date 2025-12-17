<?php

namespace App\Domains\Activity\Domain;

class ActivityLog
{
    public ?int $id;

    public string $logName;

    public string $description;

    public ?string $subjectType;

    public ?int $subjectId;

    public ?string $causerType;

    public ?int $causerId;

    public array $properties;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $logName,
        string $description,
        ?string $subjectType = null,
        ?int $subjectId = null,
        ?string $causerType = null,
        ?int $causerId = null,
        array $properties = [],
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->logName = $logName;
        $this->description = $description;
        $this->subjectType = $subjectType;
        $this->subjectId = $subjectId;
        $this->causerType = $causerType;
        $this->causerId = $causerId;
        $this->properties = $properties;
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
            $data['log_name'],
            $data['description'],
            $data['subject_type'] ?? null,
            $data['subject_id'] ?? null,
            $data['causer_type'] ?? null,
            $data['causer_id'] ?? null,
            $data['properties'] ?? [],
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
            'log_name' => $this->logName,
            'description' => $this->description,
            'subject_type' => $this->subjectType,
            'subject_id' => $this->subjectId,
            'causer_type' => $this->causerType,
            'causer_id' => $this->causerId,
            'properties' => $this->properties,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
