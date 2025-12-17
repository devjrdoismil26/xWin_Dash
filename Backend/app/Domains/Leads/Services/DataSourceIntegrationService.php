<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Exceptions\IntegrationNotImplementedException;
use App\Domains\Leads\Models\Lead as LeadModel;
use App\Domains\Leads\Models\LeadIntegration;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

/**
 * 📊 Data Source Integration Service
 *
 * Serviço especializado para integração com fontes de dados
 * Responsável por importar leads de fontes externas
 */
class DataSourceIntegrationService
{
    private array $supportedSources = [
        'csv' => 'CSV File',
        'api_provider' => 'API Provider',
        'google_sheets' => 'Google Sheets',
        'airtable' => 'Airtable',
        'webhook' => 'Webhook'
    ];

    /**
     * Importar leads de fonte de dados
     */
    public function importLeadsFromSource(string $sourceType, array $config): array
    {
        try {
            Log::info("Importando leads de fonte: {$sourceType}");

            if (!array_key_exists($sourceType, $this->supportedSources)) {
                throw new IntegrationNotImplementedException("Integração com fonte '{$sourceType}' não implementada");
            }

            $result = match ($sourceType) {
                'csv' => $this->importFromCsv($config),
                'api_provider' => $this->importFromApiProvider($config),
                'google_sheets' => $this->importFromGoogleSheets($config),
                'airtable' => $this->importFromAirtable($config),
                'webhook' => $this->importFromWebhook($config),
                default => ['success' => false, 'leads' => [], 'error' => 'Source not supported']
            };

            if ($result['success']) {
                Log::info("Importação de leads concluída. Fonte: {$sourceType}, Leads: " . count($result['leads']));
            } else {
                Log::error("Falha na importação de leads. Fonte: {$sourceType}, Erro: " . ($result['error'] ?? 'Unknown error'));
            }

            return $result;
        } catch (\Exception $e) {
            Log::error("Erro ao importar leads de {$sourceType}: " . $e->getMessage());
            return [
                'success' => false,
                'leads' => [],
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Importar de arquivo CSV
     */
    private function importFromCsv(array $config): array
    {
        try {
            $filePath = $config['file_path'] ?? null;
            if (!$filePath || !Storage::exists($filePath)) {
                throw new \Exception('CSV file not found');
            }

            $csvData = $this->parseCsvFile($filePath);
            $leads = $this->convertCsvDataToLeads($csvData, $config);

            return [
                'success' => true,
                'leads' => $leads,
                'total_imported' => count($leads)
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'leads' => [],
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Importar de API Provider
     */
    private function importFromApiProvider(array $config): array
    {
        try {
            $apiUrl = $config['api_url'] ?? null;
            $apiKey = $config['api_key'] ?? null;

            if (!$apiUrl || !$apiKey) {
                throw new \Exception('API URL and API Key are required');
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json'
            ])->get($apiUrl);

            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . $response->body());
            }

            $apiData = $response->json();
            $leads = $this->convertApiDataToLeads($apiData, $config);

            return [
                'success' => true,
                'leads' => $leads,
                'total_imported' => count($leads)
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'leads' => [],
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Importar do Google Sheets
     */
    private function importFromGoogleSheets(array $config): array
    {
        try {
            $spreadsheetId = $config['spreadsheet_id'] ?? null;
            $range = $config['range'] ?? 'A:Z';
            $apiKey = $config['api_key'] ?? null;

            if (!$spreadsheetId || !$apiKey) {
                throw new \Exception('Spreadsheet ID and API Key are required');
            }

            $url = "https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}/values/{$range}?key={$apiKey}";

            $response = Http::get($url);

            if (!$response->successful()) {
                throw new \Exception('Google Sheets API request failed: ' . $response->body());
            }

            $sheetsData = $response->json();
            $leads = $this->convertSheetsDataToLeads($sheetsData['values'] ?? [], $config);

            return [
                'success' => true,
                'leads' => $leads,
                'total_imported' => count($leads)
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'leads' => [],
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Importar do Airtable
     */
    private function importFromAirtable(array $config): array
    {
        try {
            $baseId = $config['base_id'] ?? null;
            $tableId = $config['table_id'] ?? null;
            $apiKey = $config['api_key'] ?? null;

            if (!$baseId || !$tableId || !$apiKey) {
                throw new \Exception('Base ID, Table ID and API Key are required');
            }

            $url = "https://api.airtable.com/v0/{$baseId}/{$tableId}";

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey
            ])->get($url);

            if (!$response->successful()) {
                throw new \Exception('Airtable API request failed: ' . $response->body());
            }

            $airtableData = $response->json();
            $leads = $this->convertAirtableDataToLeads($airtableData['records'] ?? [], $config);

            return [
                'success' => true,
                'leads' => $leads,
                'total_imported' => count($leads)
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'leads' => [],
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Importar de Webhook
     */
    private function importFromWebhook(array $config): array
    {
        try {
            $webhookData = $config['data'] ?? null;
            if (!$webhookData) {
                throw new \Exception('Webhook data is required');
            }

            $leads = $this->convertWebhookDataToLeads($webhookData, $config);

            return [
                'success' => true,
                'leads' => $leads,
                'total_imported' => count($leads)
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'leads' => [],
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Parsear arquivo CSV
     */
    private function parseCsvFile(string $filePath): array
    {
        $csvData = [];
        $handle = fopen(Storage::path($filePath), 'r');

        if ($handle !== false) {
            $headers = fgetcsv($handle);

            while (($row = fgetcsv($handle)) !== false) {
                $csvData[] = array_combine($headers, $row);
            }

            fclose($handle);
        }

        return $csvData;
    }

    /**
     * Converter dados CSV para leads
     */
    private function convertCsvDataToLeads(array $csvData, array $config): array
    {
        $leads = [];
        $fieldMapping = $config['field_mapping'] ?? [];
        $defaultSource = $config['default_source'] ?? 'csv_import';

        foreach ($csvData as $row) {
            $leadData = [
                'firstName' => $row[$fieldMapping['first_name'] ?? 'first_name'] ?? '',
                'lastName' => $row[$fieldMapping['last_name'] ?? 'last_name'] ?? '',
                'email' => $row[$fieldMapping['email'] ?? 'email'] ?? '',
                'phone' => $row[$fieldMapping['phone'] ?? 'phone'] ?? '',
                'company' => $row[$fieldMapping['company'] ?? 'company'] ?? '',
                'source' => $defaultSource,
                'status' => 'new',
                'notes' => $row[$fieldMapping['notes'] ?? 'notes'] ?? ''
            ];

            if (!empty($leadData['email'])) {
                $leads[] = $leadData;
            }
        }

        return $leads;
    }

    /**
     * Converter dados de API para leads
     */
    private function convertApiDataToLeads(array $apiData, array $config): array
    {
        $leads = [];
        $fieldMapping = $config['field_mapping'] ?? [];
        $defaultSource = $config['default_source'] ?? 'api_import';
        $dataPath = $config['data_path'] ?? 'data';

        $records = $this->getNestedValue($apiData, $dataPath) ?? $apiData;

        foreach ($records as $record) {
            $leadData = [
                'firstName' => $this->getNestedValue($record, $fieldMapping['first_name'] ?? 'first_name') ?? '',
                'lastName' => $this->getNestedValue($record, $fieldMapping['last_name'] ?? 'last_name') ?? '',
                'email' => $this->getNestedValue($record, $fieldMapping['email'] ?? 'email') ?? '',
                'phone' => $this->getNestedValue($record, $fieldMapping['phone'] ?? 'phone') ?? '',
                'company' => $this->getNestedValue($record, $fieldMapping['company'] ?? 'company') ?? '',
                'source' => $defaultSource,
                'status' => 'new',
                'notes' => $this->getNestedValue($record, $fieldMapping['notes'] ?? 'notes') ?? ''
            ];

            if (!empty($leadData['email'])) {
                $leads[] = $leadData;
            }
        }

        return $leads;
    }

    /**
     * Converter dados do Google Sheets para leads
     */
    private function convertSheetsDataToLeads(array $sheetsData, array $config): array
    {
        $leads = [];
        $fieldMapping = $config['field_mapping'] ?? [];
        $defaultSource = $config['default_source'] ?? 'google_sheets_import';

        if (empty($sheetsData)) {
            return $leads;
        }

        $headers = $sheetsData[0] ?? [];
        $dataRows = array_slice($sheetsData, 1);

        foreach ($dataRows as $row) {
            $rowData = array_combine($headers, $row);

            $leadData = [
                'firstName' => $rowData[$fieldMapping['first_name'] ?? 'first_name'] ?? '',
                'lastName' => $rowData[$fieldMapping['last_name'] ?? 'last_name'] ?? '',
                'email' => $rowData[$fieldMapping['email'] ?? 'email'] ?? '',
                'phone' => $rowData[$fieldMapping['phone'] ?? 'phone'] ?? '',
                'company' => $rowData[$fieldMapping['company'] ?? 'company'] ?? '',
                'source' => $defaultSource,
                'status' => 'new',
                'notes' => $rowData[$fieldMapping['notes'] ?? 'notes'] ?? ''
            ];

            if (!empty($leadData['email'])) {
                $leads[] = $leadData;
            }
        }

        return $leads;
    }

    /**
     * Converter dados do Airtable para leads
     */
    private function convertAirtableDataToLeads(array $airtableData, array $config): array
    {
        $leads = [];
        $fieldMapping = $config['field_mapping'] ?? [];
        $defaultSource = $config['default_source'] ?? 'airtable_import';

        foreach ($airtableData as $record) {
            $fields = $record['fields'] ?? [];

            $leadData = [
                'firstName' => $fields[$fieldMapping['first_name'] ?? 'first_name'] ?? '',
                'lastName' => $fields[$fieldMapping['last_name'] ?? 'last_name'] ?? '',
                'email' => $fields[$fieldMapping['email'] ?? 'email'] ?? '',
                'phone' => $fields[$fieldMapping['phone'] ?? 'phone'] ?? '',
                'company' => $fields[$fieldMapping['company'] ?? 'company'] ?? '',
                'source' => $defaultSource,
                'status' => 'new',
                'notes' => $fields[$fieldMapping['notes'] ?? 'notes'] ?? ''
            ];

            if (!empty($leadData['email'])) {
                $leads[] = $leadData;
            }
        }

        return $leads;
    }

    /**
     * Converter dados de webhook para leads
     */
    private function convertWebhookDataToLeads(array $webhookData, array $config): array
    {
        $leads = [];
        $fieldMapping = $config['field_mapping'] ?? [];
        $defaultSource = $config['default_source'] ?? 'webhook_import';

        // Assumir que webhook data é um array de registros
        $records = is_array($webhookData) && isset($webhookData[0]) ? $webhookData : [$webhookData];

        foreach ($records as $record) {
            $leadData = [
                'firstName' => $this->getNestedValue($record, $fieldMapping['first_name'] ?? 'first_name') ?? '',
                'lastName' => $this->getNestedValue($record, $fieldMapping['last_name'] ?? 'last_name') ?? '',
                'email' => $this->getNestedValue($record, $fieldMapping['email'] ?? 'email') ?? '',
                'phone' => $this->getNestedValue($record, $fieldMapping['phone'] ?? 'phone') ?? '',
                'company' => $this->getNestedValue($record, $fieldMapping['company'] ?? 'company') ?? '',
                'source' => $defaultSource,
                'status' => 'new',
                'notes' => $this->getNestedValue($record, $fieldMapping['notes'] ?? 'notes') ?? ''
            ];

            if (!empty($leadData['email'])) {
                $leads[] = $leadData;
            }
        }

        return $leads;
    }

    /**
     * Obter valor aninhado de array
     */
    private function getNestedValue(array $data, string $key)
    {
        $keys = explode('.', $key);
        $value = $data;

        foreach ($keys as $k) {
            if (!isset($value[$k])) {
                return null;
            }
            $value = $value[$k];
        }

        return $value;
    }

    /**
     * Obter fontes suportadas
     */
    public function getSupportedSources(): array
    {
        return $this->supportedSources;
    }

    /**
     * Verificar se fonte é suportada
     */
    public function isSourceSupported(string $sourceType): bool
    {
        return array_key_exists($sourceType, $this->supportedSources);
    }

    /**
     * Obter estatísticas de importação
     */
    public function getImportStats(int $userId): array
    {
        try {
            $integrations = LeadIntegration::where('user_id', $userId)
                ->where('integration_type', 'data_source')
                ->get();

            $stats = [
                'total_imports' => $integrations->count(),
                'successful_imports' => $integrations->where('status', 'success')->count(),
                'failed_imports' => $integrations->where('status', 'failed')->count(),
                'error_imports' => $integrations->where('status', 'error')->count(),
                'last_import' => $integrations->max('synced_at'),
                'imports_by_source' => $integrations->groupBy('integration_name')->map(function ($group) {
                    return [
                        'count' => $group->count(),
                        'successful' => $group->where('status', 'success')->count(),
                        'failed' => $group->where('status', 'failed')->count()
                    ];
                })->toArray()
            ];

            return $stats;
        } catch (\Exception $e) {
            Log::error('Error getting import stats: ' . $e->getMessage());
            return [];
        }
    }
}
