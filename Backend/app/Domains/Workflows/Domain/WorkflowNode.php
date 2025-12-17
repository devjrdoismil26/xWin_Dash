<?php

namespace App\Domains\Workflows\Domain;

class WorkflowNode
{
    public ?int $id;

    public int $workflowId;

    public string $name;

    public string $type;

    public array $config;

    public int $positionX;

    public int $positionY;

    public ?int $nextNodeId;

    public ?int $trueNodeId;

    public ?int $falseNodeId;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $workflowId,
        string $name,
        string $type,
        array $config,
        int $positionX,
        int $positionY,
        ?int $nextNodeId = null,
        ?int $trueNodeId = null,
        ?int $falseNodeId = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->workflowId = $workflowId;
        $this->name = $name;
        $this->type = $type;
        $this->config = $config;
        $this->positionX = $positionX;
        $this->positionY = $positionY;
        $this->nextNodeId = $nextNodeId;
        $this->trueNodeId = $trueNodeId;
        $this->falseNodeId = $falseNodeId;
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
            $data['name'],
            $data['type'],
            $data['config'] ?? [],
            $data['position_x'] ?? 0,
            $data['position_y'] ?? 0,
            $data['next_node_id'] ?? null,
            $data['true_node_id'] ?? null,
            $data['false_node_id'] ?? null,
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
            'name' => $this->name,
            'type' => $this->type,
            'config' => $this->config,
            'position_x' => $this->positionX,
            'position_y' => $this->positionY,
            'next_node_id' => $this->nextNodeId,
            'true_node_id' => $this->trueNodeId,
            'false_node_id' => $this->falseNodeId,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
