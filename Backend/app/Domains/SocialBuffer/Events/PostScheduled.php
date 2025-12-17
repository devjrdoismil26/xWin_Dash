<?php

namespace App\Domains\SocialBuffer\Events;

use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\Schedule;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostScheduled
{
    use Dispatchable;
    use SerializesModels;

    public Post $post;

    public Schedule $schedule;

    public function __construct(Post $post, Schedule $schedule)
    {
        $this->post = $post;
        $this->schedule = $schedule;
    }
}
