<?php

namespace App\Domains\Users\Events;

use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserActivated
{
    use Dispatchable;
    use SerializesModels;

    public UserModel $user;

    public string $actorId;

    /**
     * Create a new event instance.
     */
    public function __construct(UserModel $user, string $actorId)
    {
        $this->user = $user;
        $this->actorId = $actorId;
    }
}
