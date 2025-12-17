<?php

namespace App\Domains\ADStool\DTOs;

use App\Domains\ADStool\Http\Requests\IndexCampaignRequest;

/**
 * Data Transfer Object para encapsular os filtros de busca de campanhas.
 *
 * Este DTO carrega os parâmetros de filtragem da requisição HTTP para a camada de serviço,
 * permitindo que o repositório construa uma query de busca de forma limpa e organizada.
 */
class CampaignFiltersDTO
{
    /**
     * @var string|null
     */
    public ?string $searchTerm;

    /**
     * @var string|null
     */
    public ?string $status;

    /**
     * @var string|null
     */
    public ?string $platform;

    /**
     * @var \DateTime|null
     */
    public ?\DateTime $startDate;

    /**
     * @var \DateTime|null
     */
    public ?\DateTime $endDate;

    /**
     * @param string|null    $searchTerm
     * @param string|null    $status
     * @param string|null    $platform
     * @param \DateTime|null $startDate
     * @param \DateTime|null $endDate
     */
    public function __construct(
        ?string $searchTerm = null,
        ?string $status = null,
        ?string $platform = null,
        ?\DateTime $startDate = null,
        ?\DateTime $endDate = null,
    ) {
        $this->searchTerm = $searchTerm;
        $this->status = $status;
        $this->platform = $platform;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
     * Cria uma instância do DTO a partir de uma requisição HTTP.
     *
     * @param IndexCampaignRequest $request
     *
     * @return self
     */
    public static function fromRequest(IndexCampaignRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            $validated['search'] ?? null,
            $validated['status'] ?? null,
            $validated['platform'] ?? null,
            isset($validated['start_date']) ? new \DateTime($validated['start_date']) : null,
            isset($validated['end_date']) ? new \DateTime($validated['end_date']) : null,
        );
    }

    /**
     * @return bool
     */
    public function hasFilters(): bool
    {
        return !is_null($this->searchTerm)
            || !is_null($this->status)
            || !is_null($this->platform)
            || !is_null($this->startDate)
            || !is_null($this->endDate);
    }

    /**
     * @return array
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'search' => $this->searchTerm,
            'status' => $this->status,
            'platform' => $this->platform,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
        ], fn ($value) => !is_null($value));
    }
}
