<?php

namespace App\Domains\Core\Contracts;

interface Module
{
    public function getName(): string;

    public function boot(): void;
}
