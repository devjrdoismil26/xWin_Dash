<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GetPostsCommand;
use App\Domains\SocialBuffer\Models\Post;
use Illuminate\Pagination\LengthAwarePaginator;

class GetPostsUseCase
{
    public function execute(GetPostsCommand $command): LengthAwarePaginator
    {
        $query = Post::where('user_id', $command->userId);

        if ($command->projectId) {
            $query->where('project_id', $command->projectId);
        }

        if ($command->status) {
            $query->where('status', $command->status);
        }

        if ($command->postType) {
            $query->where('post_type', $command->postType);
        }

        return $query->with(['project', 'lead', 'schedules.socialAccount'])
                     ->orderBy($command->sortBy, $command->sortOrder)
                     ->paginate($command->perPage);
    }
}
