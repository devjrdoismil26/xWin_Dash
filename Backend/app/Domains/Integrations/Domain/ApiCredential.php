<?php

namespace App\Domains\Integrations\Domain;

class ApiCredential
{
    public ?int $id;

    public string $name;

    public string $platform;

    public array $credentials;

    public ?int $userId;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $name,
        string $platform,
        array $credentials,
        ?int $userId = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->platform = $platform;
        $this->credentials = $credentials;
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
            $data['platform'],
            $data['credentials'] ?? [],
            $data['user_id'] ?? null,
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
            'platform' => $this->platform,
            'credentials' => $this->credentials,
            'user_id' => $this->userId,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
