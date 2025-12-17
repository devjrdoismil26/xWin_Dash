<?php

namespace App\Domains\AI\Activities;

use Illuminate\Support\Facades\Cache;

// use App\Domains\Workflows\Activities\BaseActivity;

/**
 * Atividade para armazenar em cache o resultado de uma operação de AI.
 */
class CacheResultActivity // extends BaseActivity
{
    /**
     * Executa a atividade de cache.
     *
     * @param string $key   a chave para o cache
     * @param mixed  $value o valor a ser armazenado em cache
     * @param int    $ttl   o tempo de vida do cache em segundos
     *
     * @return mixed o valor armazenado em cache
     */
    public function execute(string $key, $value, int $ttl = 3600)
    {
        Cache::put($key, $value, $ttl);
        return $value;
    }

    /**
     * Tenta recuperar um valor do cache.
     *
     * @param string $key a chave do cache
     *
     * @return mixed|null o valor do cache ou null se não encontrado
     */
    public function retrieve(string $key)
    {
        return Cache::get($key);
    }
}
