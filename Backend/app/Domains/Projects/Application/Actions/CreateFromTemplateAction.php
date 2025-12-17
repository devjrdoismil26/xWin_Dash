<?php

namespace App\Domains\Projects\Application\Actions;

use App\Domains\Projects\Application\Services\TemplateService;

class CreateFromTemplateAction
{
    public function __construct(
        private readonly TemplateService $templateService
    ) {
    }

    public function execute(string $templateId, array $projectData): array
    {
        return $this->templateService->createProjectFromTemplate($templateId, $projectData);
    }
}
