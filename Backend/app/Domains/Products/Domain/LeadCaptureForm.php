<?php

namespace App\Domains\Products\Domain;

use DateTime;

class LeadCaptureForm
{
    public ?int $id;
    public string $name;
    public ?string $description;
    public array $fields;
    public ?int $userId;
    public string $projectId;
    public string $title;
    public string $buttonText;
    public string $slug;
    public string $status;
    public ?string $redirectUrl;
    public ?string $webhookUrl;
    public bool $isActive;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $name,
        array $fields,
        string $projectId,
        string $title,
        string $buttonText,
        string $slug,
        string $status,
        bool $isActive,
        ?string $description = null,
        ?string $redirectUrl = null,
        ?string $webhookUrl = null,
        ?int $userId = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->fields = $fields;
        $this->userId = $userId;
        $this->projectId = $projectId;
        $this->title = $title;
        $this->buttonText = $buttonText;
        $this->slug = $slug;
        $this->status = $status;
        $this->redirectUrl = $redirectUrl;
        $this->webhookUrl = $webhookUrl;
        $this->isActive = $isActive;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'],
            $data['fields'] ?? [],
            $data['project_id'],
            $data['title'],
            $data['button_text'],
            $data['slug'],
            $data['status'],
            $data['is_active'],
            $data['description'] ?? null,
            $data['redirect_url'] ?? null,
            $data['webhook_url'] ?? null,
            $data['user_id'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new DateTime($data['updated_at']) : null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'fields' => $this->fields,
            'user_id' => $this->userId,
            'project_id' => $this->projectId,
            'title' => $this->title,
            'button_text' => $this->buttonText,
            'slug' => $this->slug,
            'status' => $this->status,
            'redirect_url' => $this->redirectUrl,
            'webhook_url' => $this->webhookUrl,
            'is_active' => $this->isActive,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }
}
