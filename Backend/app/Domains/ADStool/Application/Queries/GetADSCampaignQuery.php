<?php

namespace App\Domains\ADStool\Application\Queries;

/**
 * Query para obter campanha ADS
 *
 * Representa a consulta para obter uma campanha ADS
 * específica com filtros opcionais.
 */
class GetADSCampaignQuery
{
    private ?int $campaignId;
    private ?int $userId;
    private ?string $status;
    private ?string $type;
    private ?bool $includeAdGroups;
    private ?bool $includeCreatives;
    private ?bool $includeAnalytics;
    private ?array $filters;

    public function __construct(
        ?int $campaignId = null,
        ?int $userId = null,
        ?string $status = null,
        ?string $type = null,
        ?bool $includeAdGroups = false,
        ?bool $includeCreatives = false,
        ?bool $includeAnalytics = false,
        ?array $filters = null
    ) {
        $this->campaignId = $campaignId;
        $this->userId = $userId;
        $this->status = $status;
        $this->type = $type;
        $this->includeAdGroups = $includeAdGroups;
        $this->includeCreatives = $includeCreatives;
        $this->includeAnalytics = $includeAnalytics;
        $this->filters = $filters;
    }

    // Getters
    public function getCampaignId(): ?int
    {
        return $this->campaignId;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function getIncludeAdGroups(): ?bool
    {
        return $this->includeAdGroups;
    }

    public function getIncludeCreatives(): ?bool
    {
        return $this->includeCreatives;
    }

    public function getIncludeAnalytics(): ?bool
    {
        return $this->includeAnalytics;
    }

    public function getFilters(): ?array
    {
        return $this->filters;
    }

    /**
     * Cria query a partir de array de dados
     */
    public static function fromArray(array $data): self
    {
        return new self(
            campaignId: $data['campaign_id'] ?? null,
            userId: $data['user_id'] ?? null,
            status: $data['status'] ?? null,
            type: $data['type'] ?? null,
            includeAdGroups: $data['include_ad_groups'] ?? false,
            includeCreatives: $data['include_creatives'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false,
            filters: $data['filters'] ?? null
        );
    }

    /**
     * Converte query para array
     */
    public function toArray(): array
    {
        return [
            'campaign_id' => $this->campaignId,
            'user_id' => $this->userId,
            'status' => $this->status,
            'type' => $this->type,
            'include_ad_groups' => $this->includeAdGroups,
            'include_creatives' => $this->includeCreatives,
            'include_analytics' => $this->includeAnalytics,
            'filters' => $this->filters
        ];
    }

    /**
     * Valida a query
     */
    public function validate(): array
    {
        $errors = [];

        if ($this->campaignId !== null && $this->campaignId <= 0) {
            $errors[] = 'ID da campanha deve ser maior que zero';
        }

        if ($this->userId !== null && $this->userId <= 0) {
            $errors[] = 'ID do usuário deve ser maior que zero';
        }

        if ($this->status !== null && !in_array($this->status, ['draft', 'active', 'paused', 'completed', 'cancelled'])) {
            $errors[] = 'Status inválido';
        }

        if ($this->type !== null && !in_array($this->type, ['search', 'display', 'video', 'shopping', 'app'])) {
            $errors[] = 'Tipo inválido';
        }

        return $errors;
    }

    /**
     * Verifica se a query é válida
     */
    public function isValid(): bool
    {
        return empty($this->validate());
    }

    /**
     * Verifica se a query tem filtros
     */
    public function hasFilters(): bool
    {
        return $this->campaignId !== null ||
               $this->userId !== null ||
               $this->status !== null ||
               $this->type !== null ||
               !empty($this->filters);
    }

    /**
     * Verifica se deve incluir dados relacionados
     */
    public function shouldIncludeRelatedData(): bool
    {
        return $this->includeAdGroups || $this->includeCreatives || $this->includeAnalytics;
    }
}
