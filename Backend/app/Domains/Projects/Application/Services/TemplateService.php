<?php

namespace App\Domains\Projects\Application\Services;

use App\Domains\Projects\Application\DTOs\TemplateDTO;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectTemplateModel as ProjectTemplate;
use Illuminate\Support\Collection;

class TemplateService
{
    public function getAllTemplates(?string $userId = null): Collection
    {
        $query = ProjectTemplate::query();

        if ($userId) {
            $query->where(function ($q) use ($userId) {
                $q->where('is_public', true)
                  ->orWhere('created_by', $userId);
            });
        } else {
            $query->where('is_public', true);
        }

        return $query->get();
    }

    public function getTemplateById(string $id): ?ProjectTemplate
    {
        return ProjectTemplate::find($id);
    }

    public function createTemplate(TemplateDTO $dto): ProjectTemplate
    {
        return ProjectTemplate::create($dto->toArray());
    }

    public function createProjectFromTemplate(string $templateId, array $projectData): array
    {
        $template = $this->getTemplateById($templateId);

        if (!$template) {
            throw new \Exception('Template not found');
        }

        return [
            'project' => $projectData,
            'tasks' => $template->default_tasks,
            'milestones' => $template->default_milestones,
        ];
    }

    public function updateTemplate(string $id, array $data): ?ProjectTemplate
    {
        $template = $this->getTemplateById($id);

        if (!$template) {
            return null;
        }

        $template->update($data);
        return $template->fresh();
    }

    public function deleteTemplate(string $id): bool
    {
        $template = $this->getTemplateById($id);

        if (!$template) {
            return false;
        }

        return $template->delete();
    }
}
