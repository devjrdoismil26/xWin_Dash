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
 * 🔗 Integration Service
 *
 * Serviço principal para integrações de leads
 * Orquestra os serviços especializados de CRM e fontes de dados
 */
class IntegrationService
{
    private CRMIntegrationService $crmIntegrationService;
    private DataSourceIntegrationService $dataSourceIntegrationService;

    public function __construct(
        CRMIntegrationService $crmIntegrationService,
        DataSourceIntegrationService $dataSourceIntegrationService
    ) {
        $this->crmIntegrationService = $crmIntegrationService;
        $this->dataSourceIntegrationService = $dataSourceIntegrationService;
    }

    /**
     * Sincronizar lead com CRM
     */
    public function syncLeadToCrm(Lead $lead, string $crmType): bool
    {
        return $this->crmIntegrationService->syncLeadToCrm($lead, $crmType);
    }

    /**
     * Importar leads de fonte de dados
     */
    public function importLeadsFromSource(string $sourceType, array $config): array
    {
        return $this->dataSourceIntegrationService->importLeadsFromSource($sourceType, $config);
    }

    /**
     * Sincronizar múltiplos leads com CRM
     */
    public function syncMultipleLeadsToCrm(array $leads, string $crmType): array
    {
        $results = [
            'successful' => 0,
            'failed' => 0,
            'errors' => []
        ];

        foreach ($leads as $lead) {
            try {
                $success = $this->syncLeadToCrm($lead, $crmType);
                if ($success) {
                    $results['successful']++;
                } else {
                    $results['failed']++;
                    $results['errors'][] = "Failed to sync lead ID: {$lead->id}";
                }
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][] = "Error syncing lead ID: {$lead->id} - " . $e->getMessage();
            }
        }

        return $results;
    }

    /**
     * Obter estatísticas de integração
     */
    public function getIntegrationStats(int $leadId): array
    {
        return $this->crmIntegrationService->getIntegrationStats($leadId);
    }

    /**
     * Obter estatísticas de importação
     */
    public function getImportStats(int $userId): array
    {
        return $this->dataSourceIntegrationService->getImportStats($userId);
    }

    /**
     * Obter CRMs suportados
     */
    public function getSupportedCrms(): array
    {
        return $this->crmIntegrationService->getSupportedCrms();
    }

    /**
     * Obter fontes de dados suportadas
     */
    public function getSupportedSources(): array
    {
        return $this->dataSourceIntegrationService->getSupportedSources();
    }

    /**
     * Verificar se CRM é suportado
     */
    public function isCrmSupported(string $crmType): bool
    {
        return $this->crmIntegrationService->isCrmSupported($crmType);
    }

    /**
     * Verificar se fonte de dados é suportada
     */
    public function isSourceSupported(string $sourceType): bool
    {
        return $this->dataSourceIntegrationService->isSourceSupported($sourceType);
    }

    /**
     * Obter histórico de integrações
     */
    public function getIntegrationHistory(int $leadId, int $limit = 50): array
    {
        try {
            $integrations = LeadIntegration::where('lead_id', $leadId)
                ->orderBy('synced_at', 'desc')
                ->limit($limit)
                ->get();

            return $integrations->map(function ($integration) {
                return [
                    'id' => $integration->id,
                    'integration_type' => $integration->integration_type,
                    'integration_name' => $integration->integration_name,
                    'status' => $integration->status,
                    'error_message' => $integration->error_message,
                    'synced_at' => $integration->synced_at
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Error getting integration history: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Obter histórico de importações
     */
    public function getImportHistory(int $userId, int $limit = 50): array
    {
        try {
            $integrations = LeadIntegration::where('user_id', $userId)
                ->where('integration_type', 'data_source')
                ->orderBy('synced_at', 'desc')
                ->limit($limit)
                ->get();

            return $integrations->map(function ($integration) {
                return [
                    'id' => $integration->id,
                    'integration_name' => $integration->integration_name,
                    'status' => $integration->status,
                    'error_message' => $integration->error_message,
                    'synced_at' => $integration->synced_at
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Error getting import history: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Limpar histórico de integrações
     */
    public function clearIntegrationHistory(int $leadId, int $daysToKeep = 30): bool
    {
        try {
            $cutoffDate = now()->subDays($daysToKeep);

            LeadIntegration::where('lead_id', $leadId)
                ->where('synced_at', '<', $cutoffDate)
                ->delete();

            Log::info('Integration history cleared', [
                'lead_id' => $leadId,
                'days_to_keep' => $daysToKeep
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error clearing integration history: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Obter resumo de integrações
     */
    public function getIntegrationSummary(int $userId): array
    {
        try {
            $crmStats = $this->crmIntegrationService->getIntegrationStats(0); // 0 para obter stats gerais
            $importStats = $this->dataSourceIntegrationService->getImportStats($userId);

            return [
                'crm_integrations' => [
                    'supported_crms' => $this->getSupportedCrms(),
                    'stats' => $crmStats
                ],
                'data_sources' => [
                    'supported_sources' => $this->getSupportedSources(),
                    'stats' => $importStats
                ],
                'total_integrations' => ($crmStats['total_integrations'] ?? 0) + ($importStats['total_imports'] ?? 0)
            ];
        } catch (\Exception $e) {
            Log::error('Error getting integration summary: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Testar conexão com CRM
     */
    public function testCrmConnection(string $crmType): array
    {
        try {
            if (!$this->isCrmSupported($crmType)) {
                return [
                    'success' => false,
                    'error' => 'CRM not supported'
                ];
            }

            // Implementar teste de conexão específico para cada CRM
            $testResult = match ($crmType) {
                'salesforce' => $this->testSalesforceConnection(),
                'hubspot' => $this->testHubSpotConnection(),
                'pipedrive' => $this->testPipedriveConnection(),
                'zoho' => $this->testZohoConnection(),
                'monday' => $this->testMondayConnection(),
                default => ['success' => false, 'error' => 'Test not implemented']
            };

            return $testResult;
        } catch (\Exception $e) {
            Log::error('Error testing CRM connection: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Testar conexão com Salesforce
     */
    private function testSalesforceConnection(): array
    {
        // Implementar teste de conexão com Salesforce
        return ['success' => false, 'error' => 'Test not implemented'];
    }

    /**
     * Testar conexão com HubSpot
     */
    private function testHubSpotConnection(): array
    {
        // Implementar teste de conexão com HubSpot
        return ['success' => false, 'error' => 'Test not implemented'];
    }

    /**
     * Testar conexão com Pipedrive
     */
    private function testPipedriveConnection(): array
    {
        // Implementar teste de conexão com Pipedrive
        return ['success' => false, 'error' => 'Test not implemented'];
    }

    /**
     * Testar conexão com Zoho
     */
    private function testZohoConnection(): array
    {
        // Implementar teste de conexão com Zoho
        return ['success' => false, 'error' => 'Test not implemented'];
    }

    /**
     * Testar conexão com Monday.com
     */
    private function testMondayConnection(): array
    {
        // Implementar teste de conexão com Monday.com
        return ['success' => false, 'error' => 'Test not implemented'];
    }
}
