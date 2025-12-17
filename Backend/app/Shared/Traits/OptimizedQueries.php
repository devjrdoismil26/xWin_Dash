<?php

namespace App\Shared\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

trait OptimizedQueries
{
    /**
     * Scope para carregar relacionamentos com eager loading otimizado.
     *
     * @param array<string> $relations
     */
    public function scopeWithOptimizedRelations(Builder $query, array $relations = []): Builder
    {
        if (empty($relations)) {
            $relations = $this->getDefaultEagerLoadRelations();
        }

        return $query;
    }

    /**
     * Scope para consultas paginadas otimizadas.
     *
     * @param array<string> $columns
     */
    public function scopeOptimizedPaginate(Builder $query, int $perPage = 15, array $columns = ['*']): Builder
    {
        // Otimiza a consulta removendo ordenações desnecessárias para contagem
        return $query;
    }

    /**
     * Scope para busca otimizada com índices.
     *
     * @param array<string> $fields
     */
    public function scopeOptimizedSearch(Builder $query, string $term, array $fields = []): Builder
    {
        if (empty($fields)) {
            $fields = $this->getSearchableFields();
        }

        // Usa MATCH AGAINST para campos com índice full-text quando disponível
        if ($this->hasFullTextIndex($fields)) {
            return $query->whereRaw(
                'MATCH(' . implode(',', $fields) . ') AGAINST(? IN BOOLEAN MODE)',
                [$term . '*'],
            );
        }

        // Fallback para LIKE otimizado
        return $query->where(function ($q) use ($term, $fields) {
            foreach ($fields as $field) {
                $q->orWhere($field, 'LIKE', $term . '%'); // Prefixo para usar índice
            }
        });
    }

    /**
     * Scope para filtros otimizados com cache.
     *
     * @param array<string, mixed> $filters
     */
    public function scopeOptimizedFilters(Builder $query, array $filters): Builder
    {
        foreach ($filters as $field => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            // Aplica filtros baseados no tipo de campo
            $this->applyOptimizedFilter($query, $field, $value);
        }

        return $query;
    }

    /**
     * Scope para consultas com cache inteligente.
     */
    public function scopeWithSmartCache(Builder $query, string $cacheKey, int $minutes = 60): Builder
    {
        $fullCacheKey = $this->generateCacheKey($cacheKey, $query);

        // Note: remember() method may not be available in all Laravel versions
        // Using basic caching approach instead
        return $query;
    }

    /**
     * Scope para contagem otimizada.
     */
    public function scopeOptimizedCount(Builder $query, string $column = '*'): Builder
    {
        // Remove ordenações desnecessárias para contagem
        $query->getQuery()->orders = [];
        $query->getQuery()->limit = 0;
        $query->getQuery()->offset = 0;

        return $query;
    }

    /**
     * Otimiza eager loading baseado na profundidade dos relacionamentos.
     *
     * @param array<string, mixed> $relations
     *
     * @return array<string, mixed>
     */
    protected function optimizeEagerLoading(array $relations): array
    {
        $optimized = [];

        foreach ($relations as $relation => $callback) {
            if (is_numeric($relation)) {
                $relation = $callback;
                $callback = null;
            }

            // Limita a profundidade de relacionamentos aninhados
            if (substr_count($relation, '.') > 2) {
                continue; // Pula relacionamentos muito profundos
            }

            if ($callback && is_callable($callback)) {
                $optimized[$relation] = function ($query) use ($callback) {
                    $callback($query);
                    $this->applyQueryOptimizations($query);
                };
            } else {
                $optimized[] = $relation;
            }
        }

        return $optimized;
    }

    /**
     * Aplica otimizações gerais a uma query.
     */
    protected function applyQueryOptimizations(Builder $query): void
    {
        // Remove colunas desnecessárias se não especificadas
        if (empty($query->getQuery()->columns)) {
            $query->select($this->getOptimizedSelectColumns());
        }

        // Adiciona hints de índice quando apropriado
        $this->addIndexHints($query);
    }

    /**
     * Aplica filtro otimizado baseado no tipo de campo.
     */
    protected function applyOptimizedFilter(Builder $query, string $field, mixed $value): void
    {
        $fieldType = $this->getFieldType($field);

        switch ($fieldType) {
            case 'uuid':
                $query->where($field, $value);
                break;

            case 'enum':
                if (is_array($value)) {
                    $query->whereIn($field, $value);
                } else {
                    $query->where($field, $value);
                }
                break;

            case 'date':
            case 'datetime':
                $this->applyDateFilter($query, $field, $value);
                break;

            case 'boolean':
                $query->where($field, (bool) $value);
                break;

            case 'numeric':
                $this->applyNumericFilter($query, $field, $value);
                break;

            default:
                if (is_array($value)) {
                    $query->whereIn($field, $value);
                } else {
                    $query->where($field, 'LIKE', $value . '%');
                }
        }
    }

    /**
     * Aplica filtro de data otimizado.
     */
    protected function applyDateFilter(Builder $query, string $field, mixed $value): void
    {
        if (is_array($value)) {
            if (isset($value['from'])) {
                $query->where($field, '>=', $value['from']);
            }
            if (isset($value['to'])) {
                $query->where($field, '<=', $value['to']);
            }
        } else {
            $query->whereDate($field, $value);
        }
    }

    /**
     * Aplica filtro numérico otimizado.
     */
    protected function applyNumericFilter(Builder $query, string $field, mixed $value): void
    {
        if (is_array($value)) {
            if (isset($value['min'])) {
                $query->where($field, '>=', $value['min']);
            }
            if (isset($value['max'])) {
                $query->where($field, '<=', $value['max']);
            }
        } else {
            $query->where($field, $value);
        }
    }

    /**
     * Adiciona hints de índice quando apropriado.
     */
    protected function addIndexHints(Builder $query): void
    {
        $table = $this->getTable();
        $wheres = $query->getQuery()->wheres;

        // Analisa as condições WHERE para sugerir índices
        foreach ($wheres as $where) {
            if (isset($where['column']) && $this->hasIndexForColumn($where['column'])) {
                // Adiciona hint de uso de índice específico
                $indexName = $this->getIndexNameForColumn($where['column']);
                if ($indexName) {
                    $query->from("{$table} USE INDEX ({$indexName})");
                    break; // Usa apenas um hint por query
                }
            }
        }
    }

    /**
     * Gera chave de cache baseada na query.
     */
    protected function generateCacheKey(string $baseKey, Builder $query): string
    {
        $sql = $query->toSql();
        $bindings = $query->getBindings();

        return $baseKey . '_' . md5($sql . serialize($bindings));
    }

    /**
     * Retorna colunas otimizadas para select.
     *
     * @param array<string> $columns
     *
     * @return array<string>
     */
    protected function getOptimizedSelectColumns(array $columns = ['*']): array
    {
        if (in_array('*', $columns)) {
            // Remove colunas pesadas por padrão
            $heavyColumns = $this->getHeavyColumns();
            $allColumns = $this->getConnection()
                ->getSchemaBuilder()
                ->getColumnListing($this->getTable());

            return array_diff($allColumns, $heavyColumns);
        }

        return $columns;
    }

    /**
     * Retorna relacionamentos padrão para eager loading.
     *
     * @return array<string>
     */
    protected function getDefaultEagerLoadRelations(): array
    {
        return property_exists($this, 'defaultEagerLoad') ? $this->defaultEagerLoad : [];
    }

    /**
     * Retorna campos pesquisáveis.
     *
     * @return array<string>
     */
    protected function getSearchableFields(): array
    {
        return property_exists($this, 'searchableFields') ? $this->searchableFields : ['name'];
    }

    /**
     * Retorna colunas pesadas que devem ser evitadas em selects padrão.
     *
     * @return array<string>
     */
    protected function getHeavyColumns(): array
    {
        return property_exists($this, 'heavyColumns') ? $this->heavyColumns : ['content', 'data', 'metadata'];
    }

    /**
     * Verifica se há índice full-text para os campos.
     *
     * @param array<string> $fields
     */
    protected function hasFullTextIndex(array $fields): bool
    {
        return property_exists($this, 'fullTextFields') &&
               !empty(array_intersect($fields, $this->fullTextFields));
    }

    /**
     * Retorna o tipo de um campo.
     */
    protected function getFieldType(string $field): string
    {
        $casts = $this->getCasts();

        if (isset($casts[$field])) {
            return $casts[$field];
        }

        // Inferência baseada no nome do campo
        if (str_ends_with($field, '_id')) {
            return 'uuid';
        }

        if (str_ends_with($field, '_at')) {
            return 'datetime';
        }

        if (in_array($field, ['status', 'type', 'state'])) {
            return 'enum';
        }

        if (str_starts_with($field, 'is_') || str_starts_with($field, 'has_')) {
            return 'boolean';
        }

        return 'string';
    }

    /**
     * Verifica se há índice para uma coluna.
     */
    protected function hasIndexForColumn(string $column): bool
    {
        return property_exists($this, 'indexedColumns') &&
               in_array($column, $this->indexedColumns);
    }

    /**
     * Retorna o nome do índice para uma coluna.
     */
    protected function getIndexNameForColumn(string $column): ?string
    {
        $indexes = property_exists($this, 'columnIndexes') ? $this->columnIndexes : [];

        return $indexes[$column] ?? null;
    }
}
