<?php

namespace App\Domains\Leads\Domain;

class Lead
{
    public ?int $id;

    public string $name;

    public string $email;

    public string $status;

    public ?string $phone;

    public ?string $source;

    public ?int $score;

    public ?array $tags;

    public ?array $customFields;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $name,
        string $email,
        string $status = 'new',
        ?string $phone = null,
        ?string $source = null,
        ?int $score = 0,
        ?array $tags = null,
        ?array $customFields = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->status = $status;
        $this->phone = $phone;
        $this->source = $source;
        $this->score = $score;
        $this->tags = $tags;
        $this->customFields = $customFields;
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
            $data['email'],
            $data['status'] ?? 'new',
            $data['phone'] ?? null,
            $data['source'] ?? null,
            $data['score'] ?? 0,
            $data['tags'] ?? null,
            $data['custom_fields'] ?? null,
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
            'email' => $this->email,
            'status' => $this->status,
            'phone' => $this->phone,
            'source' => $this->source,
            'score' => $this->score,
            'tags' => $this->tags,
            'custom_fields' => $this->customFields,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
