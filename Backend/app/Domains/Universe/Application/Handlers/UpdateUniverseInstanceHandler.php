<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Commands\UpdateUniverseInstanceCommand;
use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseInstanceService;
use Illuminate\Support\Facades\Log;

class UpdateUniverseInstanceHandler
{
    public function __construct(
        private UniverseInstanceRepositoryInterface $universeInstanceRepository,
        private UniverseInstanceService $universeInstanceService
    ) {
    }

    public function handle(UpdateUniverseInstanceCommand $command): array
    {
        try {
            // Buscar a instância existente
            $instance = $this->universeInstanceRepository->findById($command->instanceId);

            if (!$instance) {
                throw new \Exception('Instância do universo não encontrada');
            }

            // Validar permissões
            if ($instance->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para editar esta instância');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Atualizar a instância
            $updateData = array_filter([
                'name' => $command->name,
                'description' => $command->description,
                'configuration' => $command->configuration,
                'is_public' => $command->isPublic,
                'tags' => $command->tags,
                'metadata' => $command->metadata,
                'status' => $command->status
            ], function ($value) {
                return $value !== null;
            });

            $updatedInstance = $this->universeInstanceService->updateInstance($instance, $updateData);

            // Salvar no repositório
            $savedInstance = $this->universeInstanceRepository->save($updatedInstance);

            Log::info('Universe instance updated successfully', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId
            ]);

            return [
                'instance' => $savedInstance->toArray(),
                'message' => 'Instância do universo atualizada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating universe instance', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateUniverseInstanceCommand $command): void
    {
        if (empty($command->instanceId)) {
            throw new \InvalidArgumentException('ID da instância é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
