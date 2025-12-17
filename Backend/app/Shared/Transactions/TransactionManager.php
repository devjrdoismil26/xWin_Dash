<?php

namespace App\Shared\Transactions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionManager
{
    /**
     * Executa uma transação de banco de dados com tratamento de erros.
     *
     * @param callable $callback a função a ser executada dentro da transação
     *
     * @return mixed o resultado da função de callback
     *
     * @throws \Throwable qualquer exceção lançada dentro da transação
     */
    public function transaction(callable $callback): mixed
    {
        DB::beginTransaction();

        try {
            $result = $callback();
            DB::commit();
            Log::info("Transação de banco de dados concluída com sucesso.");
            return $result;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Transação de banco de dados falhou. Rollback realizado. Erro: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Executa uma série de passos como parte de uma saga, com compensação em caso de falha.
     *
     * @param Saga                 $saga        a instância da saga a ser executada
     * @param array<string, mixed> $initialData dados iniciais para a saga
     *
     * @return mixed o resultado da saga
     *
     * @throws \Throwable qualquer exceção lançada durante a execução da saga
     */
    public function runSaga(Saga $saga, array $initialData): mixed
    {
        Log::info("Iniciando execução da saga: " . get_class($saga));
        $currentState = 'start';
        $result = null;

        try {
            // Simulação de passos da saga
            // Em um cenário real, a saga teria múltiplos métodos para cada passo
            $result = $saga->start($initialData);
            $currentState = 'completed';

            Log::info("Saga " . get_class($saga) . " concluída com sucesso.");
            return $result;

        } catch (\Throwable $e) {
            Log::error("Saga " . get_class($saga) . " falhou no estado {$currentState}. Iniciando compensação. Erro: " . $e->getMessage());
            $saga->compensate($currentState, $initialData); // Chamar o método de compensação
            throw $e;
        }
    }
}
