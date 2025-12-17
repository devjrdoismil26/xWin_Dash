<?php

namespace App\Domains\ADStool\DTOs;

use App\Domains\ADStool\Http\Requests\StoreCampaignRequest;

/**
 * Data Transfer Object para a criação de uma campanha de ADS (ADStool).
 *
 * Este DTO é especificamente utilizado para transportar os dados necessários
 * para a saga de criação de campanhas, garantindo um contrato de dados claro
 * e imutável para esse processo complexo.
 */
class CreateADSCampaignDTO
{
    /**
     * @var string
     */
    public string $name;

    /**
     * @var string
     */
    public string $objective;

    /**
     * @var string
     */
    public string $platform;

    /**
     * @var float
     */
    public float $budget;

    /**
     * @var int
     */
    public int $userId;

    /**
     * @var array<string, mixed>
     */
    public array $targeting;

    /**
     * @var array<string, mixed>
     */
    public array $creatives;

    /**
     * @param string $name
     * @param string $objective
     * @param string $platform
     * @param float  $budget
     * @param int    $userId
     * @param array<string, mixed>  $targeting
     * @param array<string, mixed>  $creatives
     */
    public function __construct(
        string $name,
        string $objective,
        string $platform,
        float $budget,
        int $userId,
        array $targeting = [],
        array $creatives = [],
    ) {
        $this->name = $name;
        $this->objective = $objective;
        $this->platform = $platform;
        $this->budget = $budget;
        $this->userId = $userId;
        $this->targeting = $targeting;
        $this->creatives = $creatives;
    }

    /**
     * Cria uma instância do DTO a partir de uma requisição HTTP.
     *
     * @param StoreCampaignRequest $request
     *
     * @return self
     */
    public static function fromRequest(StoreCampaignRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            $validated['name'],
            $validated['objective'],
            $validated['platform'],
            (float) $validated['daily_budget'],
            $request->user()->id,
            $validated['targeting'] ?? [],
            $validated['creatives'] ?? [],
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'objective' => $this->objective,
            'platform' => $this->platform,
            'budget' => $this->budget,
            'user_id' => $this->userId,
            'targeting' => $this->targeting,
            'creatives' => $this->creatives,
        ];
    }
}
