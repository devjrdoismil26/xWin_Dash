<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\CreatePostCommand;
use App\Application\SocialBuffer\Commands\DuplicatePostCommand;
use App\Domains\SocialBuffer\Models\Post;

class DuplicatePostUseCase
{
    public function __construct(private readonly CreatePostUseCase $createPostUseCase)
    {
    }

    public function execute(DuplicatePostCommand $command): Post
    {
        $post = $command->post;

        $createPostCommand = new CreatePostCommand(
            userId: $post->user_id,
            projectId: $post->project_id,
            leadId: $post->lead_id,
            content: $post->content . ' (Cópia)',
            postType: $post->post_type,
            platformSpecificContent: $post->platform_specific_content,
            mediaUrls: $post->media_urls,
            hashtags: $post->hashtags,
            mentions: $post->mentions,
            status: 'draft',
        );

        return $this->createPostUseCase->execute($createPostCommand);
    }
}
