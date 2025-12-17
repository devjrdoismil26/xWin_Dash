<?php

namespace App\Shared\Exceptions;

/**
 * Exceção para violações de regras de negócio.
 */
class BusinessRuleException extends DomainException
{
    protected string $errorCode = 'BUSINESS_RULE_VIOLATION';

    public static function statusTransitionNotAllowed(string $from, string $to): self
    {
        return new self("Não é possível alterar o status de '{$from}' para '{$to}'.", [
            'from_status' => $from,
            'to_status' => $to,
        ]);
    }

    public static function operationNotAllowed(string $operation, string $reason = ''): self
    {
        $message = "A operação '{$operation}' não é permitida.";
        if ($reason) {
            $message .= " {$reason}";
        }

        return new self($message, ['operation' => $operation, 'reason' => $reason]);
    }

    public static function resourceLimit(string $resource, int $limit): self
    {
        return new self("Limite de {$resource} excedido. Máximo permitido: {$limit}.", [
            'resource' => $resource,
            'limit' => $limit,
        ]);
    }

    public static function incompatibleConfiguration(string $type, string $model): self
    {
        return new self("Modelo {$model} não é compatível com o tipo {$type}.", [
            'type' => $type,
            'model' => $model,
        ]);
    }
}
