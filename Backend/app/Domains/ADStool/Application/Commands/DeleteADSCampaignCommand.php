<?php

namespace App\Domains\ADStool\Application\Commands;

/**
 * Command para exclusão de campanha ADS
 *
 * Representa a intenção de excluir uma campanha ADS
 * existente.
 */
class DeleteADSCampaignCommand
{
    private int $campaignId;
    private int $userId;
    private ?string $reason;
    private ?bool $forceDelete;

    public function __construct(
        int $campaignId,
        int $userId,
        ?string $reason = null,
        ?bool $forceDelete = false
    ) {
        $this->campaignId = $campaignId;
        $this->userId = $userId;
        $this->reason = $reason;
        $this->forceDelete = $forceDelete;
    }

    // Getters
    public function getCampaignId(): int
    {
        return $this->campaignId;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function getForceDelete(): ?bool
    {
        return $this->forceDelete;
    }

    /**
     * Cria comando a partir de array de dados
     */
    public static function fromArray(array $data): self
    {
        return new self(
            campaignId: $data['campaign_id'],
            userId: $data['user_id'],
            reason: $data['reason'] ?? null,
            forceDelete: $data['force_delete'] ?? false
        );
    }

    /**
     * Converte comando para array
     */
    public function toArray(): array
    {
        return [
            'campaign_id' => $this->campaignId,
            'user_id' => $this->userId,
            'reason' => $this->reason,
            'force_delete' => $this->forceDelete
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

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar motivo se fornecido
        if ($this->reason !== null && strlen($this->reason) > 500) {
            $errors[] = 'Motivo deve ter no máximo 500 caracteres';
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
     * Verifica se é exclusão forçada
     */
    public function isForceDelete(): bool
    {
        return $this->forceDelete === true;
    }
}
