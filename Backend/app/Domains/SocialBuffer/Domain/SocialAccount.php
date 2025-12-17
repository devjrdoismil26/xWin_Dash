<?php

namespace App\Domains\SocialBuffer\Domain;

class SocialAccount
{
    public ?int $id;

    public int $userId;

    public string $platform;

    public string $platformUserId;

    public string $username;

    public string $accessToken;

    public ?string $refreshToken;

    public ?\DateTime $expiresAt;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $userId,
        string $platform,
        string $platformUserId,
        string $username,
        string $accessToken,
        ?string $refreshToken = null,
        ?\DateTime $expiresAt = null,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->userId = $userId;
        $this->platform = $platform;
        $this->platformUserId = $platformUserId;
        $this->username = $username;
        $this->accessToken = $accessToken;
        $this->refreshToken = $refreshToken;
        $this->expiresAt = $expiresAt;
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
            $data['user_id'],
            $data['platform'],
            $data['platform_user_id'],
            $data['username'],
            $data['access_token'],
            $data['refresh_token'] ?? null,
            isset($data['expires_at']) ? new \DateTime($data['expires_at']) : null,
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
            'user_id' => $this->userId,
            'platform' => $this->platform,
            'platform_user_id' => $this->platformUserId,
            'username' => $this->username,
            'access_token' => $this->accessToken,
            'refresh_token' => $this->refreshToken,
            'expires_at' => $this->expiresAt ? $this->expiresAt->format('Y-m-d H:i:s') : null,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
