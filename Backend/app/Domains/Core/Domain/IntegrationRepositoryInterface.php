<?php

namespace App\Domains\Core\Domain;

interface IntegrationRepositoryInterface
{
    /**
     * Cria uma nova integração.
     *
     * @param array<string, mixed> $data
     *
     * @return Integration
     */
    public function create(array $data): Integration;

    /**
     * Encontra uma integração pelo seu ID.
     *
     * @param int $id
     *
     * @return Integration|null
     */
    public function find(int $id): ?Integration;

    /**
     * Encontra uma integração pelo seu nome e tipo.
     *
     * @param string $name
     * @param string $type
     *
     * @return Integration|null
     */
    public function findByNameAndType(string $name, string $type): ?Integration;

    /**
     * Atualiza uma integração existente.
     *
     * @param int   $id
     * @param array<string, mixed> $data
     *
     * @return Integration
     */
    public function update(int $id, array $data): Integration;

    /**
     * Deleta uma integração pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Retorna todas as integrações.
     *
     * @return array<Integration>
     */
    public function getAll(): array;
}
