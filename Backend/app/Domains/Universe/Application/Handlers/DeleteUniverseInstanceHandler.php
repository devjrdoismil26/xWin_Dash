<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Commands\DeleteUniverseInstanceCommand;
use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseInstanceService;
use Illuminate\Support\Facades\Log;

class DeleteUniverseInstanceHandler
{
    public function __construct(
        private UniverseInstanceRepositoryInterface $universeInstanceRepository,
        private UniverseInstanceService $universeInstanceService
    ) {
    }

    public function handle(DeleteUniverseInstanceCommand $command): array
    {
        try {
            // Buscar a instância existente
            $instance = $this->universeInstanceRepository->findById($command->instanceId);

            if (!$instance) {
                throw new \Exception('Instância do universo não encontrada');
            }

            // Validar permissões
            if ($instance->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para excluir esta instância');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há dados associados
            $hasAssociatedData = $this->universeInstanceService->hasAssociatedData($instance);

            if ($hasAssociatedData && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir instância com dados associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Limpar dados associados se necessário
            if ($command->forceDelete) {
                $this->universeInstanceService->cleanupAssociatedData($instance);
            }

            // Excluir a instância
            $this->universeInstanceRepository->delete($command->instanceId);

            Log::info('Universe instance deleted successfully', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId
            ]);

            return [
                'message' => 'Instância do universo excluída com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting universe instance', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteUniverseInstanceCommand $command): void
    {
        if (empty($command->instanceId)) {
            throw new \InvalidArgumentException('ID da instância é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
