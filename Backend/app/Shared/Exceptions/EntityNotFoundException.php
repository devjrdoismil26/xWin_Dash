<?php

namespace App\Shared\Exceptions;

/**
 * Exceção para entidades não encontradas.
 */
class EntityNotFoundException extends DomainException
{
    protected string $errorCode = 'ENTITY_NOT_FOUND';

    public static function create(string $entityType, string $id): self
    {
        return new self("{$entityType} não encontrado com ID: {$id}.", [
            'entity_type' => $entityType,
            'entity_id' => $id,
        ]);
    }

    public static function byField(string $entityType, string $field, string $value): self
    {
        return new self("{$entityType} não encontrado com {$field}: {$value}.", [
            'entity_type' => $entityType,
            'field' => $field,
            'value' => $value,
        ]);
    }
}
