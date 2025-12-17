<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\UniverseTemplate;
use Illuminate\Support\Facades\Log;

// Supondo que o model exista

class LandingPageTemplateEngine
{
    /**
     * Renderiza uma landing page a partir de um template e dados.
     *
     * @param UniverseTemplate $template o template da landing page
     * @param array<string, mixed> $data dados a serem injetados no template
     *
     * @return string o HTML renderizado da landing page
     *
     * @throws \Exception se o template não puder ser renderizado
     */
    public function render(UniverseTemplate $template, array $data = []): string
    {
        Log::info("Renderizando landing page com template: {$template->name} (ID: {$template->id}).");

        try {
            // Simulação de um motor de template simples - usando campo existente 'description'
            $renderedContent = $template->description ?? '';

            foreach ($data as $key => $value) {
                // Substituir placeholders como {{ key }} por valores
                $renderedContent = str_replace('{{ ' . $key . ' }}', $value, $renderedContent);
            }

            Log::info("Landing page renderizada com sucesso.");
            return $renderedContent;
        } catch (\Exception $e) {
            Log::error("Falha ao renderizar template de landing page: " . $e->getMessage());
            throw new \Exception("Erro ao renderizar landing page: " . $e->getMessage());
        }
    }

    /**
     * Cria um novo template de landing page.
     *
     * @param int    $userId  o ID do usuário criador
     * @param string $name    nome do template
     * @param string $content conteúdo HTML do template
     *
     * @return UniverseTemplate
     */
    public function createTemplate(int $userId, string $name, string $content): UniverseTemplate
    {
        $template = new UniverseTemplate([
            'name' => $name,
            'description' => $content,
            'category' => 'landing_page',
            'user_id' => $userId,
        ]);
        $template->save();
        Log::info("Template de landing page criado: {$template->name} (ID: {$template->id}).");
        return $template;
    }

    /**
     * Atualiza um template de landing page existente.
     *
     * @param int   $templateId o ID do template
     * @param array<string, mixed> $data dados para atualização
     *
     * @return UniverseTemplate|null
     */
    public function updateTemplate(int $templateId, array $data): ?UniverseTemplate
    {
        /** @var UniverseTemplate|null $template */
        $template = UniverseTemplate::query()->find($templateId);
        if ($template instanceof UniverseTemplate) {
            $template->update($data);
            Log::info("Template de landing page atualizado: {$template->name} (ID: {$template->id}).");
            return $template;
        }
        return null;
    }
}
