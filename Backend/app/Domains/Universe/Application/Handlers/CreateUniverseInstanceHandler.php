<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Commands\CreateUniverseInstanceCommand;
use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseInstanceService;
use App\Domains\Universe\Domain\Services\UniverseTemplateService;
use Illuminate\Support\Facades\Log;

class CreateUniverseInstanceHandler
{
    public function __construct(
        private UniverseInstanceRepositoryInterface $universeInstanceRepository,
        private UniverseInstanceService $universeInstanceService,
        private UniverseTemplateService $universeTemplateService
    ) {
    }

    public function handle(CreateUniverseInstanceCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se o template existe
            if ($command->templateId) {
                $template = $this->universeTemplateService->getTemplate($command->templateId);
                if (!$template) {
                    throw new \Exception('Template não encontrado');
                }
            }

            // Criar a instância do universo no domínio
            $universeInstance = $this->universeInstanceService->createInstance([
                'user_id' => $command->userId,
                'name' => $command->name,
                'description' => $command->description,
                'template_id' => $command->templateId,
                'configuration' => $command->configuration,
                'is_public' => $command->isPublic,
                'tags' => $command->tags,
                'metadata' => $command->metadata
            ]);

            // Salvar no repositório
            $savedInstance = $this->universeInstanceRepository->save($universeInstance);

            // Inicializar a instância se necessário
            if ($command->initialize) {
                $this->universeInstanceService->initializeInstance($savedInstance);
            }

            Log::info('Universe instance created successfully', [
                'instance_id' => $savedInstance->id,
                'user_id' => $command->userId,
                'template_id' => $command->templateId
            ]);

            return [
                'instance' => $savedInstance->toArray(),
                'message' => 'Instância do universo criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating universe instance', [
                'user_id' => $command->userId,
                'template_id' => $command->templateId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateUniverseInstanceCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome da instância é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
