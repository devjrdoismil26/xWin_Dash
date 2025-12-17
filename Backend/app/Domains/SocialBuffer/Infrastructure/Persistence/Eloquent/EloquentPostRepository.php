<?php

namespace App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Domain\PostRepositoryInterface;
use App\Domains\SocialBuffer\Models\SocialPost;
use App\Domains\SocialBuffer\Domain\Post as DomainPost;

class EloquentPostRepository implements PostRepositoryInterface
{
    public function save(DomainPost $post): DomainPost
    {
        $model = $post->id ? SocialPost::findOrFail($post->id) : new SocialPost();
        
        $model->fill([
            'user_id' => $post->userId,
            'content' => $post->content,
            'title' => $post->title,
            'description' => $post->description,
            'status' => $post->status->value,
            'type' => $post->type->value,
            'priority' => $post->priority->value,
            'scheduled_at' => $post->scheduledAt,
            'published_at' => $post->publishedAt,
            'failed_at' => $post->failedAt,
            'link_url' => $post->linkUrl,
            'hashtags' => $post->hashtags,
            'mentions' => $post->mentions,
            'metadata' => $post->metadata,
        ]);
        
        $model->save();
        
        if (!empty($post->socialAccountIds)) {
            $model->socialAccounts()->sync($post->socialAccountIds);
        }
        
        $post->id = $model->id;
        return $post;
    }

    public function findById(int $id): ?DomainPost
    {
        $model = SocialPost::with(['socialAccounts', 'media'])->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    public function findByUserId(int $userId, array $filters = []): array
    {
        $query = SocialPost::byUser($userId)->with(['socialAccounts', 'media']);
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['scheduled_from'])) {
            $query->where('scheduled_at', '>=', $filters['scheduled_from']);
        }
        
        return $query->orderBy('scheduled_at', 'desc')
            ->get()
            ->map(fn($m) => $this->toDomain($m))
            ->toArray();
    }

    public function delete(int $id): bool
    {
        return SocialPost::destroy($id) > 0;
    }

    private function toDomain(SocialPost $model): DomainPost
    {
        return new DomainPost(
            content: $model->content,
            status: \App\Domains\SocialBuffer\Domain\ValueObjects\PostStatus::from($model->status),
            userId: $model->user_id,
            type: \App\Domains\SocialBuffer\Domain\ValueObjects\PostType::from($model->type),
            priority: \App\Domains\SocialBuffer\Domain\ValueObjects\PostPriority::from($model->priority),
            title: $model->title,
            description: $model->description,
            linkUrl: $model->link_url,
            scheduledAt: $model->scheduled_at,
            publishedAt: $model->published_at,
            socialAccountIds: $model->socialAccounts->pluck('id')->toArray(),
            hashtags: $model->hashtags,
            mentions: $model->mentions,
            metadata: $model->metadata,
            id: $model->id
        );
    }
}
