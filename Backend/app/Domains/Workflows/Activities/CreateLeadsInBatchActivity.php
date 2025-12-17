<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Leads\Services\LeadService;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class CreateLeadsInBatchActivity
{
    protected LeadService $leadService;

    public function __construct(LeadService $leadService)
    {
        $this->leadService = $leadService;
    }

    /**
     * Executa a atividade de criação de Leads em lote.
     *
     * @param array<string, mixed> $parameters parâmetros para a criação (ex: 'leads_data')
     * @param array<string, mixed> $payload    o payload atual do workflow
     *
     * @return array<string, mixed> o payload atualizado com os resultados da criação de Leads
     *
     * @throws \Exception se a criação falhar
     */
    public function execute(array $parameters, array $payload): array
    {
        Log::info("Executando CreateLeadsInBatchActivity.", [
            'leads_count' => count($parameters['leads_data'] ?? [])
        ]);

        $leadsData = $parameters['leads_data'] ?? [];
        $outputField = $parameters['output_field'] ?? 'created_leads_results';
        $checkDuplicates = $parameters['check_duplicates'] ?? true;
        $stopOnError = $parameters['stop_on_error'] ?? false;
        $batchSize = $parameters['batch_size'] ?? 50; // Processar em lotes para performance

        if (empty($leadsData) || !is_array($leadsData)) {
            throw new \Exception("Atividade de criação de Leads em lote inválida: 'leads_data' é obrigatório e deve ser um array.");
        }

        $results = [];
        $createdCount = 0;
        $duplicateCount = 0;
        $failedCount = 0;
        $errors = [];

        // Processar em lotes para melhor performance
        $batches = array_chunk($leadsData, $batchSize);
        
        foreach ($batches as $batchIndex => $batch) {
            foreach ($batch as $index => $leadData) {
                $globalIndex = ($batchIndex * $batchSize) + $index;
                
                try {
                    // Substituir placeholders nos dados do Lead com valores do payload
                    $finalLeadData = $this->replacePlaceholdersInArray($leadData, $payload);

                    // Validar dados básicos
                    if (empty($finalLeadData['name']) || (empty($finalLeadData['email']) && empty($finalLeadData['phone']))) {
                        throw new \Exception("Dados inválidos: nome e pelo menos um método de contato são obrigatórios");
                    }

                    // Verificar duplicata se habilitado
                    if ($checkDuplicates && !empty($finalLeadData['email'])) {
                        $existing = $this->leadService->getLeadByEmail($finalLeadData['email']);
                        if ($existing) {
                            $results[] = [
                                'index' => $globalIndex,
                                'status' => 'duplicate',
                                'lead_id' => $existing->id,
                                'message' => 'Lead já existe'
                            ];
                            $duplicateCount++;
                            continue;
                        }
                    }

                    // Criar lead
                    $lead = $this->leadService->createLead($finalLeadData);
                    $results[] = [
                        'index' => $globalIndex,
                        'status' => 'success',
                        'lead_id' => $lead->id,
                        'email' => $lead->email ?? null
                    ];
                    $createdCount++;
                } catch (\Exception $e) {
                    $errorMessage = $e->getMessage();
                    $results[] = [
                        'index' => $globalIndex,
                        'status' => 'failed',
                        'error' => $errorMessage,
                        'lead_data' => $leadData
                    ];
                    $errors[] = [
                        'index' => $globalIndex,
                        'error' => $errorMessage
                    ];
                    $failedCount++;
                    
                    Log::error("Falha ao criar Lead em lote (linha {$globalIndex}): " . $errorMessage);

                    // Parar se stopOnError estiver habilitado
                    if ($stopOnError) {
                        throw new \Exception("Criação em lote interrompida no índice {$globalIndex}: " . $errorMessage);
                    }
                }
            }
        }

        $payload[$outputField] = $results;
        $payload['created_leads_count'] = $createdCount;
        $payload['duplicate_leads_count'] = $duplicateCount;
        $payload['failed_leads_count'] = $failedCount;
        $payload['total_processed'] = count($leadsData);
        $payload['success_rate'] = count($leadsData) > 0 
            ? round(($createdCount / count($leadsData)) * 100, 2) 
            : 0;
        $payload['errors'] = $errors;

        Log::info("Criação de Leads em lote concluída.", [
            'total' => count($leadsData),
            'created' => $createdCount,
            'duplicates' => $duplicateCount,
            'failed' => $failedCount,
            'success_rate' => $payload['success_rate'] . '%'
        ]);

        return $payload;
    }

    /**
     * Substitui placeholders em um array com valores do payload.
     *
     * @param array<string, mixed> $array   o array com placeholders
     * @param array<string, mixed> $payload o payload do workflow
     *
     * @return array<string, mixed> o array com placeholders substituídos
     */
    protected function replacePlaceholdersInArray(array $array, array $payload): array
    {
        $newArray = [];
        foreach ($array as $key => $value) {
            if (is_string($value)) {
                $newArray[$key] = preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($matches) use ($payload) {
                    $k = $matches[1];
                    return $payload[$k] ?? $matches[0];
                }, $value);
            } elseif (is_array($value)) {
                $newArray[$key] = $this->replacePlaceholdersInArray($value, $payload);
            } else {
                $newArray[$key] = $value;
            }
        }
        return $newArray;
    }
}
