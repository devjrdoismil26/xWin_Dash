<?php

namespace App\Domains\Universe\Application\Commands;

class GenerateUniverseReportCommand
{
    public function __construct(
        public readonly int $instanceId,
        public readonly int $userId,
        public readonly string $reportType,
        public readonly ?array $parameters = null,
        public readonly ?string $format = 'json',
        public readonly ?array $filters = null,
        public readonly ?string $period = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            instanceId: $data['instance_id'],
            userId: $data['user_id'],
            reportType: $data['report_type'],
            parameters: $data['parameters'] ?? null,
            format: $data['format'] ?? 'json',
            filters: $data['filters'] ?? null,
            period: $data['period'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'instance_id' => $this->instanceId,
            'user_id' => $this->userId,
            'report_type' => $this->reportType,
            'parameters' => $this->parameters,
            'format' => $this->format,
            'filters' => $this->filters,
            'period' => $this->period
        ];
    }

    public function isValid(): bool
    {
        return $this->instanceId > 0 && $this->userId > 0 && !empty($this->reportType);
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->instanceId <= 0) {
            $errors[] = 'ID da instância é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($this->reportType)) {
            $errors[] = 'Tipo de relatório é obrigatório';
        }

        if (!in_array($this->format, ['json', 'csv', 'pdf', 'xlsx'])) {
            $errors[] = 'Formato deve ser json, csv, pdf ou xlsx';
        }

        return $errors;
    }
}
