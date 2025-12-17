<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Commands\UpdateUniverseTemplateCommand;
use App\Domains\Universe\Domain\Repositories\UniverseTemplateRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseTemplateService;
use Illuminate\Support\Facades\Log;

class UpdateUniverseTemplateHandler
{
    public function __construct(
        private UniverseTemplateRepositoryInterface $universeTemplateRepository,
        private UniverseTemplateService $universeTemplateService
    ) {
    }

    public function handle(UpdateUniverseTemplateCommand $command): array
    {
        try {
            // Buscar o template existente
            $template = $this->universeTemplateRepository->findById($command->templateId);

            if (!$template) {
                throw new \Exception('Template do universo não encontrado');
            }

            // Validar permissões
            if ($template->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para editar este template');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Atualizar o template
            $updateData = array_filter([
                'name' => $command->name,
                'description' => $command->description,
                'category' => $command->category,
                'configuration_schema' => $command->configurationSchema,
                'default_configuration' => $command->defaultConfiguration,
                'is_public' => $command->isPublic,
                'tags' => $command->tags,
                'metadata' => $command->metadata,
                'status' => $command->status
            ], function ($value) {
                return $value !== null;
            });

            $updatedTemplate = $this->universeTemplateService->updateTemplate($template, $updateData);

            // Salvar no repositório
            $savedTemplate = $this->universeTemplateRepository->save($updatedTemplate);

            Log::info('Universe template updated successfully', [
                'template_id' => $command->templateId,
                'user_id' => $command->userId
            ]);

            return [
                'template' => $savedTemplate->toArray(),
                'message' => 'Template do universo atualizado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating universe template', [
                'template_id' => $command->templateId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateUniverseTemplateCommand $command): void
    {
        if (empty($command->templateId)) {
            throw new \InvalidArgumentException('ID do template é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
