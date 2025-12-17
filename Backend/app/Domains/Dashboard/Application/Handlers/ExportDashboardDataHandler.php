<?php

namespace App\Domains\Dashboard\Application\Handlers;

use App\Domains\Dashboard\Application\Commands\ExportDashboardDataCommand;
use App\Domains\Dashboard\Services\DashboardService;
use App\Domains\Dashboard\Repositories\DashboardWidgetRepository;
use App\Domains\Dashboard\Exceptions\DashboardExportException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ExportDashboardDataHandler
{
    public function __construct(
        private DashboardService $dashboardService,
        private DashboardWidgetRepository $dashboardWidgetRepository
    ) {
    }

    public function handle(ExportDashboardDataCommand $command): array
    {
        try {
            // Validar formato de exportação
            $this->validateExportFormat($command->format);

            // Buscar widgets para exportação
            $widgets = $this->getWidgetsForExport($command);

            // Gerar arquivo de exportação
            $filePath = $this->generateExportFile($command, $widgets);

            // Log da exportação
            Log::info("Dashboard data exported", [
                'user_id' => $command->userId,
                'format' => $command->format,
                'widget_count' => count($widgets),
                'file_path' => $filePath
            ]);

            return [
                'success' => true,
                'file_path' => $filePath,
                'file_url' => Storage::url($filePath),
                'format' => $command->format,
                'widget_count' => count($widgets),
                'exported_at' => now()->toISOString()
            ];
        } catch (DashboardExportException $e) {
            Log::error("Dashboard export failed", [
                'user_id' => $command->userId,
                'format' => $command->format,
                'error' => $e->getMessage()
            ]);

            throw $e;
        } catch (\Exception $e) {
            Log::error("Unexpected error during dashboard export", [
                'user_id' => $command->userId,
                'format' => $command->format,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new DashboardExportException(
                "Failed to export dashboard data: " . $e->getMessage()
            );
        }
    }

    private function validateExportFormat(string $format): void
    {
        $allowedFormats = ['csv', 'excel', 'pdf'];

        if (!in_array($format, $allowedFormats)) {
            throw new DashboardExportException(
                "Invalid export format. Allowed formats: " . implode(', ', $allowedFormats)
            );
        }
    }

    private function getWidgetsForExport(ExportDashboardDataCommand $command): array
    {
        if ($command->widgetIds) {
            return $this->dashboardWidgetRepository->findByIds($command->widgetIds);
        } else {
            return $this->dashboardWidgetRepository->findByUserId($command->userId);
        }
    }

    private function generateExportFile(ExportDashboardDataCommand $command, array $widgets): string
    {
        $filename = 'dashboard_export_' . now()->format('Y-m-d_His') . '.' . $command->format;
        $filePath = 'exports/dashboard/' . $filename;

        switch ($command->format) {
            case 'csv':
                return $this->generateCsvExport($widgets, $filePath, $command);

            case 'excel':
                return $this->generateExcelExport($widgets, $filePath, $command);

            case 'pdf':
                return $this->generatePdfExport($widgets, $filePath, $command);

            default:
                throw new DashboardExportException("Unsupported export format: {$command->format}");
        }
    }

    private function generateCsvExport(array $widgets, string $filePath, ExportDashboardDataCommand $command): string
    {
        $csv = Writer::createFromString('');

        // Cabeçalho
        $csv->insertOne(['Widget', 'Type', 'Data', 'Timestamp']);

        foreach ($widgets as $widget) {
            $data = $this->dashboardService->getWidgetData($widget, $command->filters);
            $csv->insertOne([
                $widget->name,
                $widget->type,
                json_encode($data),
                now()->toISOString()
            ]);
        }

        Storage::put($filePath, $csv->getContent());
        return $filePath;
    }

    private function generateExcelExport(array $widgets, string $filePath, ExportDashboardDataCommand $command): string
    {
        // Implementação para Excel usando PhpSpreadsheet
        // Por simplicidade, retornando o mesmo que CSV por enquanto
        return $this->generateCsvExport($widgets, $filePath, $command);
    }

    private function generatePdfExport(array $widgets, string $filePath, ExportDashboardDataCommand $command): string
    {
        // Implementação para PDF usando DomPDF ou similar
        // Por simplicidade, retornando o mesmo que CSV por enquanto
        return $this->generateCsvExport($widgets, $filePath, $command);
    }
}
