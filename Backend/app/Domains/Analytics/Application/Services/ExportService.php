<?php

namespace App\Domains\Analytics\Application\Services;

use App\Domains\Analytics\Application\DTOs\ExportConfigDTO;
use Illuminate\Support\Facades\Storage;

class ExportService
{
    public function exportToCSV(ExportConfigDTO $dto): string
    {
        $filename = $dto->filename ?? 'export_' . now()->format('Y-m-d_His') . '.csv';
        $path = "exports/{$filename}";
        
        $csv = $this->generateCSV($dto->data);
        Storage::put($path, $csv);
        
        return Storage::url($path);
    }

    public function exportToPDF(ExportConfigDTO $dto): string
    {
        $filename = $dto->filename ?? 'export_' . now()->format('Y-m-d_His') . '.pdf';
        $path = "exports/{$filename}";
        
        // Implementar geração de PDF
        Storage::put($path, '');
        
        return Storage::url($path);
    }

    public function exportToExcel(ExportConfigDTO $dto): string
    {
        $filename = $dto->filename ?? 'export_' . now()->format('Y-m-d_His') . '.xlsx';
        $path = "exports/{$filename}";
        
        // Implementar geração de Excel
        Storage::put($path, '');
        
        return Storage::url($path);
    }

    private function generateCSV(array $data): string
    {
        if (empty($data)) {
            return '';
        }

        $output = fopen('php://temp', 'r+');
        
        // Headers
        fputcsv($output, array_keys($data[0]));
        
        // Data
        foreach ($data as $row) {
            fputcsv($output, $row);
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }
}
