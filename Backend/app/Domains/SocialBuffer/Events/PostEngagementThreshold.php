<?php

namespace App\Domains\SocialBuffer\Events;

use App\Domains\SocialBuffer\Models\Post;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostEngagementThreshold
{
    use Dispatchable;
    use SerializesModels;

    public Post $post;

    public string $metric;

    public float $value;

    public function __construct(Post $post, string $metric, float $value)
    {
        $this->post = $post;
        $this->metric = $metric;
        $this->value = $value;
    }
}
