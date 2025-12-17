<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Projects\Models\Project;
use App\Domains\Projects\Services\LeadCaptureFormService;
use Workflow\Activity;

class CreateDefaultLeadFormActivity extends Activity
{
    protected LeadCaptureFormService $leadCaptureFormService;

    public function __construct(LeadCaptureFormService $leadCaptureFormService)
    {
        $this->leadCaptureFormService = $leadCaptureFormService;
    }

    /**
     * Cria um formulário de captura de leads padrão para o projeto.
     *
     * @param Project $project o projeto para o qual o formulário será criado
     */
    public function execute(Project $project): void
    {
        $this->leadCaptureFormService->createDefaultForm($project);
    }

    /**
     * Compensa a criação do formulário de leads padrão, excluindo-o.
     *
     * @param Project $project o projeto
     */
    public function compensate(Project $project): void
    {
        // e que existe um método para deletar o formulário.
        $defaultForm = $this->leadCaptureFormService->getDefaultFormForProject($project);
        if ($defaultForm) {
            $this->leadCaptureFormService->deleteForm($defaultForm);
        }
    }
}
