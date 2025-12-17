<?php

namespace App\Domains\ADStool\Application\Commands;

use DateTime;

/**
 * Command para atualização de campanha ADS
 *
 * Representa a intenção de atualizar uma campanha ADS
 * existente com novos dados.
 */
class UpdateADSCampaignCommand
{
    private int $campaignId;
    private ?string $name;
    private ?string $description;
    private ?string $status;
    private ?string $type;
    private ?float $budget;
    private ?array $targetAudience;
    private ?array $keywords;
    private ?array $adGroups;
    private ?array $creatives;
    private ?array $settings;
    private ?DateTime $startDate;
    private ?DateTime $endDate;
    private ?array $metadata;

    public function __construct(
        int $campaignId,
        ?string $name = null,
        ?string $description = null,
        ?string $status = null,
        ?string $type = null,
        ?float $budget = null,
        ?array $targetAudience = null,
        ?array $keywords = null,
        ?array $adGroups = null,
        ?array $creatives = null,
        ?array $settings = null,
        ?DateTime $startDate = null,
        ?DateTime $endDate = null,
        ?array $metadata = null
    ) {
        $this->campaignId = $campaignId;
        $this->name = $name;
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
        $this->metadata = $metadata;
    }

    // Getters
    public function getCampaignId(): int
    {
        return $this->campaignId;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function getBudget(): ?float
    {
        return $this->budget;
    }

    public function getTargetAudience(): ?array
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
            campaignId: $data['campaign_id'],
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            status: $data['status'] ?? null,
            type: $data['type'] ?? null,
            budget: $data['budget'] ?? null,
            targetAudience: $data['target_audience'] ?? null,
            keywords: $data['keywords'] ?? null,
            adGroups: $data['ad_groups'] ?? null,
            creatives: $data['creatives'] ?? null,
            settings: $data['settings'] ?? null,
            startDate: isset($data['start_date']) ? new DateTime($data['start_date']) : null,
            endDate: isset($data['end_date']) ? new DateTime($data['end_date']) : null,
            metadata: $data['metadata'] ?? null
        );
    }

    /**
     * Converte comando para array
     */
    public function toArray(): array
    {
        return [
            'campaign_id' => $this->campaignId,
            'name' => $this->name,
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
            'metadata' => $this->metadata
        ];
    }

    /**
     * Valida o comando
     */
    public function validate(): array
    {
        $errors = [];

        if ($this->campaignId <= 0) {
            $errors[] = 'ID da campanha é obrigatório';
        }

        // Validar nome se fornecido
        if ($this->name !== null) {
            if (strlen($this->name) < 3) {
                $errors[] = 'Nome da campanha deve ter pelo menos 3 caracteres';
            }
            if (strlen($this->name) > 100) {
                $errors[] = 'Nome da campanha deve ter no máximo 100 caracteres';
            }
        }

        // Validar tipo se fornecido
        if ($this->type !== null) {
            $validTypes = ['search', 'display', 'video', 'shopping', 'app'];
            if (!in_array($this->type, $validTypes)) {
                $errors[] = 'Tipo de campanha inválido';
            }
        }

        // Validar status se fornecido
        if ($this->status !== null) {
            $validStatuses = ['draft', 'active', 'paused', 'completed', 'cancelled'];
            if (!in_array($this->status, $validStatuses)) {
                $errors[] = 'Status inválido';
            }
        }

        // Validar orçamento se fornecido
        if ($this->budget !== null && $this->budget < 0) {
            $errors[] = 'Orçamento não pode ser negativo';
        }

        // Validar datas se fornecidas
        if ($this->startDate && $this->endDate && $this->startDate > $this->endDate) {
            $errors[] = 'Data de início não pode ser posterior à data de fim';
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

    /**
     * Verifica se há dados para atualizar
     */
    public function hasUpdates(): bool
    {
        return $this->name !== null ||
               $this->description !== null ||
               $this->status !== null ||
               $this->type !== null ||
               $this->budget !== null ||
               $this->targetAudience !== null ||
               $this->keywords !== null ||
               $this->adGroups !== null ||
               $this->creatives !== null ||
               $this->settings !== null ||
               $this->startDate !== null ||
               $this->endDate !== null ||
               $this->metadata !== null;
    }
}
