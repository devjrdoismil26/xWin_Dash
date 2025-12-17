<?php

namespace App\Domains\Analytics\Application\Services;

use Illuminate\Support\Collection;

class TrendAnalysisService
{
    public function analyzeTrend(array $data, string $metric): array
    {
        $values = collect($data)->pluck($metric)->toArray();
        
        return [
            'direction' => $this->calculateDirection($values),
            'strength' => $this->calculateStrength($values),
            'forecast' => $this->forecastNext($values),
            'volatility' => $this->calculateVolatility($values),
        ];
    }

    public function comparePeriodsAnalyze(array $current, array $previous): array
    {
        return [
            'change_percent' => $this->calculateChangePercent($current, $previous),
            'absolute_change' => $this->calculateAbsoluteChange($current, $previous),
            'trend' => $this->determineTrend($current, $previous),
        ];
    }

    private function calculateDirection(array $values): string
    {
        if (count($values) < 2) return 'stable';
        
        $first = reset($values);
        $last = end($values);
        
        if ($last > $first * 1.05) return 'up';
        if ($last < $first * 0.95) return 'down';
        return 'stable';
    }

    private function calculateStrength(array $values): float
    {
        return 0.0;
    }

    private function forecastNext(array $values, int $periods = 1): array
    {
        return [];
    }

    private function calculateVolatility(array $values): float
    {
        if (count($values) < 2) return 0.0;
        
        $mean = array_sum($values) / count($values);
        $variance = array_sum(array_map(fn($v) => pow($v - $mean, 2), $values)) / count($values);
        
        return sqrt($variance);
    }

    private function calculateChangePercent(array $current, array $previous): float
    {
        $currentSum = array_sum($current);
        $previousSum = array_sum($previous);
        
        if ($previousSum == 0) return 0.0;
        
        return (($currentSum - $previousSum) / $previousSum) * 100;
    }

    private function calculateAbsoluteChange(array $current, array $previous): float
    {
        return array_sum($current) - array_sum($previous);
    }

    private function determineTrend(array $current, array $previous): string
    {
        $change = $this->calculateChangePercent($current, $previous);
        
        if ($change > 5) return 'positive';
        if ($change < -5) return 'negative';
        return 'stable';
    }
}
