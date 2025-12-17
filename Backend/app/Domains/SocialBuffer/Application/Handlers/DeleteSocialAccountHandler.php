<?php

namespace App\Domains\SocialBuffer\Application\Handlers;

use App\Domains\SocialBuffer\Application\Commands\DeleteSocialAccountCommand;
use App\Domains\SocialBuffer\Domain\Repositories\SocialAccountRepositoryInterface;
use App\Domains\SocialBuffer\Domain\Services\SocialAccountService;
use App\Domains\SocialBuffer\Domain\Services\SocialMediaIntegrationService;
use Illuminate\Support\Facades\Log;

class DeleteSocialAccountHandler
{
    public function __construct(
        private SocialAccountRepositoryInterface $socialAccountRepository,
        private SocialAccountService $socialAccountService,
        private SocialMediaIntegrationService $socialMediaService
    ) {
    }

    public function handle(DeleteSocialAccountCommand $command): array
    {
        try {
            // Buscar a conta existente
            $account = $this->socialAccountRepository->findById($command->accountId);

            if (!$account) {
                throw new \Exception('Conta social não encontrada');
            }

            // Validar permissões
            if ($account->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para excluir esta conta');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há posts associados
            $hasPosts = $this->socialAccountService->hasAssociatedPosts($account);

            if ($hasPosts && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir conta com posts associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Revogar tokens se necessário
            if ($command->revokeTokens) {
                $this->socialMediaService->revokeAccountTokens($account);
            }

            // Excluir a conta
            $this->socialAccountRepository->delete($command->accountId);

            Log::info('Social account deleted successfully', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId
            ]);

            return [
                'message' => 'Conta social excluída com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting social account', [
                'account_id' => $command->accountId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteSocialAccountCommand $command): void
    {
        if (empty($command->accountId)) {
            throw new \InvalidArgumentException('ID da conta é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
