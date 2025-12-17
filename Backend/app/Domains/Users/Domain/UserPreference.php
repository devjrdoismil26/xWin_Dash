<?php

namespace App\Domains\Users\Domain;

class UserPreference
{
    public ?int $id;

    public int $userId;

    public string $theme;

    public bool $notificationsEnabled;

    public string $language;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $userId,
        string $theme = 'light',
        bool $notificationsEnabled = true,
        string $language = 'en',
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->userId = $userId;
        $this->theme = $theme;
        $this->notificationsEnabled = $notificationsEnabled;
        $this->language = $language;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array{id?:int,user_id:int,theme?:string,notifications_enabled?:bool,language?:string,created_at?:string,updated_at?:string} $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['user_id'],
            $data['theme'] ?? 'light',
            $data['notifications_enabled'] ?? true,
            $data['language'] ?? 'en',
            $data['id'] ?? null,
            isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array{id:int|null,user_id:int,theme:string,notifications_enabled:bool,language:string,created_at:string|null,updated_at:string|null}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'theme' => $this->theme,
            'notifications_enabled' => $this->notificationsEnabled,
            'language' => $this->language,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
