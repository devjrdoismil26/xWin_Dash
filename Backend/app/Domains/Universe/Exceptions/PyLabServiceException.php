<?php

declare(strict_types=1);

namespace App\Domains\Universe\Exceptions;

use Exception;

/**
 * 🚨 PyLab Service Exception.
 *
 * Exceção específica para erros do serviço PyLab
 */
class PyLabServiceException extends Exception
{
    private ?string $taskId;

    /** @var array<string, mixed>|null */
    private ?array $context;

    /**
     * @param array<string, mixed>|null $context
     */
    public function __construct(
        string $message = '',
        int $code = 0,
        ?\Throwable $previous = null,
        ?string $taskId = null,
        ?array $context = null,
    ) {
        parent::__construct($message, $code, $previous);
        $this->taskId = $taskId;
        $this->context = $context;
    }

    public function getTaskId(): ?string
    {
        return $this->taskId;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getContext(): ?array
    {
        return $this->context;
    }

    /**
     * Exceção para quando o PyLab está offline.
     */
    public static function serviceOffline(string $message = 'PyLab service is offline'): self
    {
        return new self($message, 503);
    }

    /**
     * Exceção para timeout de geração.
     */
    public static function generationTimeout(string $taskId, int $timeoutSeconds): self
    {
        return new self(
            "Generation timeout after {$timeoutSeconds} seconds",
            408,
            null,
            $taskId,
        );
    }

    /**
     * Exceção para erro na geração.
     *
     * @param array<string, mixed>|null $context
     */
    public static function generationFailed(string $taskId, string $reason, ?array $context = null): self
    {
        return new self(
            "Generation failed: {$reason}",
            422,
            null,
            $taskId,
            $context,
        );
    }

    /**
     * Exceção para erro de comunicação.
     */
    public static function communicationError(string $message, ?\Throwable $previous = null): self
    {
        return new self(
            "PyLab communication error: {$message}",
            502,
            $previous,
        );
    }

    /**
     * Exceção para parâmetros inválidos.
     *
     * @param array<string, mixed>|null $context
     */
    public static function invalidParameters(string $message, ?array $context = null): self
    {
        return new self(
            "Invalid parameters: {$message}",
            400,
            null,
            null,
            $context,
        );
    }
}
