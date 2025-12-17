<?php

namespace App\Application\Analytics\UseCases;

use App\Application\Analytics\Commands\CreateAnalyticsDashboardCommand;
use App\Domains\Analytics\Services\AnalyticsService;
use App\Domains\Analytics\Domain\AnalyticsDashboard;
use App\Shared\Exceptions\BusinessRuleException;

class CreateAnalyticsDashboardUseCase
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Executa o caso de uso para criar um dashboard de analytics.
     *
     * @param CreateAnalyticsDashboardCommand $command
     * @return AnalyticsDashboard
     * @throws BusinessRuleException
     */
    public function execute(CreateAnalyticsDashboardCommand $command): AnalyticsDashboard
    {
        // Validate dashboard configuration
        $this->validateDashboardConfiguration($command);

        // Create the dashboard
        $dashboard = $this->analyticsService->createDashboard([
            'user_id' => $command->userId,
            'name' => $command->name,
            'type' => $command->type,
            'description' => $command->description,
            'widgets' => $command->widgets,
            'filters' => $command->filters,
            'settings' => $command->settings,
            'is_public' => $command->isPublic,
            'is_default' => $command->isDefault,
        ]);

        return $dashboard;
    }

    /**
     * Valida a configuração do dashboard.
     *
     * @param CreateAnalyticsDashboardCommand $command
     * @throws BusinessRuleException
     */
    private function validateDashboardConfiguration(CreateAnalyticsDashboardCommand $command): void
    {
        // Check if user can create more dashboards
        $userDashboards = $this->analyticsService->getDashboardsByUser($command->userId);
        $maxDashboards = $command->maxDashboardsPerUser ?? 20;

        if (count($userDashboards) >= $maxDashboards) {
            throw new BusinessRuleException("User has reached the maximum limit of {$maxDashboards} dashboards");
        }

        // Validate dashboard type
        if (!in_array($command->type, AnalyticsDashboard::getValidTypes())) {
            throw new BusinessRuleException("Invalid dashboard type: {$command->type}");
        }

        // Validate widgets
        $this->validateWidgets($command->widgets);

        // Check if user is trying to set multiple default dashboards
        if ($command->isDefault) {
            $existingDefault = $this->analyticsService->getDefaultDashboardByUser($command->userId);
            if ($existingDefault) {
                throw new BusinessRuleException('User already has a default dashboard');
            }
        }
    }

    /**
     * Valida os widgets do dashboard.
     *
     * @param array $widgets
     * @throws BusinessRuleException
     */
    private function validateWidgets(array $widgets): void
    {
        foreach ($widgets as $widget) {
            if (!isset($widget['type']) || !isset($widget['id'])) {
                throw new BusinessRuleException('Each widget must have type and id');
            }

            if (!in_array($widget['type'], AnalyticsDashboard::getValidWidgetTypes())) {
                throw new BusinessRuleException("Invalid widget type: {$widget['type']}");
            }

            // Validate widget-specific configuration
            $this->validateWidgetConfiguration($widget);
        }
    }

    /**
     * Valida a configuração específica de um widget.
     *
     * @param array $widget
     * @throws BusinessRuleException
     */
    private function validateWidgetConfiguration(array $widget): void
    {
        switch ($widget['type']) {
            case AnalyticsDashboard::WIDGET_METRIC:
                if (!isset($widget['metric_type'])) {
                    throw new BusinessRuleException('Metric widget must have metric_type');
                }
                break;

            case AnalyticsDashboard::WIDGET_CHART:
                if (!isset($widget['chart_type'])) {
                    throw new BusinessRuleException('Chart widget must have chart_type');
                }
                break;

            case AnalyticsDashboard::WIDGET_GOAL:
                if (!isset($widget['goal_value'])) {
                    throw new BusinessRuleException('Goal widget must have goal_value');
                }
                break;
        }
    }
}