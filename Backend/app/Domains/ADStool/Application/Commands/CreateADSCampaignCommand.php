<?php

namespace App\Domains\ADStool\Application\Commands;

use DateTime;

/**
 * Command para criação de campanha ADS
 *
 * Representa a intenção de criar uma nova campanha ADS
 * com todos os dados necessários.
 */
class CreateADSCampaignCommand
{
    private string $name;
    private int $userId;
    private ?string $description;
    private string $status;
    private string $type;
    private float $budget;
    private array $targetAudience;
    private ?array $keywords;
    private ?array $adGroups;
    private ?array $creatives;
    private ?array $settings;
    private ?DateTime $startDate;
    private ?DateTime $endDate;
    private ?int $projectId;
    private ?array $metadata;

    public function __construct(
        string $name,
        int $userId,
        string $type,
        float $budget,
        array $targetAudience,
        ?string $description = null,
        string $status = 'draft',
        ?array $keywords = null,
        ?array $adGroups = null,
        ?array $creatives = null,
        ?array $settings = null,
        ?DateTime $startDate = null,
        ?DateTime $endDate = null,
        ?int $projectId = null,
        ?array $metadata = null
    ) {
        $this->name = $name;
        $this->userId = $userId;
        $this->description = $description;
        $this->status = $status;
        $this->type = $type;
        $this->budget = $budget;
        $this->targetAudience = $targetAudience;
        $this->keywords = $keywords;
        $this->adGroups = $adGroups;
        $this->creatives = $creatives;
        $this->settings = $settings;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->projectId = $projectId;
        $this->metadata = $metadata;
    }

    // Getters
    public function getName(): string
    {
        return $this->name;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getBudget(): float
    {
        return $this->budget;
    }

    public function getTargetAudience(): array
    {
        return $this->targetAudience;
    }

    public function getKeywords(): ?array
    {
        return $this->keywords;
    }

    public function getAdGroups(): ?array
    {
        return $this->adGroups;
    }

    public function getCreatives(): ?array
    {
        return $this->creatives;
    }

    public function getSettings(): ?array
    {
        return $this->settings;
    }

    public function getStartDate(): ?DateTime
    {
        return $this->startDate;
    }

    public function getEndDate(): ?DateTime
    {
        return $this->endDate;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    /**
     * Cria comando a partir de array de dados
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            userId: $data['user_id'],
            type: $data['type'],
            budget: $data['budget'],
            targetAudience: $data['target_audience'],
            description: $data['description'] ?? null,
            status: $data['status'] ?? 'draft',
            keywords: $data['keywords'] ?? null,
            adGroups: $data['ad_groups'] ?? null,
            creatives: $data['creatives'] ?? null,
            settings: $data['settings'] ?? null,
            startDate: isset($data['start_date']) ? new DateTime($data['start_date']) : null,
            endDate: isset($data['end_date']) ? new DateTime($data['end_date']) : null,
            projectId: $data['project_id'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    /**
     * Converte comando para array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'user_id' => $this->userId,
            'description' => $this->description,
            'status' => $this->status,
            'type' => $this->type,
            'budget' => $this->budget,
            'target_audience' => $this->targetAudience,
            'keywords' => $this->keywords,
            'ad_groups' => $this->adGroups,
            'creatives' => $this->creatives,
            'settings' => $this->settings,
            'start_date' => $this->startDate?->format('Y-m-d H:i:s'),
            'end_date' => $this->endDate?->format('Y-m-d H:i:s'),
            'project_id' => $this->projectId,
            'metadata' => $this->metadata
        ];
    }

    /**
     * Valida o comando
     */
    public function validate(): array
    {
        $errors = [];

        if (empty($this->name)) {
            $errors[] = 'Nome é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($this->type)) {
            $errors[] = 'Tipo é obrigatório';
        }

        if ($this->budget <= 0) {
            $errors[] = 'Orçamento deve ser maior que zero';
        }

        if (empty($this->targetAudience)) {
            $errors[] = 'Público-alvo é obrigatório';
        }

        return $errors;
    }

    /**
     * Verifica se o comando é válido
     */
    public function isValid(): bool
    {
        return empty($this->validate());
    }
}
