<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $template_id
 * @property int $user_id
 * @property int $rating
 * @property string|null $comment
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read UniverseTemplate $template
 * @property-read User $user
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class UniverseTemplateRating extends Model
{
    use HasFactory;

    protected $table = 'universe_template_ratings';

    protected $fillable = [
        'template_id',
        'user_id',
        'rating',
        'comment',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relacionamento com template.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(UniverseTemplate::class, 'template_id');
    }

    /**
     * Relacionamento com usuário.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
