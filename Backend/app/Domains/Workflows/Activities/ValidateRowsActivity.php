<?php

namespace App\Domains\Workflows\Activities;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ValidateRowsActivity
{
    /**
     * Executa a atividade de validação de linhas de dados.
     *
     * @param array $parameters parâmetros para a validação (ex: 'data_rows', 'validation_rules')
     * @param array $payload    o payload atual do workflow
     *
     * @param array<string, mixed> $parameters
     * @param array<string, mixed> $payload
     * @return array<string, mixed> o payload atualizado com os resultados da validação (valid_rows, invalid_rows, errors)
     *
     * @throws \Exception se a validação falhar de forma crítica
     */
    public function execute(array $parameters, array $payload): array
    {
        Log::info("Executando ValidateRowsActivity.");

        $dataRows = $parameters['data_rows'] ?? [];
        $validationRules = $parameters['validation_rules'] ?? [];
        $outputFieldValid = $parameters['output_field_valid'] ?? 'valid_rows';
        $outputFieldInvalid = $parameters['output_field_invalid'] ?? 'invalid_rows';
        $outputFieldErrors = $parameters['output_field_errors'] ?? 'validation_errors';

        if (empty($dataRows) || !is_array($dataRows)) {
            throw new \Exception("Atividade de validação de linhas inválida: 'data_rows' é obrigatório e deve ser um array.");
        }
        if (empty($validationRules) || !is_array($validationRules)) {
            throw new \Exception("Atividade de validação de linhas inválida: 'validation_rules' é obrigatório e deve ser um array.");
        }

        $validRows = [];
        $invalidRows = [];
        $errors = [];

        foreach ($dataRows as $index => $row) {
            $validator = Validator::make($row, $validationRules);

            if ($validator->fails()) {
                $invalidRows[] = $row;
                $errors["row_" . $index] = $validator->errors()->toArray();
                Log::warning("Linha de dados inválida na validação: " . json_encode($row) . " Erros: " . json_encode($validator->errors()->toArray()));
            } else {
                $validRows[] = $row;
            }
        }

        $payload[$outputFieldValid] = $validRows;
        $payload[$outputFieldInvalid] = $invalidRows;
        $payload[$outputFieldErrors] = $errors;

        Log::info("Validação de linhas concluída. Válidas: " . count($validRows) . ", Inválidas: " . count($invalidRows) . ".");

        return $payload;
    }
}
