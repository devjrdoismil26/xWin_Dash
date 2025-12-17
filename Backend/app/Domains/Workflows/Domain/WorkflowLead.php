<?php

namespace App\Domains\Workflows\Domain;

class WorkflowLead
{
    public ?int $id;

    public int $workflowId;

    public int $leadId;

    public string $status;

    public ?array $contextData;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $workflowId,
        int $leadId,
        string $status = 'active',
        ?array $contextData = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->workflowId = $workflowId;
        $this->leadId = $leadId;
        $this->status = $status;
        $this->contextData = $contextData;
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
            $data['lead_id'],
            $data['status'] ?? 'active',
            $data['context_data'] ?? null,
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
            'lead_id' => $this->leadId,
            'status' => $this->status,
            'context_data' => $this->contextData,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
