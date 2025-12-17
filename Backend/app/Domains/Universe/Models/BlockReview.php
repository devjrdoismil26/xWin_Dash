<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlockReview extends Model
{
    use HasFactory;

    protected $table = 'universe_block_reviews';

    protected $fillable = [
        'user_id',
        'block_id',
        'rating',
        'title',
        'content',
        'is_verified',
        'helpful_count',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified' => 'boolean',
        'helpful_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(BlockMarketplace::class, 'block_id');
    }

    // Scopes
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByBlock($query, $blockId)
    {
        return $query->where('block_id', $blockId);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeWithRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    // Methods
    public function incrementHelpful(): void
    {
        $this->increment('helpful_count');
    }

    public function getRatingStars(): string
    {
        return str_repeat('★', $this->rating) . str_repeat('☆', 5 - $this->rating);
    }

    public function getRatingText(): string
    {
        return match ($this->rating) {
            1 => 'Poor',
            2 => 'Fair',
            3 => 'Good',
            4 => 'Very Good',
            5 => 'Excellent',
            default => 'Unknown'
        };
    }

    public function getExcerpt(int $length = 100): string
    {
        return strlen($this->content) > $length
            ? substr($this->content, 0, $length) . '...'
            : $this->content;
    }

    public function isHelpful(): bool
    {
        return $this->helpful_count > 0;
    }
}
