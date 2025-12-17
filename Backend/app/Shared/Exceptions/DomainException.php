<?php

namespace App\Shared\Exceptions;

use Exception;

/**
 * Exceção base para todas as exceções de domínio.
 */
abstract class DomainException extends Exception
{
    protected string $errorCode;

    /** @var array<string, mixed> */
    protected array $context;

    /**
     * @param array<string, mixed> $context
     */
    public function __construct(string $message = '', array $context = [], int $code = 0, ?Exception $previous = null)
    {
        $this->context = $context;
        parent::__construct($message, $code, $previous);
    }

    public function getErrorCode(): string
    {
        return $this->errorCode ?? static::class;
    }

    /**
     * @return array<string, mixed>
     */
    public function getContext(): array
    {
        return $this->context;
    }

    public function getFormattedMessage(): string
    {
        return $this->getMessage();
    }
}
