<?php

namespace App\Shared\Transactions;

interface Saga
{
    /**
     * Inicia a execução da saga.
     *
     * @param array<string, mixed> $data dados iniciais para a saga
     *
     * @return mixed o resultado da saga
     */
    public function start(array $data);

    /**
     * Continua a execução da saga a partir de um determinado estado.
     *
     * @param string               $state o estado atual da saga
     * @param array<string, mixed> $data  dados para continuar a saga
     *
     * @return mixed o resultado da saga
     */
    public function continue(string $state, array $data);

    /**
     * Reverte as operações da saga em caso de falha.
     *
     * @param string               $failedState o estado em que a saga falhou
     * @param array<string, mixed> $data        dados para compensação
     *
     * @return bool true se a compensação for bem-sucedida
     */
    public function compensate(string $failedState, array $data): bool;
}
