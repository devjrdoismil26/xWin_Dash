<?php

namespace App\Domains\Workflows\Workflows;

use App\Domains\Workflows\Activities\AddOwnerAsMemberActivity;
use App\Domains\Workflows\Activities\CreateDefaultLeadFormActivity;
use App\Domains\Workflows\Activities\CreateProjectActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class CreateProjectWorkflow extends Workflow
{
    /**
     * Orquestra a criação de um projeto, incluindo a adição do proprietário como membro
     * e a criação de um formulário de leads padrão.
     *
     * @param array $projectData dados do projeto a ser criado (ex: name, user_id)
     *
     * @return \Generator<mixed, mixed, mixed, \App\Domains\Projects\Models\Project> o projeto criado
     */
    public function definition(array $projectData): \Generator
    {
        // 1. Criar o projeto
        $project = yield ActivityStub::make(CreateProjectActivity::class, $projectData);

        // 2. Adicionar o proprietário como membro do projeto
        yield ActivityStub::make(AddOwnerAsMemberActivity::class, $project, $projectData['user_id']);

        // 3. Criar um formulário de leads padrão para o projeto
        yield ActivityStub::make(CreateDefaultLeadFormActivity::class, $project);

        return $project;
    }
}
