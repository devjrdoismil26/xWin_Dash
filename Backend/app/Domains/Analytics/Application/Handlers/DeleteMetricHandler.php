<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Commands\DeleteMetricCommand;
use App\Domains\Analytics\Domain\Repositories\MetricRepositoryInterface;
use App\Domains\Analytics\Domain\Services\MetricService;
use Illuminate\Support\Facades\Log;

class DeleteMetricHandler
{
    public function __construct(
        private MetricRepositoryInterface $metricRepository,
        private MetricService $metricService
    ) {
    }

    public function handle(DeleteMetricCommand $command): array
    {
        try {
            // Buscar a métrica existente
            $metric = $this->metricRepository->findById($command->metricId);

            if (!$metric) {
                throw new \Exception('Métrica não encontrada');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Verificar se há dados associados
            $hasAssociatedData = $this->metricService->hasAssociatedData($metric);

            if ($hasAssociatedData && !$command->forceDelete) {
                throw new \Exception('Não é possível excluir métrica com dados associados. Use forceDelete=true para forçar a exclusão.');
            }

            // Limpar dados associados se necessário
            if ($command->forceDelete) {
                $this->metricService->cleanupAssociatedData($metric);
            }

            // Excluir a métrica
            $this->metricRepository->delete($command->metricId);

            Log::info('Metric deleted successfully', [
                'metric_id' => $command->metricId
            ]);

            return [
                'message' => 'Métrica excluída com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting metric', [
                'metric_id' => $command->metricId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(DeleteMetricCommand $command): void
    {
        if (empty($command->metricId)) {
            throw new \InvalidArgumentException('ID da métrica é obrigatório');
        }
    }
}
