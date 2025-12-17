<?php

namespace App\Shared\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Get a value from cache
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        return Cache::get($key, $default);
    }

    /**
     * Put a value in cache
     *
     * @param string $key
     * @param mixed $value
     * @param int|null $ttl
     * @return bool
     */
    public function put(string $key, $value, ?int $ttl = null): bool
    {
        return Cache::put($key, $value, $ttl);
    }

    /**
     * Forget a cache key
     *
     * @param string $key
     * @return bool
     */
    public function forget(string $key): bool
    {
        return Cache::forget($key);
    }

    /**
     * Check if a key exists in cache
     *
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool
    {
        return Cache::has($key);
    }

    /**
     * Get or put a value in cache
     *
     * @param string $key
     * @param callable $callback
     * @param int|null $ttl
     * @return mixed
     */
    public function remember(string $key, callable $callback, ?int $ttl = null)
    {
        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Clear all cache
     *
     * @return bool
     */
    public function flush(): bool
    {
        return Cache::flush();
    }

    /**
     * Get multiple values from cache
     *
     * @param array $keys
     * @return array
     */
    public function many(array $keys): array
    {
        return Cache::many($keys);
    }

    /**
     * Put multiple values in cache
     *
     * @param array $values
     * @param int|null $ttl
     * @return bool
     */
    public function putMany(array $values, ?int $ttl = null): bool
    {
        return Cache::putMany($values, $ttl);
    }
}