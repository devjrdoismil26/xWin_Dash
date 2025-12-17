<?php

namespace App\Domains\ADStool\DTOs;

use App\Domains\ADStool\Http\Requests\UpdateCampaignRequest;

/**
 * Data Transfer Object para a atualização de uma campanha de anúncios.
 *
 * Este objeto carrega os dados validados desde a camada de requisição (Http)
 * até a camada de serviço e domínio, garantindo um transporte de dados
 * estruturado e previsível.
 */
class UpdateADSCampaignDTO
{
    /**
     * @var string|null o nome da campanha
     */
    public ?string $name;

    /**
     * @var string|null o status da campanha (ex: 'ACTIVE', 'PAUSED')
     */
    public ?string $status;

    /**
     * @var float|null o orçamento diário da campanha
     */
    public ?float $daily_budget;

    /**
     * @var float|null o orçamento vitalício da campanha
     */
    public ?float $lifetime_budget;

    /**
     * Construtor do DTO.
     *
     * @param string|null $name
     * @param string|null $status
     * @param float|null  $daily_budget
     * @param float|null  $lifetime_budget
     */
    public function __construct(
        ?string $name,
        ?string $status,
        ?float $daily_budget,
        ?float $lifetime_budget,
    ) {
        $this->name = $name;
        $this->status = $status;
        $this->daily_budget = $daily_budget;
        $this->lifetime_budget = $lifetime_budget;
    }

    /**
     * Método estático para criar uma instância do DTO a partir de uma requisição validada.
     *
     * @param UpdateCampaignRequest $request a requisição HTTP validada
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
            isset($validatedData['lifetime_budget']) ? (float) $validatedData['lifetime_budget'] : null,
        );
    }

    /**
     * Converte o DTO para um array, útil para passar para o método de update do repositório.
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
            'lifetime_budget' => $this->lifetime_budget,
        ], fn ($value) => $value !== null);
    }
}
