<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Commands\CreateMetricCommand;
use App\Domains\Analytics\Domain\Repositories\MetricRepositoryInterface;
use App\Domains\Analytics\Domain\Services\MetricService;
use App\Domains\Analytics\Domain\Services\AnalyticsValidationService;
use Illuminate\Support\Facades\Log;

class CreateMetricHandler
{
    public function __construct(
        private MetricRepositoryInterface $metricRepository,
        private MetricService $metricService,
        private AnalyticsValidationService $validationService
    ) {
    }

    public function handle(CreateMetricCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Validar regras de negócio
            $this->validationService->validateMetricCreation($command->toArray());

            // Criar a métrica no domínio
            $metric = $this->metricService->createMetric([
                'name' => $command->name,
                'type' => $command->type,
                'description' => $command->description,
                'configuration' => $command->configuration,
                'category' => $command->category,
                'tags' => $command->tags,
                'is_active' => $command->isActive
            ]);

            // Salvar no repositório
            $savedMetric = $this->metricRepository->save($metric);

            // Inicializar coleta de dados
            $this->metricService->initializeMetricCollection($savedMetric);

            Log::info('Metric created successfully', [
                'metric_id' => $savedMetric->id,
                'name' => $command->name,
                'type' => $command->type
            ]);

            return [
                'metric' => $savedMetric->toArray(),
                'message' => 'Métrica criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating metric', [
                'name' => $command->name,
                'type' => $command->type,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateMetricCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome é obrigatório');
        }

        if (empty($command->type)) {
            throw new \InvalidArgumentException('Tipo é obrigatório');
        }

        $validTypes = ['counter', 'gauge', 'histogram', 'summary'];
        if (!in_array($command->type, $validTypes)) {
            throw new \InvalidArgumentException('Tipo de métrica inválido');
        }
    }
}
