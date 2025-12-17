<?php

namespace App\Domains\Core\Domain;

interface CacheEntryRepositoryInterface
{
    /**
     * Obtém uma entrada de cache pela sua chave.
     *
     * @param string $key
     *
     * @return CacheEntry|null
     */
    public function get(string $key): ?CacheEntry;

    /**
     * Armazena uma entrada de cache.
     *
     * @param string         $key
     * @param string         $value
     * @param \DateTime|null $expiration
     *
     * @return CacheEntry
     */
    public function put(string $key, string $value, ?\DateTime $expiration = null): CacheEntry;

    /**
     * Remove uma entrada de cache pela sua chave.
     *
     * @param string $key
     *
     * @return bool
     */
    public function forget(string $key): bool;
}
