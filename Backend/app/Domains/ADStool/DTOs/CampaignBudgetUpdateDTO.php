<?php

namespace App\Domains\ADStool\DTOs;

use App\Domains\ADStool\Http\Requests\AdjustBudgetRequest;

/**
 * Data Transfer Object para a atualização do orçamento de uma campanha.
 *
 * Este DTO transporta de forma segura e estruturada os dados necessários
 * para ajustar o orçamento de uma campanha, vindo de uma requisição HTTP
 * validada até o serviço de domínio correspondente.
 */
class CampaignBudgetUpdateDTO
{
    /**
     * @var float|null o novo orçamento diário
     */
    public ?float $dailyBudget;

    /**
     * @var float|null o novo orçamento vitalício
     */
    public ?float $lifetimeBudget;

    /**
     * Construtor do DTO.
     *
     * @param float|null $dailyBudget
     * @param float|null $lifetimeBudget
     */
    public function __construct(?float $dailyBudget = null, ?float $lifetimeBudget = null)
    {
        $this->dailyBudget = $dailyBudget;
        $this->lifetimeBudget = $lifetimeBudget;
    }

    /**
     * Cria uma instância do DTO a partir de uma requisição HTTP validada.
     *
     * @param AdjustBudgetRequest $request
     *
     * @return self
     */
    public static function fromRequest(AdjustBudgetRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            isset($validated['daily_budget']) ? (float) $validated['daily_budget'] : null,
            isset($validated['lifetime_budget']) ? (float) $validated['lifetime_budget'] : null,
        );
    }

    /**
     * Converte o DTO para um array, removendo valores nulos.
     * Útil para passar para métodos de atualização de repositório.
     *
     * @return array
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'daily_budget' => $this->dailyBudget,
            'lifetime_budget' => $this->lifetimeBudget,
        ], fn ($value) => !is_null($value));
    }
}
