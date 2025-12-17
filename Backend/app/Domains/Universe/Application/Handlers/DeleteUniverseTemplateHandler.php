<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Commands\DeleteUniverseTemplateCommand;
use App\Domains\Universe\Domain\Repositories\UniverseTemplateRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseTemplateService;
use Illuminate\Support\Facades\Log;

class DeleteUniverseTemplateHandler
{
    public function __construct(
        private UniverseTemplateRepositoryInterface $universeTemplateRepository,
        private UniverseTemplateService $universeTemplateService
    ) {
    }

    public function handle(DeleteUniverseTemplateCommand $command): array
    {
        try {
            // Buscar o template existente
            $template = $this->universeTemplateRepository->findById($command->templateId);

            if (!$template) {
                throw new \Exception('Template do universo não encontrado');
            }

            // Validar permissões
            if ($template->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para excluir este template');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há instâncias usando este template
            $hasInstances = $this->universeTemplateService->hasInstancesUsingTemplate($template);

            if ($hasInstances && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir template com instâncias associadas. Use forceDelete=true para forçar a exclusão.');
            }

            // Excluir o template
            $this->universeTemplateRepository->delete($command->templateId);

            Log::info('Universe template deleted successfully', [
                'template_id' => $command->templateId,
                'user_id' => $command->userId
            ]);

            return [
                'message' => 'Template do universo excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting universe template', [
                'template_id' => $command->templateId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteUniverseTemplateCommand $command): void
    {
        if (empty($command->templateId)) {
            throw new \InvalidArgumentException('ID do template é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }
    }
}
