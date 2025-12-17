<?php

namespace App\Domains\Analytics\Domain;

class AnalyticReport
{
    public ?int $id;

    public string $name;

    public string $reportType;

    public string $startDate;

    public string $endDate;

    public array $data;

    public int $userId;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $name,
        string $reportType,
        string $startDate,
        string $endDate,
        array $data,
        int $userId,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->reportType = $reportType;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->data = $data;
        $this->userId = $userId;
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
            $data['name'],
            $data['report_type'],
            $data['start_date'],
            $data['end_date'],
            $data['data'] ?? [],
            $data['user_id'],
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
            'name' => $this->name,
            'report_type' => $this->reportType,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
            'data' => $this->data,
            'user_id' => $this->userId,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
