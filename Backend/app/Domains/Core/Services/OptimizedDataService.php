<?php

namespace App\Domains\Core\Services;

use App\Domains\Core\Domain\CacheEntryRepositoryInterface; // Supondo que este repositório exista
use Illuminate\Support\Facades\Log;

class OptimizedDataService
{
    protected CacheEntryRepositoryInterface $cacheRepository;

    public function __construct(CacheEntryRepositoryInterface $cacheRepository)
    {
        $this->cacheRepository = $cacheRepository;
    }

    /**
     * Recupera dados de forma otimizada, utilizando cache.
     *
     * @param string   $key      a chave para o cache
     * @param callable $callback a função para gerar os dados se não estiverem no cache
     * @param int      $ttl      tempo de vida do cache em segundos
     *
     * @return mixed os dados otimizados
     */
    public function getCachedData(string $key, callable $callback, int $ttl = 3600)
    {
        $cachedData = $this->cacheRepository->get($key);

        if ($cachedData) {
            Log::info("Dados recuperados do cache para a chave: {$key}");
            return unserialize($cachedData->value);
        }

        $data = $callback();
        $this->cacheRepository->put($key, serialize($data), new \DateTime(date('Y-m-d H:i:s', time() + $ttl)));
        Log::info("Dados gerados e armazenados em cache para a chave: {$key}");

        return $data;
    }

    /**
     * Otimiza uma coleção de dados (ex: para reduzir o tamanho da resposta).
     *
     * @param array<int, array<string, mixed>> $data a coleção de dados a ser otimizada
     *
     * @return array<int, array<string, mixed>> os dados otimizados
     */
    public function optimizeCollection(array $data): array
    {
        // Exemplo: remover campos desnecessários, comprimir dados
        return array_map(function ($item) {
            unset($item['internal_field']); // Exemplo de remoção de campo
            return $item;
        }, $data);
    }
}
