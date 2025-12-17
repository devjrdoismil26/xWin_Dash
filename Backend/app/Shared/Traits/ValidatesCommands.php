<?php

namespace App\Shared\Traits;

use App\Shared\Exceptions\ValidationException;

/**
 * Trait para padronizar validações de comandos.
 */
trait ValidatesCommands
{
    /**
     * Validar se um campo é obrigatório.
     */
    protected function validateRequired(mixed $value, string $fieldName): void
    {
        if (empty($value)) {
            throw ValidationException::required($fieldName);
        }
    }

    /**
     * Validar comprimento mínimo de string.
     */
    protected function validateMinLength(string $value, int $minLength, string $fieldName): void
    {
        if (strlen($value) < $minLength) {
            throw ValidationException::minLength($fieldName, $minLength);
        }
    }

    /**
     * Validar comprimento máximo de string.
     */
    protected function validateMaxLength(string $value, int $maxLength, string $fieldName): void
    {
        if (strlen($value) > $maxLength) {
            throw ValidationException::maxLength($fieldName, $maxLength);
        }
    }

    /**
     * Validar range de comprimento.
     */
    protected function validateLengthRange(string $value, int $minLength, int $maxLength, string $fieldName): void
    {
        $this->validateMinLength($value, $minLength, $fieldName);
        $this->validateMaxLength($value, $maxLength, $fieldName);
    }

    /**
     * Validar email.
     */
    protected function validateEmail(?string $email, string $fieldName): void
    {
        if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw ValidationException::invalid($fieldName, 'Formato de email inválido');
        }
    }

    /**
     * Validar UUID.
     */
    protected function validateUuid(string $uuid, string $fieldName): void
    {
        if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $uuid)) {
            throw ValidationException::invalid($fieldName, 'Formato de UUID inválido');
        }
    }

    /**
     * Validar número positivo.
     */
    protected function validatePositiveNumber(mixed $number, string $fieldName): void
    {
        if (!is_numeric($number) || $number <= 0) {
            throw ValidationException::invalid($fieldName, 'Deve ser um número positivo');
        }
    }

    /**
     * Validar que pelo menos um campo de uma lista está presente.
     */
    protected function validateAtLeastOne(array $fields, array $fieldNames): void
    {
        $hasValue = false;
        foreach ($fields as $field) {
            if (!empty($field)) {
                $hasValue = true;
                break;
            }
        }

        if (!$hasValue) {
            $fieldsStr = implode(' ou ', $fieldNames);
            throw ValidationException::invalid('campos obrigatórios', "Pelo menos um dos seguintes é obrigatório: {$fieldsStr}");
        }
    }

    /**
     * Validar array não vazio.
     */
    protected function validateNonEmptyArray(array $array, string $fieldName): void
    {
        if (empty($array)) {
            throw ValidationException::invalid($fieldName, 'Deve conter pelo menos um item');
        }
    }

    /**
     * Validar valor dentro de um conjunto de opções.
     */
    protected function validateInArray(mixed $value, array $allowedValues, string $fieldName): void
    {
        if (!in_array($value, $allowedValues)) {
            $optionsStr = implode(', ', $allowedValues);
            throw ValidationException::invalid($fieldName, "Valor deve ser um dos seguintes: {$optionsStr}");
        }
    }
}
