<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Commands\UpdateMetricCommand;
use App\Domains\Analytics\Domain\Repositories\MetricRepositoryInterface;
use App\Domains\Analytics\Domain\Services\MetricService;
use App\Domains\Analytics\Domain\Services\AnalyticsValidationService;
use Illuminate\Support\Facades\Log;

class UpdateMetricHandler
{
    public function __construct(
        private MetricRepositoryInterface $metricRepository,
        private MetricService $metricService,
        private AnalyticsValidationService $validationService
    ) {
    }

    public function handle(UpdateMetricCommand $command): array
    {
        try {
            // Buscar a métrica existente
            $metric = $this->metricRepository->findById($command->metricId);

            if (!$metric) {
                throw new \Exception('Métrica não encontrada');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateMetricUpdate($command->toArray());

            // Atualizar a métrica
            $updateData = array_filter([
                'name' => $command->name,
                'type' => $command->type,
                'description' => $command->description,
                'configuration' => $command->configuration,
                'category' => $command->category,
                'tags' => $command->tags,
                'is_active' => $command->isActive
            ], function ($value) {
                return $value !== null;
            });

            $updatedMetric = $this->metricService->updateMetric($metric, $updateData);

            // Salvar no repositório
            $savedMetric = $this->metricRepository->save($updatedMetric);

            Log::info('Metric updated successfully', [
                'metric_id' => $command->metricId
            ]);

            return [
                'metric' => $savedMetric->toArray(),
                'message' => 'Métrica atualizada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating metric', [
                'metric_id' => $command->metricId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(UpdateMetricCommand $command): void
    {
        if (empty($command->metricId)) {
            throw new \InvalidArgumentException('ID da métrica é obrigatório');
        }

        if ($command->type) {
            $validTypes = ['counter', 'gauge', 'histogram', 'summary'];
            if (!in_array($command->type, $validTypes)) {
                throw new \InvalidArgumentException('Tipo de métrica inválido');
            }
        }
    }
}
