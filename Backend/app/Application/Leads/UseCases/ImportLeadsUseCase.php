<?php

namespace App\Application\Leads\UseCases;

use App\Application\Leads\Commands\ImportLeadsCommand;
use App\Domains\Leads\Services\LeadService;
use App\Domains\Leads\Services\ScoringService;
use App\Shared\Services\CrossModuleOrchestrationService;
use App\Shared\ValueObjects\Email;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * UseCase para importação de leads em lote
 * Implementa validação, processamento e orquestração
 */
class ImportLeadsUseCase
{
    protected LeadService $leadService;
    protected ScoringService $scoringService;
    protected CrossModuleOrchestrationService $orchestrationService;

    public function __construct(
        LeadService $leadService,
        ScoringService $scoringService,
        CrossModuleOrchestrationService $orchestrationService
    ) {
        $this->leadService = $leadService;
        $this->scoringService = $scoringService;
        $this->orchestrationService = $orchestrationService;
    }

    /**
     * Executa o caso de uso para importação de leads
     *
     * @param ImportLeadsCommand $command
     * @return array
     */
    public function execute(ImportLeadsCommand $command): array
    {
        try {
            DB::beginTransaction();

            // 1. Validar arquivo
            $this->validateFile($command);

            // 2. Processar arquivo
            $csvData = $this->processFile($command->file);

            // 3. Validar dados
            $validatedData = $this->validateData($csvData, $command);

            // 4. Processar leads em lote
            $results = $this->processLeadsBatch($validatedData, $command);

            // 5. Aplicar pós-processamento
            $this->postProcessImport($results, $command);

            DB::commit();

            Log::info("Importação de leads concluída via UseCase", [
                'total_rows' => $results['total_rows'],
                'imported' => $results['imported'],
                'errors' => $results['errors'],
                'user_id' => $command->userId
            ]);

            return $results;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro na importação de leads via UseCase", [
                'user_id' => $command->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Valida o arquivo de importação
     */
    private function validateFile(ImportLeadsCommand $command): void
    {
        if (!$command->file || !$command->file->isValid()) {
            throw new \Exception('Arquivo inválido ou corrompido');
        }

        // Validar tipo de arquivo
        $allowedTypes = ['text/csv', 'application/csv', 'text/plain'];
        if (!in_array($command->file->getMimeType(), $allowedTypes)) {
            throw new \Exception('Tipo de arquivo não suportado. Use CSV.');
        }

        // Validar tamanho do arquivo
        $maxSize = 10 * 1024 * 1024; // 10MB
        if ($command->file->getSize() > $maxSize) {
            throw new \Exception('Arquivo muito grande. Máximo 10MB.');
        }

        // Validar extensão
        $extension = $command->file->getClientOriginalExtension();
        if (!in_array(strtolower($extension), ['csv', 'txt'])) {
            throw new \Exception('Extensão de arquivo não suportada. Use .csv ou .txt');
        }
    }

    /**
     * Processa o arquivo CSV
     */
    private function processFile($file): array
    {
        $csvData = [];
        $handle = fopen($file->getPathname(), 'r');

        if (!$handle) {
            throw new \Exception('Não foi possível abrir o arquivo');
        }

        // Ler header
        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            throw new \Exception('Arquivo CSV vazio ou inválido');
        }

        // Normalizar headers
        $headers = array_map('trim', $headers);
        $headers = array_map('strtolower', $headers);

        // Ler dados
        $rowNumber = 1;
        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;
            
            if (count($row) !== count($headers)) {
                Log::warning("Linha {$rowNumber} tem número incorreto de colunas", [
                    'expected' => count($headers),
                    'actual' => count($row)
                ]);
                continue;
            }

            $csvData[] = array_combine($headers, $row);
        }

        fclose($handle);

        if (empty($csvData)) {
            throw new \Exception('Nenhum dado encontrado no arquivo');
        }

        return $csvData;
    }

    /**
     * Valida dados do CSV
     */
    private function validateData(array $csvData, ImportLeadsCommand $command): array
    {
        $validatedData = [];
        $errors = [];

        foreach ($csvData as $index => $row) {
            $rowNumber = $index + 2; // +2 porque começamos do header
            $rowErrors = [];

            // Validar email obrigatório
            if (empty($row['email']) || !filter_var($row['email'], FILTER_VALIDATE_EMAIL)) {
                $rowErrors[] = 'Email inválido ou ausente';
            }

            // Validar nome obrigatório
            if (empty($row['name']) || strlen(trim($row['name'])) < 2) {
                $rowErrors[] = 'Nome deve ter pelo menos 2 caracteres';
            }

            // Validar telefone se fornecido
            if (!empty($row['phone']) && !$this->isValidPhone($row['phone'])) {
                $rowErrors[] = 'Telefone inválido';
            }

            // Validar fonte se fornecida
            if (!empty($row['source'])) {
                $validSources = ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'event'];
                if (!in_array($row['source'], $validSources)) {
                    $rowErrors[] = 'Fonte inválida';
                }
            }

            if (empty($rowErrors)) {
                $validatedData[] = $this->normalizeRowData($row);
            } else {
                $errors[] = [
                    'row' => $rowNumber,
                    'errors' => $rowErrors,
                    'data' => $row
                ];
            }
        }

        // Se muitos erros, falhar
        $errorRate = count($errors) / count($csvData);
        if ($errorRate > 0.5) { // Mais de 50% de erro
            throw new \Exception("Taxa de erro muito alta: " . round($errorRate * 100, 2) . "%");
        }

        return [
            'valid_data' => $validatedData,
            'errors' => $errors
        ];
    }

    /**
     * Normaliza dados de uma linha
     */
    private function normalizeRowData(array $row): array
    {
        return [
            'name' => trim(ucwords(strtolower($row['name']))),
            'email' => strtolower(trim($row['email'])),
            'phone' => !empty($row['phone']) ? $this->normalizePhone($row['phone']) : null,
            'company' => !empty($row['company']) ? trim($row['company']) : null,
            'source' => !empty($row['source']) ? $row['source'] : 'import',
            'status' => 'new',
            'score' => 10, // Score inicial
            'custom_fields' => $this->extractCustomFields($row),
            'metadata' => [
                'imported_via' => 'csv_import',
                'imported_at' => now(),
                'original_data' => $row
            ]
        ];
    }

    /**
     * Extrai campos personalizados da linha
     */
    private function extractCustomFields(array $row): array
    {
        $customFields = [];
        $standardFields = ['name', 'email', 'phone', 'company', 'source', 'status'];

        foreach ($row as $key => $value) {
            if (!in_array($key, $standardFields) && !empty($value)) {
                $customFields[$key] = trim($value);
            }
        }

        return $customFields;
    }

    /**
     * Processa leads em lote
     */
    private function processLeadsBatch(array $validatedData, ImportLeadsCommand $command): array
    {
        $results = [
            'total_rows' => count($validatedData['valid_data']) + count($validatedData['errors']),
            'imported' => 0,
            'errors' => count($validatedData['errors']),
            'error_details' => $validatedData['errors'],
            'imported_leads' => []
        ];

        foreach ($validatedData['valid_data'] as $leadData) {
            try {
                // Verificar duplicação
                if ($this->isDuplicate($leadData['email'])) {
                    $results['errors']++;
                    $results['error_details'][] = [
                        'row' => 'N/A',
                        'errors' => ['Lead já existe com este email'],
                        'data' => $leadData
                    ];
                    continue;
                }

                // Criar lead
                $lead = $this->leadService->createLead($leadData);

                // Aplicar scoring
                $this->applyImportScoring($lead, $leadData);

                // Orquestrar integrações
                $this->orchestrateImportIntegrations($lead, $command);

                $results['imported']++;
                $results['imported_leads'][] = $lead;

            } catch (\Exception $e) {
                $results['errors']++;
                $results['error_details'][] = [
                    'row' => 'N/A',
                    'errors' => [$e->getMessage()],
                    'data' => $leadData
                ];
                Log::error("Erro ao importar lead", [
                    'email' => $leadData['email'],
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $results;
    }

    /**
     * Verifica se lead é duplicado
     */
    private function isDuplicate(string $email): bool
    {
        // Implementar verificação de duplicação
        // Por enquanto, retorna false
        return false;
    }

    /**
     * Aplica scoring para leads importados
     */
    private function applyImportScoring($lead, array $leadData): void
    {
        $score = 10; // Score base para importação

        // Bônus por dados completos
        if (!empty($leadData['phone'])) {
            $score += 5;
        }

        if (!empty($leadData['company'])) {
            $score += 10;
        }

        // Bônus por campos personalizados
        if (!empty($leadData['custom_fields'])) {
            $score += count($leadData['custom_fields']) * 2;
        }

        $this->scoringService->updateLeadScore($lead->id, $score, 'Score inicial de importação');
    }

    /**
     * Orquestra integrações para leads importados
     */
    private function orchestrateImportIntegrations($lead, ImportLeadsCommand $command): void
    {
        // Adicionar à lista de email marketing
        $this->orchestrationService->addLeadToEmailList($lead, 'imported_leads');

        // Sincronizar com CRM
        $this->orchestrationService->syncLeadToCRM($lead);

        // Registrar atividade de importação
        $this->leadService->recordActivity($lead->id, [
            'type' => 'lead_imported',
            'description' => 'Lead importado via CSV',
            'metadata' => [
                'import_batch_id' => $command->batchId ?? null,
                'import_source' => 'csv_import'
            ]
        ]);
    }

    /**
     * Pós-processamento da importação
     */
    private function postProcessImport(array $results, ImportLeadsCommand $command): void
    {
        // Notificar usuário sobre resultado
        $this->orchestrationService->notifyImportCompletion($command->userId, $results);

        // Aplicar automações para leads importados
        foreach ($results['imported_leads'] as $lead) {
            $this->orchestrationService->triggerImportAutomation($lead);
        }

        // Atualizar estatísticas
        $this->orchestrationService->updateImportStatistics($results);
    }

    /**
     * Valida telefone
     */
    private function isValidPhone(string $phone): bool
    {
        // Remove caracteres não numéricos
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        
        // Verifica se tem pelo menos 10 dígitos
        return strlen($cleanPhone) >= 10;
    }

    /**
     * Normaliza telefone
     */
    private function normalizePhone(string $phone): string
    {
        // Remove caracteres não numéricos
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        
        // Adiciona código do país se necessário
        if (strlen($cleanPhone) === 11 && substr($cleanPhone, 0, 1) !== '5') {
            $cleanPhone = '55' . $cleanPhone;
        }
        
        return $cleanPhone;
    }
}