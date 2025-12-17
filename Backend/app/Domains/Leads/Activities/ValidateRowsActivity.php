<?php

namespace App\Domains\Leads\Activities;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * Validate Rows Activity
 * 
 * Activity for validating rows during lead import.
 * Validates lead data rows and returns validation results.
 */
class ValidateRowsActivity
{
    /**
     * Valid status values for leads
     */
    protected array $validStatuses = [
        'new',
        'contacted',
        'qualified',
        'converted',
        'lost',
        'nurturing',
        'unqualified'
    ];

    /**
     * Execute the row validation activity.
     * 
     * @param array $data Activity data containing rows to validate
     * @return array Result of the validation
     */
    public function execute(array $data): array
    {
        try {
            Log::info("ValidateRowsActivity::execute - starting", [
                'rows_count' => count($data['rows'] ?? [])
            ]);

            $rows = $data['rows'] ?? [];
            $validationRules = $data['validation_rules'] ?? [];
            $strictMode = $data['strict_mode'] ?? false;

            $validRows = [];
            $invalidRows = [];
            $errors = [];

            foreach ($rows as $index => $row) {
                $rowNumber = $index + 1;
                $rowErrors = $this->validateRow($row, $validationRules, $strictMode);

                if (empty($rowErrors)) {
                    $validRows[] = [
                        'row_number' => $rowNumber,
                        'data' => $row,
                        'validated_at' => now()->toIso8601String()
                    ];
                } else {
                    $invalidRows[] = [
                        'row_number' => $rowNumber,
                        'data' => $row,
                        'errors' => $rowErrors
                    ];
                    $errors[] = [
                        'row' => $rowNumber,
                        'errors' => $rowErrors
                    ];
                }
            }

            $totalRows = count($rows);
            $validCount = count($validRows);
            $invalidCount = count($invalidRows);
            $successRate = $totalRows > 0 ? round(($validCount / $totalRows) * 100, 2) : 0;

            Log::info("ValidateRowsActivity::execute - completed", [
                'total_rows' => $totalRows,
                'valid_count' => $validCount,
                'invalid_count' => $invalidCount,
                'success_rate' => $successRate
            ]);

            return [
                'success' => $invalidCount === 0,
                'valid_rows' => $validRows,
                'invalid_rows' => $invalidRows,
                'errors' => $errors,
                'statistics' => [
                    'total_rows' => $totalRows,
                    'valid_count' => $validCount,
                    'invalid_count' => $invalidCount,
                    'success_rate' => $successRate
                ],
                'message' => $invalidCount === 0 
                    ? "Todas as {$totalRows} linhas foram validadas com sucesso"
                    : "{$validCount} de {$totalRows} linhas válidas ({$successRate}%)"
            ];
        } catch (\Exception $e) {
            Log::error("ValidateRowsActivity::execute - error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'valid_rows' => [],
                'invalid_rows' => [],
                'errors' => [
                    [
                        'row' => 'all',
                        'errors' => ['Erro ao processar validação: ' . $e->getMessage()]
                    ]
                ],
                'message' => 'Erro ao validar linhas: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Validate a single row
     * 
     * @param array $row Row data to validate
     * @param array $customRules Custom validation rules
     * @param bool $strictMode If true, requires name and email
     * @return array Array of error messages (empty if valid)
     */
    protected function validateRow(array $row, array $customRules = [], bool $strictMode = false): array
    {
        $errors = [];

        // Build validation rules
        $rules = array_merge($this->getDefaultValidationRules($strictMode), $customRules);

        // Validate using Laravel Validator
        $validator = Validator::make($row, $rules, $this->getCustomMessages());

        if ($validator->fails()) {
            $errors = array_merge($errors, $validator->errors()->all());
        }

        // Additional business rule validations
        $businessErrors = $this->validateBusinessRules($row);
        $errors = array_merge($errors, $businessErrors);

        return $errors;
    }

    /**
     * Get default validation rules
     * 
     * @param bool $strictMode
     * @return array
     */
    protected function getDefaultValidationRules(bool $strictMode = false): array
    {
        $rules = [
            'name' => $strictMode ? 'required|string|max:255' : 'nullable|string|max:255',
            'email' => $strictMode ? 'required|email|max:255' : 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'notes' => 'nullable|string',
            'source' => 'nullable|string|max:255',
            'utm_source' => 'nullable|string|max:255',
            'utm_medium' => 'nullable|string|max:255',
            'utm_campaign' => 'nullable|string|max:255',
            'utm_content' => 'nullable|string|max:255',
            'utm_term' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:' . implode(',', $this->validStatuses),
            'score' => 'nullable|numeric|min:0|max:100',
            'value' => 'nullable|numeric|min:0',
            'assigned_to' => 'nullable|string|exists:users,id',
            'project_id' => 'nullable|string|exists:projects,id',
        ];

        // At least one contact method required
        if (!$strictMode) {
            $rules['email_or_phone'] = 'required_without_all:email,phone';
        }

        return $rules;
    }

    /**
     * Get custom validation messages
     * 
     * @return array
     */
    protected function getCustomMessages(): array
    {
        return [
            'name.required' => 'O campo nome é obrigatório',
            'name.string' => 'O campo nome deve ser um texto',
            'name.max' => 'O campo nome não pode ter mais de 255 caracteres',
            'email.required' => 'O campo email é obrigatório',
            'email.email' => 'O campo email deve ser um endereço de email válido',
            'email.max' => 'O campo email não pode ter mais de 255 caracteres',
            'phone.string' => 'O campo telefone deve ser um texto',
            'phone.max' => 'O campo telefone não pode ter mais de 50 caracteres',
            'company.string' => 'O campo empresa deve ser um texto',
            'company.max' => 'O campo empresa não pode ter mais de 255 caracteres',
            'position.string' => 'O campo cargo deve ser um texto',
            'position.max' => 'O campo cargo não pode ter mais de 255 caracteres',
            'website.url' => 'O campo website deve ser uma URL válida',
            'website.max' => 'O campo website não pode ter mais de 255 caracteres',
            'source.string' => 'O campo origem deve ser um texto',
            'source.max' => 'O campo origem não pode ter mais de 255 caracteres',
            'status.in' => 'O status deve ser um dos valores válidos: ' . implode(', ', $this->validStatuses),
            'score.numeric' => 'O campo score deve ser um número',
            'score.min' => 'O campo score não pode ser menor que 0',
            'score.max' => 'O campo score não pode ser maior que 100',
            'value.numeric' => 'O campo valor deve ser um número',
            'value.min' => 'O campo valor não pode ser negativo',
            'assigned_to.exists' => 'O usuário atribuído não existe',
            'project_id.exists' => 'O projeto não existe',
            'email_or_phone.required_without_all' => 'É necessário fornecer pelo menos um email ou telefone',
        ];
    }

    /**
     * Validate business rules
     * 
     * @param array $row
     * @return array
     */
    protected function validateBusinessRules(array $row): array
    {
        $errors = [];

        // Validate email format more strictly
        if (isset($row['email']) && !empty($row['email'])) {
            if (!filter_var($row['email'], FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Email inválido: {$row['email']}";
            }

            // Check for common email issues
            if (strlen($row['email']) > 255) {
                $errors[] = "Email muito longo (máximo 255 caracteres)";
            }
        }

        // Validate phone format (basic)
        if (isset($row['phone']) && !empty($row['phone'])) {
            // Remove common phone formatting characters
            $cleanPhone = preg_replace('/[^0-9+()-\s]/', '', $row['phone']);
            
            // Basic phone validation (at least 8 digits)
            $digitsOnly = preg_replace('/[^0-9]/', '', $cleanPhone);
            if (strlen($digitsOnly) < 8) {
                $errors[] = "Telefone inválido: deve conter pelo menos 8 dígitos";
            }
        }

        // Validate website URL
        if (isset($row['website']) && !empty($row['website'])) {
            // Add protocol if missing
            $website = $row['website'];
            if (!preg_match('/^https?:\/\//', $website)) {
                $website = 'http://' . $website;
            }

            if (!filter_var($website, FILTER_VALIDATE_URL)) {
                $errors[] = "Website inválido: {$row['website']}";
            }
        }

        // Validate status
        if (isset($row['status']) && !empty($row['status'])) {
            if (!in_array(strtolower($row['status']), $this->validStatuses)) {
                $errors[] = "Status inválido: {$row['status']}. Valores válidos: " . implode(', ', $this->validStatuses);
            }
        }

        // Validate score range
        if (isset($row['score'])) {
            $score = is_numeric($row['score']) ? (float) $row['score'] : null;
            if ($score !== null && ($score < 0 || $score > 100)) {
                $errors[] = "Score deve estar entre 0 e 100, recebido: {$row['score']}";
            }
        }

        // Validate value (must be positive)
        if (isset($row['value'])) {
            $value = is_numeric($row['value']) ? (float) $row['value'] : null;
            if ($value !== null && $value < 0) {
                $errors[] = "Valor não pode ser negativo, recebido: {$row['value']}";
            }
        }

        // At least one contact method (email or phone) required
        $hasEmail = !empty($row['email']);
        $hasPhone = !empty($row['phone']);
        if (!$hasEmail && !$hasPhone) {
            $errors[] = "É necessário fornecer pelo menos um email ou telefone";
        }

        return $errors;
    }
}
