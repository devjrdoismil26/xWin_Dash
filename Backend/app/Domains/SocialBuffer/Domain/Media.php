<?php

namespace App\Domains\SocialBuffer\Domain;

class Media
{
    public ?int $id;

    public string $fileName;

    public string $mimeType;

    public string $path;

    public int $size;

    public ?int $userId;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        string $fileName,
        string $mimeType,
        string $path,
        int $size,
        ?int $userId = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->fileName = $fileName;
        $this->mimeType = $mimeType;
        $this->path = $path;
        $this->size = $size;
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
            $data['file_name'],
            $data['mime_type'],
            $data['path'],
            $data['size'],
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
            'file_name' => $this->fileName,
            'mime_type' => $this->mimeType,
            'path' => $this->path,
            'size' => $this->size,
            'user_id' => $this->userId,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
