<?php

namespace App\Domains\Workflows\Domain;

class WorkflowVersion
{
    public ?int $id;

    public int $workflowId;

    public int $versionNumber;

    public array $definition;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $workflowId,
        int $versionNumber,
        array $definition,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->workflowId = $workflowId;
        $this->versionNumber = $versionNumber;
        $this->definition = $definition;
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
            $data['workflow_id'],
            $data['version_number'],
            $data['definition'] ?? [],
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
            'workflow_id' => $this->workflowId,
            'version_number' => $this->versionNumber,
            'definition' => $this->definition,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
