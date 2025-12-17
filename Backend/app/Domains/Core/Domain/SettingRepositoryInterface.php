<?php

namespace App\Domains\Core\Domain;

interface SettingRepositoryInterface
{
    /**
     * Obtém uma configuração pelo seu chave.
     *
     * @param string $key
     *
     * @return Setting|null
     */
    public function getByKey(string $key): ?Setting;

    /**
     * Atualiza ou cria uma configuração.
     *
     * @param string      $key
     * @param string      $value
     * @param string|null $description
     *
     * @return Setting
     */
    public function updateOrCreate(string $key, string $value, ?string $description = null): Setting;

    /**
     * Retorna todas as configurações.
     *
     * @return array<Setting>
     */
    public function getAll(): array;
}
