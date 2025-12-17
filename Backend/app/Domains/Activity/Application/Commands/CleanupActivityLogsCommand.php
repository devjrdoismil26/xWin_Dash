<?php

namespace App\Domains\Activity\Application\Commands;

class CleanupActivityLogsCommand
{
    public function __construct(
        public readonly ?string $olderThan = null,
        public readonly ?string $action = null,
        public readonly ?string $level = null,
        public readonly ?bool $dryRun = false
    ) {
    }

    public function toArray(): array
    {
        return [
            'older_than' => $this->olderThan,
            'action' => $this->action,
            'level' => $this->level,
            'dry_run' => $this->dryRun
        ];
    }
}
