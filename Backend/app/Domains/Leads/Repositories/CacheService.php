<?php

namespace App\Domains\Leads\Repositories;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Armazena um valor no cache.
     *
     * @param string $key   a chave do cache
     * @param mixed  $value o valor a ser armazenado
     * @param int    $ttl   tempo de vida em segundos (Time To Live)
     *
     * @return bool
     */
    public function put(string $key, $value, int $ttl = 3600): bool
    {
        return Cache::put($key, $value, $ttl);
    }

    /**
     * Recupera um valor do cache.
     *
     * @param string $key a chave do cache
     *
     * @return mixed|null o valor armazenado ou null se não encontrado
     */
    public function get(string $key)
    {
        return Cache::get($key);
    }

    /**
     * Remove um valor do cache.
     *
     * @param string $key a chave do cache
     *
     * @return bool
     */
    public function forget(string $key): bool
    {
        return Cache::forget($key);
    }
}
