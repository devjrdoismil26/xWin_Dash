<?php

namespace App\Domains\Workflows\Domain;

class WorkflowLog
{
    public ?int $id;

    public int $workflowExecutionId;

    public string $nodeId;

    public string $eventType;

    public string $message;

    public array $payload;

    public string $status;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $workflowExecutionId,
        string $nodeId,
        string $eventType,
        string $message,
        array $payload,
        string $status,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->workflowExecutionId = $workflowExecutionId;
        $this->nodeId = $nodeId;
        $this->eventType = $eventType;
        $this->message = $message;
        $this->payload = $payload;
        $this->status = $status;
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
            $data['workflow_execution_id'],
            $data['node_id'],
            $data['event_type'],
            $data['message'],
            $data['payload'] ?? [],
            $data['status'] ?? 'info',
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
            'workflow_execution_id' => $this->workflowExecutionId,
            'node_id' => $this->nodeId,
            'event_type' => $this->eventType,
            'message' => $this->message,
            'payload' => $this->payload,
            'status' => $this->status,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
