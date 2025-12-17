<?php

namespace App\Domains\ADStool\Contracts;

use DateTimeInterface;

interface AdsPlatformService
{
    public function createCampaign(string $name, float $budget, DateTimeInterface $startDate, DateTimeInterface $endDate): string;

    public function getPlatformName(): string;
}
