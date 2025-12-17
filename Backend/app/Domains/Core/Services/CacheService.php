<?php

namespace App\Domains\Core\Services;

use App\Domains\Core\Domain\CacheEntryRepositoryInterface;
use DateTime;

class CacheService
{
    protected CacheEntryRepositoryInterface $cacheEntryRepository;

    public function __construct(CacheEntryRepositoryInterface $cacheEntryRepository)
    {
        $this->cacheEntryRepository = $cacheEntryRepository;
    }

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
        $expiration = (new DateTime())->setTimestamp(time() + $ttl);
        $this->cacheEntryRepository->put($key, serialize($value), $expiration);
        return true;
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
        $cacheEntry = $this->cacheEntryRepository->get($key);
        if ($cacheEntry && (!$cacheEntry->expiration || $cacheEntry->expiration > new DateTime())) {
            return unserialize($cacheEntry->value);
        }
        return null;
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
        return $this->cacheEntryRepository->forget($key);
    }
}
