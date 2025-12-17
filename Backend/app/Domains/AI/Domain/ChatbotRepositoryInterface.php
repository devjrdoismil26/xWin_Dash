<?php

namespace App\Domains\AI\Domain;

use Illuminate\Support\Collection;

interface ChatbotRepositoryInterface
{
    public function find(string $id): ?Chatbot;

    /**
     * @return Collection<int, Chatbot>
     */
    public function all(): Collection;

    /**
     * @param array<string, mixed> $data
     * @return Chatbot
     */
    public function create(array $data): Chatbot;

    /**
     * @param string $id
     * @param array<string, mixed> $data
     * @return bool
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
