<?php

namespace App\Domains\Users\Application\Commands;

class DeleteUserCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly bool $forceDelete = false,
        public readonly bool $transferData = false,
        public readonly ?int $transferToUserId = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'force_delete' => $this->forceDelete,
            'transfer_data' => $this->transferData,
            'transfer_to_user_id' => $this->transferToUserId
        ];
    }
}
