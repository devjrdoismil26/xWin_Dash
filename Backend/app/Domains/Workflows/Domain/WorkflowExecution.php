<?php

namespace App\Domains\Workflows\Domain;

class WorkflowExecution
{
    public ?int $id;

    public int $workflowId;

    public string $status;

    /**
     * @var array<string, mixed>
     */
    public array $payload;

    public ?string $currentNodeId;

    public ?string $errorMessage;

    public ?int $userId;

    public ?\DateTime $startedAt;

    public ?\DateTime $completedAt;

    public ?\DateTime $failedAt;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    /**
     * @param array<string, mixed> $payload
     */
    public function __construct(
        int $workflowId,
        string $status,
        array $payload,
        ?string $currentNodeId = null,
        ?string $errorMessage = null,
        ?int $userId = null,
        ?\DateTime $startedAt = null,
        ?\DateTime $completedAt = null,
        ?\DateTime $failedAt = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->workflowId = $workflowId;
        $this->status = $status;
        $this->payload = $payload;
        $this->currentNodeId = $currentNodeId;
        $this->errorMessage = $errorMessage;
        $this->userId = $userId;
        $this->startedAt = $startedAt;
        $this->completedAt = $completedAt;
        $this->failedAt = $failedAt;
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
            $data['workflow_id'],
            $data['status'] ?? 'pending',
            $data['payload'] ?? [],
            $data['current_node_id'] ?? null,
            $data['error_message'] ?? null,
            $data['user_id'] ?? null,
            isset($data['started_at']) ? new \DateTime($data['started_at']) : null,
            isset($data['completed_at']) ? new \DateTime($data['completed_at']) : null,
            isset($data['failed_at']) ? new \DateTime($data['failed_at']) : null,
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
            'workflow_id' => $this->workflowId,
            'status' => $this->status,
            'payload' => $this->payload,
            'current_node_id' => $this->currentNodeId,
            'error_message' => $this->errorMessage,
            'user_id' => $this->userId,
            'started_at' => $this->startedAt ? $this->startedAt->format('Y-m-d H:i:s') : null,
            'completed_at' => $this->completedAt ? $this->completedAt->format('Y-m-d H:i:s') : null,
            'failed_at' => $this->failedAt ? $this->failedAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
