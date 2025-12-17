<?php

namespace App\Domains\Analytics\Application\Handlers;

use App\Domains\Analytics\Application\Commands\CreateDashboardCommand;
use App\Domains\Analytics\Domain\Repositories\DashboardRepositoryInterface;
use App\Domains\Analytics\Domain\Services\DashboardService;
use Illuminate\Support\Facades\Log;

class CreateDashboardHandler
{
    public function __construct(
        private DashboardRepositoryInterface $dashboardRepository,
        private DashboardService $dashboardService
    ) {
    }

    public function handle(CreateDashboardCommand $command): array
    {
        try {
            // Validar dados do comando
            $this->validateCommand($command);

            // Criar o dashboard no domínio
            $dashboard = $this->dashboardService->createDashboard([
                'name' => $command->name,
                'description' => $command->description,
                'layout' => $command->layout,
                'widgets' => $command->widgets,
                'is_public' => $command->isPublic,
                'tags' => $command->tags
            ]);

            // Salvar no repositório
            $savedDashboard = $this->dashboardRepository->save($dashboard);

            Log::info('Dashboard created successfully', [
                'dashboard_id' => $savedDashboard->id,
                'name' => $command->name
            ]);

            return [
                'dashboard' => $savedDashboard->toArray(),
                'message' => 'Dashboard criado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating dashboard', [
                'name' => $command->name,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function validateCommand(CreateDashboardCommand $command): void
    {
        if (empty($command->name)) {
            throw new \InvalidArgumentException('Nome é obrigatório');
        }
    }
}
