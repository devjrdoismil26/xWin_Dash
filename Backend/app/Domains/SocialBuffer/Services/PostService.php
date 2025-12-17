<?php

namespace App\Domains\SocialBuffer\Services;

use App\Domains\SocialBuffer\Contracts\PostServiceInterface;
use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\PostModel;

class PostService implements PostServiceInterface
{
    public function __construct(private PostModel $posts)
    {
    }

    public function create(array $data): PostModel
    {
        return $this->posts->create($data);
    }

    public function publishImmediately(int $postId): bool
    {
        if ($post = $this->posts->find($postId)) {
            $post->status = 'published';
            return $post->save();
        }
        return false;
    }

    public function schedule(int $postId, \DateTimeInterface $when): bool
    {
        if ($post = $this->posts->find($postId)) {
            $post->scheduled_at = $when;
            $post->status = 'scheduled';
            return $post->save();
        }
        return false;
    }
}
