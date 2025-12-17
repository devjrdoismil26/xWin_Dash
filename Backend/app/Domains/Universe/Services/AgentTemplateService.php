<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\UniverseTemplate;
use Illuminate\Support\Facades\Log;

// Supondo que o model exista

class AgentTemplateService
{
    /**
     * Cria um novo template de agente.
     *
     * @param int    $userId        o ID do usuário criador
     * @param string $name          nome do template
     * @param array<string, mixed>  $configuration a configuração do agente (ex: regras, respostas, integrações)
     *
     * @return UniverseTemplate
     */
    public function createTemplate(int $userId, string $name, array $configuration): UniverseTemplate
    {
        $template = new UniverseTemplate([
            'name' => $name,
            'description' => json_encode($configuration), // Armazenar configuração como JSON
            'category' => 'agent',
            'user_id' => $userId,
        ]);
        $template->save();
        Log::info("Template de agente criado: {$template->name} (ID: {$template->id}).");
        return $template;
    }

    /**
     * Obtém um template de agente pelo seu ID.
     *
     * @param int $id o ID do template
     *
     * @return UniverseTemplate|null
     */
    public function getTemplateById(int $id): ?UniverseTemplate
    {
        /** @var UniverseTemplate|null $template */
        $template = UniverseTemplate::query()->where('category', 'agent')->find($id);
        return $template;
    }

    /**
     * Atualiza um template de agente existente.
     *
     * @param int   $id   o ID do template
     * @param array<string, mixed> $data dados para atualização (name, configuration)
     *
     * @return UniverseTemplate
     */
    public function updateTemplate(int $id, array $data): ?UniverseTemplate
    {
        /** @var UniverseTemplate|null $template */
        $template = UniverseTemplate::query()->where('category', 'agent')->find($id);
        if (!$template) {
            return null;
        }
        $template->update([
            'name' => $data['name'] ?? $template->name,
            'description' => isset($data['configuration']) ? json_encode($data['configuration']) : $template->description,
        ]);
        Log::info("Template de agente atualizado: {$template->name} (ID: {$template->id}).");
        return $template;
    }

    /**
     * Deleta um template de agente pelo seu ID.
     *
     * @param int $id o ID do template
     *
     * @return bool
     */
    public function deleteTemplate(int $id): bool
    {
        $success = UniverseTemplate::query()->where('category', 'agent')->where('id', $id)->delete();
        if ($success) {
            Log::info("Template de agente ID: {$id} deletado com sucesso.");
        }
        return (bool) $success;
    }

    /**
     * Retorna todos os templates de agente paginados para um usuário.
     *
     * @param int $userId  o ID do usuário
     * @param int $perPage número de itens por página
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllTemplates(int $userId, int $perPage = 15): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return UniverseTemplate::query()->where('user_id', $userId)
                               ->where('category', 'agent')
                               ->paginate($perPage);
    }
}
