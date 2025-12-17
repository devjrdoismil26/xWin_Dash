<?php

namespace App\Domains\ADStool\DTOs;

use App\Domains\ADStool\Http\Requests\UpdateCampaignRequest;

/**
 * Data Transfer Object para a atualização de uma campanha.
 *
 * Este DTO serve como um contêiner de dados estruturado para o processo de atualização,
 * carregando as informações validadas da camada de requisição para os serviços de domínio.
 * A sua existência, similar ao UpdateADSCampaignDTO, pode servir para contextos distintos
 * dentro do módulo.
 */
class UpdateCampaignDTO
{
    /**
     * @var string|null o nome da campanha
     */
    public ?string $name;

    /**
     * @var string|null o status da campanha
     */
    public ?string $status;

    /**
     * @var float|null o orçamento diário
     */
    public ?float $daily_budget;

    /**
     * @var \DateTime|null a data de início da campanha
     */
    public ?\DateTime $start_date;

    /**
     * @var \DateTime|null a data de término da campanha
     */
    public ?\DateTime $end_date;

    /**
     * Construtor do DTO.
     *
     * @param string|null    $name
     * @param string|null    $status
     * @param float|null     $daily_budget
     * @param \DateTime|null $start_date
     * @param \DateTime|null $end_date
     */
    public function __construct(
        ?string $name,
        ?string $status,
        ?float $daily_budget,
        ?\DateTime $start_date = null,
        ?\DateTime $end_date = null,
    ) {
        $this->name = $name;
        $this->status = $status;
        $this->daily_budget = $daily_budget;
        $this->start_date = $start_date;
        $this->end_date = $end_date;
    }

    /**
     * Cria uma instância do DTO a partir de uma requisição HTTP.
     *
     * @param UpdateCampaignRequest $request
     *
     * @return self
     */
    public static function fromRequest(UpdateCampaignRequest $request): self
    {
        $validatedData = $request->validated();

        return new self(
            $validatedData['name'] ?? null,
            $validatedData['status'] ?? null,
            isset($validatedData['daily_budget']) ? (float) $validatedData['daily_budget'] : null,
            isset($validatedData['start_date']) ? new \DateTime($validatedData['start_date']) : null,
            isset($validatedData['end_date']) ? new \DateTime($validatedData['end_date']) : null,
        );
    }

    /**
     * Converte o DTO para um array, removendo valores nulos.
     *
     * @return array
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'status' => $this->status,
            'daily_budget' => $this->daily_budget,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
        ], fn ($value) => $value !== null);
    }
}
