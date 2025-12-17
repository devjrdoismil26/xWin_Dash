<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para encapsular o resultado de uma operação de sincronização.
 *
 * Utilizado por jobs e serviços que sincronizam dados entre o nosso sistema e
 * plataformas externas. Ele fornece um resumo claro do que foi realizado durante
 * o processo de sincronização.
 */
class SyncResultDTO
{
    /**
     * @var string o status geral da sincronização (ex: 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED')
     */
    public string $status;

    /**
     * @var int o número de registros criados
     */
    public int $createdCount;

    /**
     * @var int o número de registros atualizados
     */
    public int $updatedCount;

    /**
     * @var int o número de registros que não precisaram de alteração
     */
    public int $unchangedCount;

    /**
     * @var array<string> uma lista de erros que ocorreram durante o processo
     */
    public array $errors;

    /**
     * @var string|null uma mensagem resumindo o resultado
     */
    public ?string $message;

    /**
     * Construtor do DTO de resultado de sincronização.
     *
     * @param string      $status
     * @param int         $createdCount
     * @param int         $updatedCount
     * @param int         $unchangedCount
     * @param array<string>       $errors
     * @param string|null $message
     */
    public function __construct(
        string $status = 'PENDING',
        int $createdCount = 0,
        int $updatedCount = 0,
        int $unchangedCount = 0,
        array $errors = [],
        ?string $message = null,
    ) {
        $this->status = $status;
        $this->createdCount = $createdCount;
        $this->updatedCount = $updatedCount;
        $this->unchangedCount = $unchangedCount;
        $this->errors = $errors;
        $this->message = $message;
    }

    /**
     * Verifica se a sincronização encontrou algum erro.
     *
     * @return bool
     */
    public function hasErrors(): bool
    {
        return !empty($this->errors);
    }
}
