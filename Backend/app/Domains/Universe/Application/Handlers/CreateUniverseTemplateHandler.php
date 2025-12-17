<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Commands\CreateUniverseTemplateCommand;
use App\Domains\Universe\Domain\Repositories\UniverseTemplateRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseTemplateService;
use Illuminate\Support\Facades\Log;

class CreateUniverseTemplateHandler
{
    public function __construct(
        private UniverseTemplateRepositoryInterface $universeTemplateRepository,
        private UniverseTemplateService $universeTemplateService
    ) {
    }

    public function handle(CreateUniverseTemplateCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Criar o template do universo no domínio
            $universeTemplate = $this->universeTemplateService->createTemplate([
                'user_id' => $command->userId,
                'name' => $command->name,
                'description' => $command->description,
                'category' => $command->category,
                'configuration_schema' => $command->configurationSchema,
                'default_configuration' => $command->defaultConfiguration,
                'is_public' => $command->isPublic,
                'tags' => $command->tags,
                'metadata' => $command->metadata
            ]);

            // Salvar no repositório
            $savedTemplate = $this->universeTemplateRepository->save($universeTemplate);

            Log::info('Universe template created successfully', [
                'template_id' => $savedTemplate->id,
                'user_id' => $command->userId,
                'category' => $command->category
            ]);

            return [
                'template' => $savedTemplate->toArray(),
                'message' => 'Template do universo criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating universe template', [
                'user_id' => $command->userId,
                'category' => $command->category,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateUniverseTemplateCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome do template é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }

        if (empty($command->category)) {
            throw new \InvalidArgumentException('Categoria do template é obrigatória');
        }
    }
}
