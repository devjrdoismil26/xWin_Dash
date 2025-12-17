<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Exceptions\IntegrationNotImplementedException;
use App\Domains\Leads\Models\Lead as LeadModel;
use App\Domains\Leads\Models\LeadIntegration;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

/**
 * 🔗 CRM Integration Service
 *
 * Serviço especializado para integração com CRMs
 * Responsável por sincronizar leads com sistemas CRM externos
 */
class CRMIntegrationService
{
    private array $supportedCrms = [
        'salesforce' => 'Salesforce',
        'hubspot' => 'HubSpot',
        'pipedrive' => 'Pipedrive',
        'zoho' => 'Zoho CRM',
        'monday' => 'Monday.com'
    ];

    /**
     * Sincronizar lead com CRM
     */
    public function syncLeadToCrm(Lead $lead, string $crmType): bool
    {
        try {
            Log::info("Sincronizando Lead ID: {$lead->id} com CRM: {$crmType}");

            if (!array_key_exists($crmType, $this->supportedCrms)) {
                throw new IntegrationNotImplementedException("Integração com CRM '{$crmType}' não implementada");
            }

            $result = match ($crmType) {
                'salesforce' => $this->syncToSalesforce($lead),
                'hubspot' => $this->syncToHubSpot($lead),
                'pipedrive' => $this->syncToPipedrive($lead),
                'zoho' => $this->syncToZoho($lead),
                'monday' => $this->syncToMonday($lead),
                default => false
            };

            if ($result) {
                $this->recordIntegration($lead->id, $crmType, 'success');
                Log::info("Lead ID: {$lead->id} sincronizado com sucesso para {$crmType}");
            } else {
                $this->recordIntegration($lead->id, $crmType, 'failed');
                Log::error("Falha ao sincronizar Lead ID: {$lead->id} com {$crmType}");
            }

            return $result;
        } catch (\Exception $e) {
            Log::error("Erro ao sincronizar Lead ID: {$lead->id} com {$crmType}: " . $e->getMessage());
            $this->recordIntegration($lead->id, $crmType, 'error', $e->getMessage());
            return false;
        }
    }

    /**
     * Sincronizar com Salesforce
     */
    private function syncToSalesforce(Lead $lead): bool
    {
        try {
            $credentials = $this->getCrmCredentials('salesforce');
            if (!$credentials) {
                throw new \Exception('Salesforce credentials not configured');
            }

            $leadData = $this->mapLeadToSalesforce($lead);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $credentials['access_token'],
                'Content-Type' => 'application/json'
            ])->post($credentials['instance_url'] . '/services/data/v58.0/sobjects/Lead/', $leadData);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Salesforce sync error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Sincronizar com HubSpot
     */
    private function syncToHubSpot(Lead $lead): bool
    {
        try {
            $credentials = $this->getCrmCredentials('hubspot');
            if (!$credentials) {
                throw new \Exception('HubSpot credentials not configured');
            }

            $leadData = $this->mapLeadToHubSpot($lead);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $credentials['access_token'],
                'Content-Type' => 'application/json'
            ])->post('https://api.hubapi.com/crm/v3/objects/contacts', $leadData);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('HubSpot sync error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Sincronizar com Pipedrive
     */
    private function syncToPipedrive(Lead $lead): bool
    {
        try {
            $credentials = $this->getCrmCredentials('pipedrive');
            if (!$credentials) {
                throw new \Exception('Pipedrive credentials not configured');
            }

            $leadData = $this->mapLeadToPipedrive($lead);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $credentials['api_token'],
                'Content-Type' => 'application/json'
            ])->post('https://api.pipedrive.com/v1/persons', $leadData);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Pipedrive sync error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Sincronizar com Zoho
     */
    private function syncToZoho(Lead $lead): bool
    {
        try {
            $credentials = $this->getCrmCredentials('zoho');
            if (!$credentials) {
                throw new \Exception('Zoho credentials not configured');
            }

            $leadData = $this->mapLeadToZoho($lead);

            $response = Http::withHeaders([
                'Authorization' => 'Zoho-oauthtoken ' . $credentials['access_token'],
                'Content-Type' => 'application/json'
            ])->post('https://www.zohoapis.com/crm/v2/Leads', $leadData);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Zoho sync error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Sincronizar com Monday.com
     */
    private function syncToMonday(Lead $lead): bool
    {
        try {
            $credentials = $this->getCrmCredentials('monday');
            if (!$credentials) {
                throw new \Exception('Monday.com credentials not configured');
            }

            $leadData = $this->mapLeadToMonday($lead);

            $response = Http::withHeaders([
                'Authorization' => $credentials['api_token'],
                'Content-Type' => 'application/json'
            ])->post('https://api.monday.com/v2', [
                'query' => 'mutation { create_item (board_id: ' . $credentials['board_id'] . ', item: ' . json_encode($leadData) . ') { id } }'
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Monday.com sync error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Mapear lead para formato Salesforce
     */
    private function mapLeadToSalesforce(Lead $lead): array
    {
        return [
            'FirstName' => $lead->firstName,
            'LastName' => $lead->lastName,
            'Email' => $lead->email,
            'Phone' => $lead->phone,
            'Company' => $lead->company,
            'LeadSource' => $lead->source,
            'Status' => $this->mapStatusToSalesforce($lead->status),
            'Description' => $lead->notes
        ];
    }

    /**
     * Mapear lead para formato HubSpot
     */
    private function mapLeadToHubSpot(Lead $lead): array
    {
        return [
            'properties' => [
                'firstname' => $lead->firstName,
                'lastname' => $lead->lastName,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'company' => $lead->company,
                'hs_lead_status' => $this->mapStatusToHubSpot($lead->status),
                'lifecyclestage' => 'lead',
                'notes_last_contacted' => $lead->notes
            ]
        ];
    }

    /**
     * Mapear lead para formato Pipedrive
     */
    private function mapLeadToPipedrive(Lead $lead): array
    {
        return [
            'name' => $lead->firstName . ' ' . $lead->lastName,
            'email' => [
                ['value' => $lead->email, 'primary' => true]
            ],
            'phone' => [
                ['value' => $lead->phone, 'primary' => true]
            ],
            'org_name' => $lead->company,
            'label' => $this->mapStatusToPipedrive($lead->status)
        ];
    }

    /**
     * Mapear lead para formato Zoho
     */
    private function mapLeadToZoho(Lead $lead): array
    {
        return [
            'data' => [
                [
                    'First_Name' => $lead->firstName,
                    'Last_Name' => $lead->lastName,
                    'Email' => $lead->email,
                    'Phone' => $lead->phone,
                    'Company' => $lead->company,
                    'Lead_Source' => $lead->source,
                    'Lead_Status' => $this->mapStatusToZoho($lead->status),
                    'Description' => $lead->notes
                ]
            ]
        ];
    }

    /**
     * Mapear lead para formato Monday.com
     */
    private function mapLeadToMonday(Lead $lead): array
    {
        return [
            'name' => $lead->firstName . ' ' . $lead->lastName,
            'column_values' => [
                'email' => $lead->email,
                'phone' => $lead->phone,
                'company' => $lead->company,
                'status' => $this->mapStatusToMonday($lead->status),
                'notes' => $lead->notes
            ]
        ];
    }

    /**
     * Mapear status para Salesforce
     */
    private function mapStatusToSalesforce(string $status): string
    {
        $mapping = [
            'new' => 'New',
            'contacted' => 'Contacted',
            'qualified' => 'Qualified',
            'unqualified' => 'Unqualified',
            'converted' => 'Converted'
        ];

        return $mapping[$status] ?? 'New';
    }

    /**
     * Mapear status para HubSpot
     */
    private function mapStatusToHubSpot(string $status): string
    {
        $mapping = [
            'new' => 'NEW',
            'contacted' => 'CONNECTED',
            'qualified' => 'QUALIFIED',
            'unqualified' => 'UNQUALIFIED',
            'converted' => 'CONVERTED'
        ];

        return $mapping[$status] ?? 'NEW';
    }

    /**
     * Mapear status para Pipedrive
     */
    private function mapStatusToPipedrive(string $status): string
    {
        $mapping = [
            'new' => 'New',
            'contacted' => 'Contacted',
            'qualified' => 'Qualified',
            'unqualified' => 'Unqualified',
            'converted' => 'Converted'
        ];

        return $mapping[$status] ?? 'New';
    }

    /**
     * Mapear status para Zoho
     */
    private function mapStatusToZoho(string $status): string
    {
        $mapping = [
            'new' => 'Not Contacted',
            'contacted' => 'Contacted',
            'qualified' => 'Qualified',
            'unqualified' => 'Unqualified',
            'converted' => 'Converted'
        ];

        return $mapping[$status] ?? 'Not Contacted';
    }

    /**
     * Mapear status para Monday.com
     */
    private function mapStatusToMonday(string $status): string
    {
        $mapping = [
            'new' => 'New',
            'contacted' => 'Contacted',
            'qualified' => 'Qualified',
            'unqualified' => 'Unqualified',
            'converted' => 'Converted'
        ];

        return $mapping[$status] ?? 'New';
    }

    /**
     * Obter credenciais do CRM
     */
    private function getCrmCredentials(string $crmType): ?array
    {
        // Implementar lógica para obter credenciais do banco de dados
        // Por enquanto, retornar null para simular não configurado
        return null;
    }

    /**
     * Registrar integração
     */
    private function recordIntegration(int $leadId, string $crmType, string $status, ?string $error = null): void
    {
        try {
            LeadIntegration::create([
                'lead_id' => $leadId,
                'integration_type' => 'crm',
                'integration_name' => $crmType,
                'status' => $status,
                'error_message' => $error,
                'synced_at' => now()
            ]);
        } catch (\Exception $e) {
            Log::error('Error recording integration: ' . $e->getMessage());
        }
    }

    /**
     * Obter CRMs suportados
     */
    public function getSupportedCrms(): array
    {
        return $this->supportedCrms;
    }

    /**
     * Verificar se CRM é suportado
     */
    public function isCrmSupported(string $crmType): bool
    {
        return array_key_exists($crmType, $this->supportedCrms);
    }

    /**
     * Obter estatísticas de integração
     */
    public function getIntegrationStats(int $leadId): array
    {
        try {
            $integrations = LeadIntegration::where('lead_id', $leadId)
                ->where('integration_type', 'crm')
                ->get();

            $stats = [
                'total_integrations' => $integrations->count(),
                'successful_integrations' => $integrations->where('status', 'success')->count(),
                'failed_integrations' => $integrations->where('status', 'failed')->count(),
                'error_integrations' => $integrations->where('status', 'error')->count(),
                'last_sync' => $integrations->max('synced_at'),
                'integrations' => $integrations->map(function ($integration) {
                    return [
                        'crm_type' => $integration->integration_name,
                        'status' => $integration->status,
                        'synced_at' => $integration->synced_at,
                        'error_message' => $integration->error_message
                    ];
                })->toArray()
            ];

            return $stats;
        } catch (\Exception $e) {
            Log::error('Error getting integration stats: ' . $e->getMessage());
            return [];
        }
    }
}
