<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Commands\ShareUniverseInstanceCommand;
use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseInstanceService;
use App\Domains\Universe\Domain\Services\UniverseSharingService;
use Illuminate\Support\Facades\Log;

class ShareUniverseInstanceHandler
{
    public function __construct(
        private UniverseInstanceRepositoryInterface $universeInstanceRepository,
        private UniverseInstanceService $universeInstanceService,
        private UniverseSharingService $universeSharingService
    ) {
    }

    public function handle(ShareUniverseInstanceCommand $command): array
    {
        try {
            // Buscar a instância existente
            $instance = $this->universeInstanceRepository->findById($command->instanceId);

            if (!$instance) {
                throw new \Exception('Instância do universo não encontrada');
            }

            // Validar permissões
            if ($instance->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para compartilhar esta instância');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Compartilhar a instância
            $shareResult = $this->universeSharingService->shareInstance([
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'share_type' => $command->shareType,
                'recipients' => $command->recipients,
                'permissions' => $command->permissions,
                'expires_at' => $command->expiresAt,
                'message' => $command->message
            ]);

            Log::info('Universe instance shared successfully', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'share_type' => $command->shareType
            ]);

            return [
                'share' => $shareResult,
                'message' => 'Instância do universo compartilhada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error sharing universe instance', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(ShareUniverseInstanceCommand $command): void
    {
        if (empty($command->instanceId)) {
            throw new \InvalidArgumentException('ID da instância é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }

        if (empty($command->shareType)) {
            throw new \InvalidArgumentException('Tipo de compartilhamento é obrigatório');
        }
    }
}
