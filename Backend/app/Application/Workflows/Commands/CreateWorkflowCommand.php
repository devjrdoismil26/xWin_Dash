<?php

namespace App\Application\Workflows\Commands;

class CreateWorkflowCommand
{
    public string $name;

    public ?string $description;

    /**
     * @var array<string, mixed>
     */
    public array $structure;

    public int $userId;

    /**
     * @param array<string, mixed> $structure
     */
    public function __construct(string $name, array $structure, int $userId, ?string $description = null)
    {
        $this->name = $name;
        $this->structure = $structure;
        $this->userId = $userId;
        $this->description = $description;
    }
}
