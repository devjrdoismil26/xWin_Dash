<?php

namespace App\Domains\SocialBuffer\Contracts;

use App\Domains\SocialBuffer\DTOs\PublishResultDTO;
use App\Domains\SocialBuffer\Models\Post;
use App\Domains\SocialBuffer\Models\SocialAccount;

interface PublisherInterface
{
    public function publish(Post $post, SocialAccount $socialAccount): PublishResultDTO;
}
