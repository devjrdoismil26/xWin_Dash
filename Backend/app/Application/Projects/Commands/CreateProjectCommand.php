<?php

namespace App\Application\Projects\Commands;

class CreateProjectCommand
{
    public string $name;

    public ?string $description;

    public int $userId;

    public function __construct(string $name, int $userId, ?string $description = null)
    {
        $this->name = $name;
        $this->userId = $userId;
        $this->description = $description;
    }
}
