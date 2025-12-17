<?php

namespace App\Domains\ADStool\DTOs;

use App\Domains\ADStool\Http\Requests\StoreCampaignRequest;

/**
 * Data Transfer Object para a criação de uma campanha.
 *
 * Serve como um contêiner de dados genérico para a criação de campanhas,
 * transportando dados validados da camada de requisição para os serviços de domínio.
 */
class CreateCampaignDTO
{
    /**
     * @var string
     */
    public string $name;

    /**
     * @var string
     */
    public string $status;

    /**
     * @var float
     */
    public float $budget;

    /**
     * @var \DateTime
     */
    public \DateTime $startDate;

    /**
     * @var \DateTime|null
     */
    public ?\DateTime $endDate;

    /**
     * @param string         $name
     * @param string         $status
     * @param float          $budget
     * @param \DateTime      $startDate
     * @param \DateTime|null $endDate
     */
    public function __construct(
        string $name,
        string $status,
        float $budget,
        \DateTime $startDate,
        ?\DateTime $endDate = null,
    ) {
        $this->name = $name;
        $this->status = $status;
        $this->budget = $budget;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
     * Cria uma instância do DTO a partir de uma requisição HTTP.
     *
     * @param StoreCampaignRequest $request
     *
     * @return self
     *
     * @throws \Exception
     */
    public static function fromRequest(StoreCampaignRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            $validated['name'],
            $validated['status'] ?? 'DRAFT',
            (float) $validated['daily_budget'],
            new \DateTime($validated['start_date']),
            isset($validated['end_date']) ? new \DateTime($validated['end_date']) : null,
        );
    }

    /**
     * @return array
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'status' => $this->status,
            'budget' => $this->budget,
            'start_date' => $this->startDate->format('Y-m-d H:i:s'),
            'end_date' => $this->endDate ? $this->endDate->format('Y-m-d H:i:s') : null,
        ];
    }
}
