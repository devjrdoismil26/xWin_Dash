<?php

namespace App\Domains\Universe\Application\Handlers;

use App\Domains\Universe\Application\Commands\GenerateUniverseReportCommand;
use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Domain\Services\UniverseInstanceService;
use App\Domains\Universe\Domain\Services\UniverseReportService;
use Illuminate\Support\Facades\Log;

class GenerateUniverseReportHandler
{
    public function __construct(
        private UniverseInstanceRepositoryInterface $universeInstanceRepository,
        private UniverseInstanceService $universeInstanceService,
        private UniverseReportService $universeReportService
    ) {
    }

    public function handle(GenerateUniverseReportCommand $command): array
    {
        try {
            // Buscar a instância existente
            $instance = $this->universeInstanceRepository->findById($command->instanceId);

            if (!$instance) {
                throw new \Exception('Instância do universo não encontrada');
            }

            // Validar permissões
            if ($instance->user_id !== $command->userId) {
                throw new \Exception('Usuário não tem permissão para gerar relatório desta instância');
            }

            // Validar dados do comando
            $this->validateCommand($command);

            // Gerar o relatório
            $report = $this->universeReportService->generateReport([
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'report_type' => $command->reportType,
                'date_from' => $command->dateFrom,
                'date_to' => $command->dateTo,
                'include_analytics' => $command->includeAnalytics,
                'include_performance' => $command->includePerformance,
                'include_recommendations' => $command->includeRecommendations,
                'format' => $command->format
            ]);

            Log::info('Universe report generated successfully', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'report_type' => $command->reportType
            ]);

            return [
                'report' => $report,
                'message' => 'Relatório do universo gerado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error generating universe report', [
                'instance_id' => $command->instanceId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(GenerateUniverseReportCommand $command): void
    {
        if (empty($command->instanceId)) {
            throw new \InvalidArgumentException('ID da instância é obrigatório');
        }

        if (empty($command->userId)) {
            throw new \InvalidArgumentException('ID do usuário é obrigatório');
        }

        if (empty($command->reportType)) {
            throw new \InvalidArgumentException('Tipo de relatório é obrigatório');
        }
    }
}
