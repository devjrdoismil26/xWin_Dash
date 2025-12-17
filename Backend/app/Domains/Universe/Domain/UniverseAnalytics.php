<?php

namespace App\Domains\Universe\Domain;

use DateTime;
use InvalidArgumentException;

class UniverseAnalytics
{
    // Metric type constants
    public const METRIC_TYPE_COUNTER = 'counter';
    public const METRIC_TYPE_GAUGE = 'gauge';
    public const METRIC_TYPE_HISTOGRAM = 'histogram';
    public const METRIC_TYPE_SUMMARY = 'summary';

    // Metric name constants
    public const METRIC_NAME_VIEWS = 'views';
    public const METRIC_NAME_USERS = 'users';
    public const METRIC_NAME_SESSIONS = 'sessions';
    public const METRIC_NAME_DURATION = 'duration';
    public const METRIC_NAME_CLICKS = 'clicks';
    public const METRIC_NAME_CONVERSIONS = 'conversions';
    public const METRIC_NAME_REVENUE = 'revenue';
    public const METRIC_NAME_ERRORS = 'errors';
    public const METRIC_NAME_PERFORMANCE = 'performance';
    public const METRIC_NAME_ENGAGEMENT = 'engagement';

    public ?int $id;
    public string $metricName;
    public mixed $value;
    public string $metricType;
    public DateTime $timestamp;
    public ?int $instanceId;
    public int $userId;
    public ?array $labels;
    public ?array $metadata;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $metricName,
        mixed $value,
        DateTime $timestamp,
        int $userId,
        string $metricType = self::METRIC_TYPE_COUNTER,
        ?int $instanceId = null,
        ?array $labels = null,
        ?array $metadata = null,
        ?int $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateMetricName($metricName);
        $this->validateValue($value);
        $this->validateMetricType($metricType);
        $this->validateTimestamp($timestamp);
        $this->validateUserId($userId);
        $this->validateInstanceId($instanceId);
        $this->validateLabels($labels);
        $this->validateMetadata($metadata);

        $this->id = $id;
        $this->metricName = $metricName;
        $this->value = $value;
        $this->metricType = $metricType;
        $this->timestamp = $timestamp;
        $this->instanceId = $instanceId;
        $this->userId = $userId;
        $this->labels = $labels;
        $this->metadata = $metadata;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    // Validation methods
    private function validateMetricName(string $metricName): void
    {
        if (empty(trim($metricName))) {
            throw new InvalidArgumentException('Metric name cannot be empty');
        }
        if (strlen($metricName) > 255) {
            throw new InvalidArgumentException('Metric name cannot exceed 255 characters');
        }
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $metricName)) {
            throw new InvalidArgumentException(
                'Metric name must contain only letters, numbers, and underscores, and start with a letter or underscore'
            );
        }
    }

    private function validateValue(mixed $value): void
    {
        if (!is_numeric($value) && !is_string($value) && !is_bool($value) && !is_array($value)) {
            throw new InvalidArgumentException('Value must be numeric, string, boolean, or array');
        }
    }

    private function validateMetricType(string $metricType): void
    {
        $validTypes = [
            self::METRIC_TYPE_COUNTER,
            self::METRIC_TYPE_GAUGE,
            self::METRIC_TYPE_HISTOGRAM,
            self::METRIC_TYPE_SUMMARY
        ];

        if (!in_array($metricType, $validTypes)) {
            throw new InvalidArgumentException('Invalid metric type');
        }
    }

    private function validateTimestamp(DateTime $timestamp): void
    {
        if ($timestamp > new DateTime()) {
            throw new InvalidArgumentException('Timestamp cannot be in the future');
        }
    }

    private function validateUserId(int $userId): void
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User ID must be a positive integer');
        }
    }

    private function validateInstanceId(?int $instanceId): void
    {
        if ($instanceId !== null && $instanceId <= 0) {
            throw new InvalidArgumentException('Instance ID must be a positive integer');
        }
    }

    private function validateLabels(?array $labels): void
    {
        if ($labels !== null && !is_array($labels)) {
            throw new InvalidArgumentException('Labels must be an array');
        }
    }

    private function validateMetadata(?array $metadata): void
    {
        if ($metadata !== null && !is_array($metadata)) {
            throw new InvalidArgumentException('Metadata must be an array');
        }
    }

    /**
     * Cria uma instância da entidade a partir de um array de dados (ex: vindo do repositório).
     *
     * @param array $data
     *
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['metric_name'],
            $data['value'],
            new DateTime($data['timestamp']),
            $data['user_id'],
            $data['metric_type'] ?? self::METRIC_TYPE_COUNTER,
            $data['instance_id'] ?? null,
            $data['labels'] ?? null,
            $data['metadata'] ?? null,
            $data['id'] ?? null,
            isset($data['created_at']) ? new DateTime($data['created_at']) : null,
            isset($data['updated_at']) ? new DateTime($data['updated_at']) : null,
        );
    }

    /**
     * Converte a entidade para um array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'metric_name' => $this->metricName,
            'value' => $this->value,
            'metric_type' => $this->metricType,
            'timestamp' => $this->timestamp->format('Y-m-d H:i:s'),
            'instance_id' => $this->instanceId,
            'user_id' => $this->userId,
            'labels' => $this->labels,
            'metadata' => $this->metadata,
            'created_at' => $this->createdAt ? $this->createdAt->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updatedAt ? $this->updatedAt->format('Y-m-d H:i:s') : null,
        ];
    }

    // Domain logic methods
    public function updateValue(mixed $value): void
    {
        $this->validateValue($value);
        $this->value = $value;
        $this->updatedAt = new DateTime();
    }

    public function updateLabels(?array $labels): void
    {
        $this->validateLabels($labels);
        $this->labels = $labels;
        $this->updatedAt = new DateTime();
    }

    public function updateMetadata(array $metadata): void
    {
        $this->validateMetadata($metadata);
        $this->metadata = $metadata;
        $this->updatedAt = new DateTime();
    }

    public function addLabel(string $key, string $value): void
    {
        if ($this->labels === null) {
            $this->labels = [];
        }
        $this->labels[$key] = $value;
        $this->updatedAt = new DateTime();
    }

    public function removeLabel(string $key): void
    {
        if ($this->labels !== null && isset($this->labels[$key])) {
            unset($this->labels[$key]);
            $this->updatedAt = new DateTime();
        }
    }

    public function addMetadata(string $key, mixed $value): void
    {
        if ($this->metadata === null) {
            $this->metadata = [];
        }
        $this->metadata[$key] = $value;
        $this->updatedAt = new DateTime();
    }

    public function removeMetadata(string $key): void
    {
        if ($this->metadata !== null && isset($this->metadata[$key])) {
            unset($this->metadata[$key]);
            $this->updatedAt = new DateTime();
        }
    }

    // Query methods
    public function isCounter(): bool
    {
        return $this->metricType === self::METRIC_TYPE_COUNTER;
    }

    public function isGauge(): bool
    {
        return $this->metricType === self::METRIC_TYPE_GAUGE;
    }

    public function isHistogram(): bool
    {
        return $this->metricType === self::METRIC_TYPE_HISTOGRAM;
    }

    public function isSummary(): bool
    {
        return $this->metricType === self::METRIC_TYPE_SUMMARY;
    }

    public function isViews(): bool
    {
        return $this->metricName === self::METRIC_NAME_VIEWS;
    }

    public function isUsers(): bool
    {
        return $this->metricName === self::METRIC_NAME_USERS;
    }

    public function isSessions(): bool
    {
        return $this->metricName === self::METRIC_NAME_SESSIONS;
    }

    public function isDuration(): bool
    {
        return $this->metricName === self::METRIC_NAME_DURATION;
    }

    public function isClicks(): bool
    {
        return $this->metricName === self::METRIC_NAME_CLICKS;
    }

    public function isConversions(): bool
    {
        return $this->metricName === self::METRIC_NAME_CONVERSIONS;
    }

    public function isRevenue(): bool
    {
        return $this->metricName === self::METRIC_NAME_REVENUE;
    }

    public function isErrors(): bool
    {
        return $this->metricName === self::METRIC_NAME_ERRORS;
    }

    public function isPerformance(): bool
    {
        return $this->metricName === self::METRIC_NAME_PERFORMANCE;
    }

    public function isEngagement(): bool
    {
        return $this->metricName === self::METRIC_NAME_ENGAGEMENT;
    }

    public function hasInstance(): bool
    {
        return $this->instanceId !== null;
    }

    public function hasLabels(): bool
    {
        return $this->labels !== null && !empty($this->labels);
    }

    public function hasMetadata(): bool
    {
        return $this->metadata !== null && !empty($this->metadata);
    }

    public function hasLabel(string $key): bool
    {
        return $this->labels !== null && isset($this->labels[$key]);
    }

    public function hasMetadata(string $key): bool
    {
        return $this->metadata !== null && isset($this->metadata[$key]);
    }

    public function getLabel(string $key): ?string
    {
        return $this->labels[$key] ?? null;
    }

    public function getMetadata(string $key): mixed
    {
        return $this->metadata[$key] ?? null;
    }

    public function getNumericValue(): ?float
    {
        return is_numeric($this->value) ? (float) $this->value : null;
    }

    public function getStringValue(): ?string
    {
        return is_string($this->value) ? $this->value : null;
    }

    public function getBooleanValue(): ?bool
    {
        return is_bool($this->value) ? $this->value : null;
    }

    public function getArrayValue(): ?array
    {
        return is_array($this->value) ? $this->value : null;
    }

    public function getDaysSinceTimestamp(): int
    {
        return $this->timestamp->diff(new DateTime())->days;
    }

    public function getHoursSinceTimestamp(): int
    {
        return $this->timestamp->diff(new DateTime())->h;
    }

    public function getMinutesSinceTimestamp(): int
    {
        return $this->timestamp->diff(new DateTime())->i;
    }

    public function isRecent(int $minutes = 60): bool
    {
        return $this->getMinutesSinceTimestamp() <= $minutes;
    }

    public function isToday(): bool
    {
        return $this->timestamp->format('Y-m-d') === (new DateTime())->format('Y-m-d');
    }

    public function isThisWeek(): bool
    {
        $now = new DateTime();
        $weekStart = clone $now;
        $weekStart->modify('monday this week');
        $weekEnd = clone $weekStart;
        $weekEnd->modify('+6 days');

        return $this->timestamp >= $weekStart && $this->timestamp <= $weekEnd;
    }

    public function isThisMonth(): bool
    {
        return $this->timestamp->format('Y-m') === (new DateTime())->format('Y-m');
    }

    public function isThisYear(): bool
    {
        return $this->timestamp->format('Y') === (new DateTime())->format('Y');
    }

    // Static factory methods
    public static function createViews(int $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_VIEWS,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_COUNTER,
            $instanceId,
            $labels
        );
    }

    public static function createUsers(int $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_USERS,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_GAUGE,
            $instanceId,
            $labels
        );
    }

    public static function createSessions(int $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_SESSIONS,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_COUNTER,
            $instanceId,
            $labels
        );
    }

    public static function createDuration(float $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_DURATION,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_HISTOGRAM,
            $instanceId,
            $labels
        );
    }

    public static function createClicks(int $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_CLICKS,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_COUNTER,
            $instanceId,
            $labels
        );
    }

    public static function createConversions(int $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_CONVERSIONS,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_COUNTER,
            $instanceId,
            $labels
        );
    }

    public static function createRevenue(float $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_REVENUE,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_GAUGE,
            $instanceId,
            $labels
        );
    }

    public static function createErrors(int $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_ERRORS,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_COUNTER,
            $instanceId,
            $labels
        );
    }

    public static function createPerformance(float $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_PERFORMANCE,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_GAUGE,
            $instanceId,
            $labels
        );
    }

    public static function createEngagement(float $value, int $userId, ?int $instanceId = null, ?array $labels = null): self
    {
        return new self(
            self::METRIC_NAME_ENGAGEMENT,
            $value,
            new DateTime(),
            $userId,
            self::METRIC_TYPE_GAUGE,
            $instanceId,
            $labels
        );
    }
}
