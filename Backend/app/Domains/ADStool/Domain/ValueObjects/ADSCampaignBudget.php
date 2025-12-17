<?php

namespace App\Domains\ADStool\Domain\ValueObjects;

use DateTime;
use InvalidArgumentException;

class ADSCampaignBudget
{
    private float $dailyBudget;
    private ?DateTime $startDate;
    private ?DateTime $endDate;

    public function __construct(
        float $dailyBudget,
        ?DateTime $startDate = null,
        ?DateTime $endDate = null
    ) {
        $this->validateDailyBudget($dailyBudget);
        $this->validateDateRange($startDate, $endDate);

        $this->dailyBudget = $dailyBudget;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public static function create(
        float $dailyBudget,
        ?DateTime $startDate = null,
        ?DateTime $endDate = null
    ): self {
        return new self($dailyBudget, $startDate, $endDate);
    }

    public function getDailyBudget(): float
    {
        return $this->dailyBudget;
    }

    public function getStartDate(): ?DateTime
    {
        return $this->startDate;
    }

    public function getEndDate(): ?DateTime
    {
        return $this->endDate;
    }

    public function setDailyBudget(float $dailyBudget): self
    {
        $this->validateDailyBudget($dailyBudget);
        return new self($dailyBudget, $this->startDate, $this->endDate);
    }

    public function setDateRange(?DateTime $startDate, ?DateTime $endDate): self
    {
        $this->validateDateRange($startDate, $endDate);
        return new self($this->dailyBudget, $startDate, $endDate);
    }

    public function getTotalBudget(): float
    {
        if (!$this->startDate || !$this->endDate) {
            return 0;
        }

        $days = $this->getCampaignDays();
        return $this->dailyBudget * $days;
    }

    public function getCampaignDays(): int
    {
        if (!$this->startDate || !$this->endDate) {
            return 0;
        }

        return $this->startDate->diff($this->endDate)->days + 1;
    }

    public function getRemainingDays(): int
    {
        if (!$this->endDate) {
            return 0;
        }

        $now = new DateTime();
        if ($now >= $this->endDate) {
            return 0;
        }

        return $now->diff($this->endDate)->days;
    }

    public function getRemainingBudget(): float
    {
        return $this->getRemainingDays() * $this->dailyBudget;
    }

    public function getSpentBudget(): float
    {
        return $this->getTotalBudget() - $this->getRemainingBudget();
    }

    public function getBudgetUtilization(): float
    {
        $totalBudget = $this->getTotalBudget();
        if ($totalBudget === 0) {
            return 0;
        }

        return ($this->getSpentBudget() / $totalBudget) * 100;
    }

    public function isActive(): bool
    {
        if (!$this->startDate || !$this->endDate) {
            return false;
        }

        $now = new DateTime();
        return $now >= $this->startDate && $now <= $this->endDate;
    }

    public function isScheduled(): bool
    {
        if (!$this->startDate) {
            return false;
        }

        $now = new DateTime();
        return $now < $this->startDate;
    }

    public function isEnded(): bool
    {
        if (!$this->endDate) {
            return false;
        }

        $now = new DateTime();
        return $now > $this->endDate;
    }

    public function getFormattedDailyBudget(): string
    {
        return '$' . number_format($this->dailyBudget, 2);
    }

    public function getFormattedTotalBudget(): string
    {
        return '$' . number_format($this->getTotalBudget(), 2);
    }

    public function getFormattedRemainingBudget(): string
    {
        return '$' . number_format($this->getRemainingBudget(), 2);
    }

    public function getFormattedSpentBudget(): string
    {
        return '$' . number_format($this->getSpentBudget(), 2);
    }

    public function isWithinLimits(float $minBudget, float $maxBudget): bool
    {
        return $this->dailyBudget >= $minBudget && $this->dailyBudget <= $maxBudget;
    }

    public function exceedsLimit(float $maxBudget): bool
    {
        return $this->dailyBudget > $maxBudget;
    }

    public function isBelowMinimum(float $minBudget): bool
    {
        return $this->dailyBudget < $minBudget;
    }

    public function getBudgetRecommendation(): string
    {
        if ($this->dailyBudget < 10) {
            return 'Consider increasing budget for better performance';
        } elseif ($this->dailyBudget > 1000) {
            return 'High budget - monitor performance closely';
        } else {
            return 'Budget within recommended range';
        }
    }

    public function getBudgetStatus(): string
    {
        $utilization = $this->getBudgetUtilization();

        if ($utilization < 25) {
            return 'low_utilization';
        } elseif ($utilization < 75) {
            return 'normal_utilization';
        } elseif ($utilization < 95) {
            return 'high_utilization';
        } else {
            return 'critical_utilization';
        }
    }

    public function getBudgetStatusColor(): string
    {
        return match ($this->getBudgetStatus()) {
            'low_utilization' => 'yellow',
            'normal_utilization' => 'green',
            'high_utilization' => 'orange',
            'critical_utilization' => 'red',
            default => 'gray'
        };
    }

    public function toArray(): array
    {
        return [
            'daily_budget' => $this->dailyBudget,
            'daily_budget_formatted' => $this->getFormattedDailyBudget(),
            'start_date' => $this->startDate?->format('Y-m-d H:i:s'),
            'end_date' => $this->endDate?->format('Y-m-d H:i:s'),
            'total_budget' => $this->getTotalBudget(),
            'total_budget_formatted' => $this->getFormattedTotalBudget(),
            'remaining_budget' => $this->getRemainingBudget(),
            'remaining_budget_formatted' => $this->getFormattedRemainingBudget(),
            'spent_budget' => $this->getSpentBudget(),
            'spent_budget_formatted' => $this->getFormattedSpentBudget(),
            'campaign_days' => $this->getCampaignDays(),
            'remaining_days' => $this->getRemainingDays(),
            'budget_utilization' => $this->getBudgetUtilization(),
            'budget_status' => $this->getBudgetStatus(),
            'budget_status_color' => $this->getBudgetStatusColor(),
            'is_active' => $this->isActive(),
            'is_scheduled' => $this->isScheduled(),
            'is_ended' => $this->isEnded(),
            'budget_recommendation' => $this->getBudgetRecommendation(),
        ];
    }

    public function equals(ADSCampaignBudget $other): bool
    {
        return $this->dailyBudget === $other->dailyBudget
            && $this->startDate?->format('Y-m-d H:i:s') === $other->startDate?->format('Y-m-d H:i:s')
            && $this->endDate?->format('Y-m-d H:i:s') === $other->endDate?->format('Y-m-d H:i:s');
    }

    private function validateDailyBudget(float $dailyBudget): void
    {
        if ($dailyBudget <= 0) {
            throw new InvalidArgumentException('Daily budget must be greater than 0');
        }

        if ($dailyBudget > 10000) {
            throw new InvalidArgumentException('Daily budget cannot exceed $10,000');
        }
    }

    private function validateDateRange(?DateTime $startDate, ?DateTime $endDate): void
    {
        if ($startDate && $endDate && $startDate >= $endDate) {
            throw new InvalidArgumentException('Start date must be before end date');
        }

        if ($startDate && $startDate < new DateTime()) {
            throw new InvalidArgumentException('Start date cannot be in the past');
        }
    }
}
