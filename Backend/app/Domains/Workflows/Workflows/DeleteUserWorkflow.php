<?php

namespace App\Domains\Workflows\Workflows;

use App\Domains\Workflows\Activities\AnonymizePostsActivity;
use App\Domains\Workflows\Activities\DeleteUserProfileActionActivity;
use App\Domains\Workflows\Activities\ReassignLeadsActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class DeleteUserWorkflow extends Workflow
{
    /**
     * Orquestra a exclusão segura de um usuário.
     *
     * @param array $userData dados do usuário a ser excluído (ex: user_id)
     *
     * @return \Generator<mixed, mixed, mixed, void>
     */
    public function definition(array $userData): \Generator
    {
        // 1. Anonimizar posts do usuário
        yield ActivityStub::make(AnonymizePostsActivity::class, $userData['user_id']);

        // 2. Reatribuir leads do usuário
        yield ActivityStub::make(ReassignLeadsActivity::class, $userData['user_id']);

        // 3. Excluir o perfil do usuário
        yield ActivityStub::make(DeleteUserProfileActionActivity::class, $userData['user_id']);
    }
}
