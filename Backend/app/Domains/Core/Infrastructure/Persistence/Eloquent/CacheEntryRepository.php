<?php

namespace App\Domains\Core\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Domain\CacheEntry;
use App\Domains\Core\Domain\CacheEntryRepositoryInterface;

class CacheEntryRepository implements CacheEntryRepositoryInterface
{
    protected CacheEntryModel $model;

    public function __construct(CacheEntryModel $model)
    {
        $this->model = $model;
    }

    /**
     * Obtém uma entrada de cache pela sua chave.
     *
     * @param string $key
     *
     * @return CacheEntry|null
     */
    public function get(string $key): ?CacheEntry
    {
        $cacheEntryModel = CacheEntryModel::where('key', $key)->first();
        return $cacheEntryModel ? CacheEntry::fromArray($cacheEntryModel->toArray()) : null;
    }

    /**
     * Armazena uma entrada de cache.
     *
     * @param string         $key
     * @param string         $value
     * @param \DateTime|null $expiration
     *
     * @return CacheEntry
     */
    public function put(string $key, string $value, ?\DateTime $expiration = null): CacheEntry
    {
        $cacheEntryModel = CacheEntryModel::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'expiration' => $expiration],
        );
        return CacheEntry::fromArray($cacheEntryModel->toArray());
    }

    /**
     * Remove uma entrada de cache pela sua chave.
     *
     * @param string $key
     *
     * @return bool
     */
    public function forget(string $key): bool
    {
        return (bool) CacheEntryModel::where('key', $key)->delete();
    }
}
