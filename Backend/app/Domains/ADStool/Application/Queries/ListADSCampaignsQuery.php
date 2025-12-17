<?php

namespace App\Domains\ADStool\Application\Queries;

/**
 * Query para listagem de campanhas ADS
 *
 * Representa a consulta para listar campanhas ADS
 * com filtros e paginação.
 */
class ListADSCampaignsQuery
{
    private int $userId;
    private ?string $status;
    private ?string $type;
    private ?string $search;
    private ?array $tags;
    private ?DateTime $startDate;
    private ?DateTime $endDate;
    private ?float $minBudget;
    private ?float $maxBudget;
    private int $limit;
    private int $offset;
    private string $sortBy;
    private string $sortOrder;
    private ?bool $includeAnalytics;
    private ?bool $includeAdGroups;
    private ?bool $includeCreatives;

    public function __construct(
        int $userId,
        ?string $status = null,
        ?string $type = null,
        ?string $search = null,
        ?array $tags = null,
        ?\DateTime $startDate = null,
        ?\DateTime $endDate = null,
        ?float $minBudget = null,
        ?float $maxBudget = null,
        int $limit = 20,
        int $offset = 0,
        string $sortBy = 'created_at',
        string $sortOrder = 'desc',
        ?bool $includeAnalytics = false,
        ?bool $includeAdGroups = false,
        ?bool $includeCreatives = false
    ) {
        $this->userId = $userId;
        $this->status = $status;
        $this->type = $type;
        $this->search = $search;
        $this->tags = $tags;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->minBudget = $minBudget;
        $this->maxBudget = $maxBudget;
        $this->limit = $limit;
        $this->offset = $offset;
        $this->sortBy = $sortBy;
        $this->sortOrder = $sortOrder;
        $this->includeAnalytics = $includeAnalytics;
        $this->includeAdGroups = $includeAdGroups;
        $this->includeCreatives = $includeCreatives;
    }

    // Getters
    public function getUserId(): int
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

    public function getSearch(): ?string
    {
        return $this->search;
    }

    public function getTags(): ?array
    {
        return $this->tags;
    }

    public function getStartDate(): ?\DateTime
    {
        return $this->startDate;
    }

    public function getEndDate(): ?\DateTime
    {
        return $this->endDate;
    }

    public function getMinBudget(): ?float
    {
        return $this->minBudget;
    }

    public function getMaxBudget(): ?float
    {
        return $this->maxBudget;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getOffset(): int
    {
        return $this->offset;
    }

    public function getSortBy(): string
    {
        return $this->sortBy;
    }

    public function getSortOrder(): string
    {
        return $this->sortOrder;
    }

    public function getIncludeAnalytics(): ?bool
    {
        return $this->includeAnalytics;
    }

    public function getIncludeAdGroups(): ?bool
    {
        return $this->includeAdGroups;
    }

    public function getIncludeCreatives(): ?bool
    {
        return $this->includeCreatives;
    }

    /**
     * Cria query a partir de array de dados
     */
    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            status: $data['status'] ?? null,
            type: $data['type'] ?? null,
            search: $data['search'] ?? null,
            tags: $data['tags'] ?? null,
            startDate: isset($data['start_date']) ? new \DateTime($data['start_date']) : null,
            endDate: isset($data['end_date']) ? new \DateTime($data['end_date']) : null,
            minBudget: $data['min_budget'] ?? null,
            maxBudget: $data['max_budget'] ?? null,
            limit: $data['limit'] ?? 20,
            offset: $data['offset'] ?? 0,
            sortBy: $data['sort_by'] ?? 'created_at',
            sortOrder: $data['sort_order'] ?? 'desc',
            includeAnalytics: $data['include_analytics'] ?? false,
            includeAdGroups: $data['include_ad_groups'] ?? false,
            includeCreatives: $data['include_creatives'] ?? false
        );
    }

    /**
     * Converte query para array
     */
    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'status' => $this->status,
            'type' => $this->type,
            'search' => $this->search,
            'tags' => $this->tags,
            'start_date' => $this->startDate?->format('Y-m-d H:i:s'),
            'end_date' => $this->endDate?->format('Y-m-d H:i:s'),
            'min_budget' => $this->minBudget,
            'max_budget' => $this->maxBudget,
            'limit' => $this->limit,
            'offset' => $this->offset,
            'sort_by' => $this->sortBy,
            'sort_order' => $this->sortOrder,
            'include_analytics' => $this->includeAnalytics,
            'include_ad_groups' => $this->includeAdGroups,
            'include_creatives' => $this->includeCreatives
        ];
    }

    /**
     * Valida a query
     */
    public function validate(): array
    {
        $errors = [];

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar status se fornecido
        if ($this->status !== null) {
            $validStatuses = ['draft', 'active', 'paused', 'completed', 'cancelled'];
            if (!in_array($this->status, $validStatuses)) {
                $errors[] = 'Status inválido';
            }
        }

        // Validar tipo se fornecido
        if ($this->type !== null) {
            $validTypes = ['search', 'display', 'video', 'shopping', 'app'];
            if (!in_array($this->type, $validTypes)) {
                $errors[] = 'Tipo inválido';
            }
        }

        // Validar datas se fornecidas
        if ($this->startDate && $this->endDate && $this->startDate > $this->endDate) {
            $errors[] = 'Data de início não pode ser posterior à data de fim';
        }

        // Validar orçamento se fornecido
        if ($this->minBudget !== null && $this->maxBudget !== null && $this->minBudget > $this->maxBudget) {
            $errors[] = 'Orçamento mínimo não pode ser maior que o máximo';
        }

        // Validar paginação
        if ($this->limit <= 0 || $this->limit > 100) {
            $errors[] = 'Limite deve estar entre 1 e 100';
        }

        if ($this->offset < 0) {
            $errors[] = 'Offset não pode ser negativo';
        }

        // Validar ordenação
        $validSortFields = ['created_at', 'updated_at', 'name', 'budget', 'status'];
        if (!in_array($this->sortBy, $validSortFields)) {
            $errors[] = 'Campo de ordenação inválido';
        }

        $validSortOrders = ['asc', 'desc'];
        if (!in_array($this->sortOrder, $validSortOrders)) {
            $errors[] = 'Ordem de ordenação inválida';
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
     * Verifica se há filtros aplicados
     */
    public function hasFilters(): bool
    {
        return $this->status !== null ||
               $this->type !== null ||
               $this->search !== null ||
               $this->tags !== null ||
               $this->startDate !== null ||
               $this->endDate !== null ||
               $this->minBudget !== null ||
               $this->maxBudget !== null;
    }

    /**
     * Verifica se deve incluir dados relacionados
     */
    public function shouldIncludeRelatedData(): bool
    {
        return $this->includeAnalytics || $this->includeAdGroups || $this->includeCreatives;
    }
}
