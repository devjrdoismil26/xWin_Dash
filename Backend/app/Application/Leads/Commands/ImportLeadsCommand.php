<?php

namespace App\Application\Leads\Commands;

class ImportLeadsCommand
{
    public $file;
    public int $userId;
    public ?string $batchId;
    public ?array $options;

    public function __construct(
        $file,
        int $userId,
        ?string $batchId = null,
        ?array $options = null
    ) {
        $this->file = $file;
        $this->userId = $userId;
        $this->batchId = $batchId;
        $this->options = $options ?? [];
    }
}