<?php

namespace App\Domains\SocialBuffer\Domain;

use DateTimeImmutable;

class Schedule
{
    public ?int $id;

    public int $postId;

    public DateTimeImmutable $scheduledAt;

    public string $platform;

    public string $status;

    public ?DateTimeImmutable $publishedAt;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $postId,
        DateTimeImmutable $scheduledAt,
        string $platform,
        string $status,
        ?DateTimeImmutable $publishedAt = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->postId = $postId;
        $this->scheduledAt = $scheduledAt;
        $this->platform = $platform;
        $this->status = $status;
        $this->publishedAt = $publishedAt;
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
            $data['post_id'],
            new DateTimeImmutable($data['scheduled_at']),
            $data['platform'],
            $data['status'] ?? 'pending',
            isset($data['published_at']) ? new DateTimeImmutable($data['published_at']) : null,
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
            'post_id' => $this->postId,
            'scheduled_at' => $this->scheduledAt->format('Y-m-d H:i:s'),
            'platform' => $this->platform,
            'status' => $this->status,
            'published_at' => $this->publishedAt ? $this->publishedAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
