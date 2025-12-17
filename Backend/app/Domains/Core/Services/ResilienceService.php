<?php

namespace App\Domains\Core\Services;

use Illuminate\Support\Facades\Log;
use Throwable;

class ResilienceService
{
    /**
     * Implementa o padrão Circuit Breaker.
     *
     * @param callable $callback         a função a ser executada
     * @param string   $serviceName      o nome do serviço para o Circuit Breaker
     * @param int      $failureThreshold número de falhas antes de abrir o circuito
     * @param int      $resetTimeout     tempo em segundos para tentar fechar o circuito
     *
     * @return mixed o resultado da função
     *
     * @throws Throwable se a função falhar e o circuito estiver aberto
     */
    public function circuitBreaker(callable $callback, string $serviceName = 'default', int $failureThreshold = 3, int $resetTimeout = 60)
    {
        $circuitStateKey = "circuit_breaker:{$serviceName}:state";
        $failureCountKey = "circuit_breaker:{$serviceName}:failures";
        $lastFailureTimeKey = "circuit_breaker:{$serviceName}:last_failure_time";

        $state = cache($circuitStateKey, 'CLOSED');
        $failures = cache($failureCountKey, 0);
        $lastFailureTime = cache($lastFailureTimeKey, 0);

        if ($state === 'OPEN') {
            if (time() - $lastFailureTime > $resetTimeout) {
                // Tentar HALF-OPEN
                cache()->put($circuitStateKey, 'HALF_OPEN', $resetTimeout);
                Log::warning("Circuit Breaker para {$serviceName} em HALF_OPEN.");
            } else {
                Log::error("Circuit Breaker para {$serviceName} está OPEN. Falha imediata.");
                throw new \RuntimeException("Service {$serviceName} is currently unavailable.");
            }
        }

        try {
            $result = $callback();
            // Sucesso: resetar o circuito
            cache()->put($circuitStateKey, 'CLOSED', $resetTimeout);
            cache()->put($failureCountKey, 0, $resetTimeout);
            Log::info("Circuit Breaker para {$serviceName} em CLOSED.");
            return $result;
        } catch (Throwable $e) {
            // Falha: incrementar contador
            $failures++;
            cache()->put($failureCountKey, $failures, $resetTimeout);
            cache()->put($lastFailureTimeKey, time(), $resetTimeout);

            if ($failures >= $failureThreshold) {
                cache()->put($circuitStateKey, 'OPEN', $resetTimeout);
                Log::critical("Circuit Breaker para {$serviceName} em OPEN devido a {$failures} falhas. Erro: " . $e->getMessage());
            } else {
                Log::warning("Circuit Breaker para {$serviceName} falhou ({$failures}/{$failureThreshold}). Erro: " . $e->getMessage());
            }
            throw $e; // Re-lançar a exceção original
        }
    }

    /**
     * Implementa o padrão Retry.
     *
     * @param callable $callback a função a ser executada
     * @param int      $retries  número de tentativas
     * @param int      $delay    atraso entre as tentativas em milissegundos
     *
     * @return mixed o resultado da função
     *
     * @throws Throwable se a função falhar após todas as tentativas
     */
    public function retry(callable $callback, int $retries = 3, int $delay = 100)
    {
        for ($i = 0; $i <= $retries; $i++) {
            try {
                return $callback();
            } catch (Throwable $e) {
                if ($i < $retries) {
                    Log::warning("Retry attempt " . ($i + 1) . " for callback. Retrying in {$delay}ms. Error: " . $e->getMessage());
                    usleep($delay * 1000);
                } else {
                    Log::error("Callback failed after {$retries} retries. Error: " . $e->getMessage());
                    throw $e;
                }
            }
        }
    }
}
