<?php

namespace App\Shared\Exceptions;

/**
 * Exceção para erros de validação de entrada.
 */
class ValidationException extends DomainException
{
    protected string $errorCode = 'VALIDATION_ERROR';

    public static function required(string $field): self
    {
        return new self("O campo '{$field}' é obrigatório.", ['field' => $field]);
    }

    public static function minLength(string $field, int $minLength): self
    {
        return new self("O campo '{$field}' deve ter pelo menos {$minLength} caracteres.", [
            'field' => $field,
            'min_length' => $minLength,
        ]);
    }

    public static function maxLength(string $field, int $maxLength): self
    {
        return new self("O campo '{$field}' não pode exceder {$maxLength} caracteres.", [
            'field' => $field,
            'max_length' => $maxLength,
        ]);
    }

    public static function invalid(string $field, string $reason = ''): self
    {
        $message = "O campo '{$field}' é inválido.";
        if ($reason) {
            $message .= " {$reason}";
        }

        return new self($message, ['field' => $field, 'reason' => $reason]);
    }

    public static function duplicate(string $field, string $value): self
    {
        return new self("Já existe um registro com {$field}: '{$value}'.", [
            'field' => $field,
            'value' => $value,
        ]);
    }
}
