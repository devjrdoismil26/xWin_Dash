<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Users\Models\User;
use App\Domains\Users\Services\UserService;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Workflow\Activity;

class DeleteUserProfileActionActivity extends Activity
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Exclui o perfil de um usuário.
     *
     * @param string $userId o ID do usuário a ser excluído
     */
    public function execute(string $userId): void
    {
        $user = User::find($userId);

        if (!$user) {
            LoggerFacade::warning("DeleteUserProfileActionActivity: Usuário com ID {$userId} não encontrado para exclusão de perfil.");
            return;
        }

        try {
            $this->userService->deleteUser($user);
        } catch (\Exception $e) {
            LoggerFacade::error("Falha ao deletar perfil do usuário {$userId}: " . $e->getMessage());
            throw $e; // Relançar para que o workflow possa compensar ou falhar
        }
    }

    /**
     * A compensação para a exclusão de um perfil de usuário é complexa e geralmente não é implementada.
     * Reverter a exclusão exigiria recriar o usuário e seus dados associados.
     */
    public function compensate(string $userId): void
    {
        LoggerFacade::warning("Compensação para DeleteUserProfileActionActivity não implementada para usuário {$userId}.");
    }
}
