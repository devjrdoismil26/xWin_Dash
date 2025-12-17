<?php

namespace App\Domains\Activity\Application\Handlers;

use App\Domains\Activity\Application\Commands\DeleteActivityLogCommand;
use App\Domains\Activity\Domain\Repositories\ActivityLogRepositoryInterface;
use App\Domains\Activity\Domain\Services\ActivityLogService;
use Illuminate\Support\Facades\Log;

class DeleteActivityLogHandler
{
    public function __construct(
        private ActivityLogRepositoryInterface $activityLogRepository,
        private ActivityLogService $activityLogService
    ) {
    }

    public function handle(DeleteActivityLogCommand $command): array
    {
        try {
            // Buscar o log existente
            $activityLog = $this->activityLogRepository->findById($command->activityId);

            if (!$activityLog) {
                throw new \Exception('Log de atividade não encontrado');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se pode ser excluído
            if (!$command->forceDelete && !$this->activityLogService->canDelete($activityLog)) {
                throw new \Exception('Não é possível excluir este log. Use forceDelete=true para forçar a exclusão.');
            }

            // Excluir o log
            $this->activityLogRepository->delete($command->activityId);

            Log::info('Activity log deleted successfully', [
                'activity_id' => $command->activityId
            ]);

            return [
                'message' => 'Log de atividade excluído com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting activity log', [
                'activity_id' => $command->activityId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteActivityLogCommand $command): void
    {
        if (empty($command->activityId)) {
            throw new \InvalidArgumentException('ID do log é obrigatório');
        }
    }
}
