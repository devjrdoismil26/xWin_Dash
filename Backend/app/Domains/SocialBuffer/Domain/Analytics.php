<?php

namespace App\Domains\SocialBuffer\Domain;

class Analytics
{
    public ?int $id;

    public int $postId;

    public string $platform;

    public int $views;

    public int $clicks;

    public int $likes;

    public int $comments;

    public int $shares;

    public ?\DateTime $createdAt;

    public ?\DateTime $updatedAt;

    public function __construct(
        int $postId,
        string $platform,
        int $views,
        int $clicks,
        int $likes,
        int $comments,
        int $shares,
        ?int $id = null,
        ?\DateTime $createdAt = null,
        ?\DateTime $updatedAt = null,
    ) {
        $this->id = $id;
        $this->postId = $postId;
        $this->platform = $platform;
        $this->views = $views;
        $this->clicks = $clicks;
        $this->likes = $likes;
        $this->comments = $comments;
        $this->shares = $shares;
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
            $data['platform'],
            $data['views'] ?? 0,
            $data['clicks'] ?? 0,
            $data['likes'] ?? 0,
            $data['comments'] ?? 0,
            $data['shares'] ?? 0,
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
            'platform' => $this->platform,
            'views' => $this->views,
            'clicks' => $this->clicks,
            'likes' => $this->likes,
            'comments' => $this->comments,
            'shares' => $this->shares,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
